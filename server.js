require("isomorphic-fetch");
const dotenv = require("dotenv");
const Koa = require("koa");
const next = require("next");
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const { default: Shopify, ApiVersion } = require("@shopify/shopify-api");
const Router = require("koa-router");

const getSubscriptionUrl = require("./server/install/getSubscriptionUrl");
const updateSubscription = require("./server/install/updateSubscription");
const deleteUserData = require("./server/install/deleteUserData");
const appUninstall = require("./server/install/appUninstall");
const config = require("./server/config/httpConfig.js");
const routerDB = require("./server/router/routerDB");
const db = require("./server/database.js");

const cors = require("@koa/cors");
dotenv.config();

const port = parseInt(process.env.PORT, 10) || 1513;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const { receiveWebhook } = require("@shopify/koa-shopify-webhooks");

const ACTIVE_SHOPIFY_SHOPS = {};

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SHOPIFY_API_SCOPES.split(","),
  HOST_NAME: process.env.SHOPIFY_APP_URL.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.July21,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

app.prepare().then(async () => {
  var api_shop = "";
  var api_token = "";
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];

  server.use(cors());

  await server.use(
    createShopifyAuth({
      accessMode: "offline",
      async afterAuth(ctx) {
        const { shop, scope, accessToken } = ctx.state.shopify;
        api_shop = shop;
        api_token = accessToken;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/uninstallwebhook",
          topic: "APP_UNINSTALLED",
          apiVersion: ApiVersion.July21,
          webhookHandler: (_topic, shop, _body) => {
            appUninstall(shop);
            delete ACTIVE_SHOPIFY_SHOPS[shop];
          },
        });

        const returnUrl = `https://${Shopify.Context.HOST_NAME}?host=${host}&shop=${shop}`;
        const subscriptionUrl = await getSubscriptionUrl(
          accessToken,
          shop,
          returnUrl,
          host
        );
        ctx.redirect(subscriptionUrl);
      },
    })
  );

  router.get("/charge/:object", async (ctx) => {
    const results = await fetch(
      "https://" +
        api_shop +
        "/admin/api/2020-01/recurring_application_charges/" +
        ctx.params.object +
        ".json",
      {
        headers: {
          "X-Shopify-Access-Token": api_token,
        },
      }
    )
      .then(async (response) => await response.json())
      .then((res) => {
        return res;
      });
    ctx.body = {
      status: "success",
      data: results,
    };
  });

  //base code
  router.get("/themeJS/:object/:event/:handle", async (ctx) => {
    try {
      const results = fetch(
        "https://" + api_shop + "/admin/api/2020-01/themes.json",
        {
          headers: {
            "X-Shopify-Access-Token": api_token,
          },
        }
      )
        .then(async (response) => await response.json())
        .then(async (json) => {
          var theme_id = 0;
          for (var i = 0; i < json.themes.length; i++) {
            if (json.themes[i].role == "main") {
              theme_id = json.themes[i].id;
            }
          }
          const results2 = await fetch(
            "https://" +
              api_shop +
              "/admin/api/2020-01/themes/" +
              theme_id +
              "/assets.json?asset[key]=layout/theme.liquid",
            {
              headers: {
                "X-Shopify-Access-Token": api_token,
              },
            }
          )
            .then(async (response) => await response.json())
            .then(async (res) => {
              var final = "";
              if (
                ctx.params.event == "base" &&
                ctx.params.handle == "install"
              ) {
                final = config.InstallBaseCode(
                  res.asset.value,
                  ctx.params.object
                );
              }
              if (ctx.params.event == "base" && ctx.params.handle == "delete") {
                final = config.DeleteBaseCode(res.asset.value);
              }
              const postData = {
                asset: {
                  key: "layout/theme.liquid",
                  value: final,
                },
              };
              const results3 = await fetch(
                "https://" +
                  api_shop +
                  "/admin/api/2020-01/themes/" +
                  theme_id +
                  "/assets.json",
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": api_token,
                  },
                  body: JSON.stringify(postData),
                }
              )
                .then(async (response) => await response.json())
                .then((res) => {
                  return res;
                });
            });
        });
      ctx.body = {
        status: "success",
        data: results,
      };
    } catch (err) {
      console.log(err);
    }
  });
  //checkout
  router.post("/checkoutJS/:object", async (ctx) => {
    console.log("install checkout");
    const postData = {
      script_tag: {
        event: "onload",
        src: "https://cdn.shopify.com/s/files/1/0313/1447/7188/files/tiktok-v4.js?v=1600806006",
        display_scope: "order_status",
      },
    };
    let results = true;
    results = await fetch(
      "https://" + api_shop + "/admin/api/2021-07/script_tags.json",
      {
        headers: {
          "X-Shopify-Access-Token": api_token,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(postData),
      }
    )
      .then(async (response) => {
        await response.json();
      })
      .then(async (res) => {
        try {
          await db.query("UPDATE tks SET script_id=(?) WHERE id=(?)", [
            res.script_tag.id,
            ctx.params.object,
          ]);
        } catch (e) {
          return false;
        }
        return res;
      });
    ctx.body = {
      status: "success",
      data: results,
    };
  });
  //delete checkout
  router.delete("/deleteCheckout/:object", async (ctx) => {
    try {
      const results = fetch(
        "https://" +
          api_shop +
          "/admin/api/2020-01/script_tags/" +
          ctx.params.object +
          ".json",
        {
          headers: {
            "X-Shopify-Access-Token": api_token,
          },
          method: "DELETE",
        }
      )
        .then(async (response) => await response.json())
        .then((res) => {
          return res;
        });
      ctx.body = {
        status: "success",
        data: results,
      };
    } catch (err) {
      console.log(err);
    }
  });

  const webhook = receiveWebhook({ secret: process.env.SHOPIFY_API_SECRET });

  router.post("/webhooks/subscription/update", webhook, (ctx) => {
    console.log(ctx.request.body);
    ctx.response.status = 200;
    ctx.response.body = "OK";
    updateSubscription(
      ctx.request.body.app_subscription.admin_graphql_api_shop_id,
      ctx.request.body.app_subscription.status,
      ctx.request.body.app_subscription.updated_at
    ); //ctx.request.body.app_subscription.status
  });

  router.post("/webhooks/app/uninstall", webhook, (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = "OK";
    appUninstall(ctx.request.body.id, new Date());
  });

  router.post("/webhooks/customers/redact", webhook, (ctx) => {
    console.log(ctx.request.body);
    console.log("Got a webhook for customers/redact");
    ctx.response.status = 200;
    ctx.response.body = "OK";
  });
  router.post("/webhooks/shop/redact", webhook, (ctx) => {
    console.log(ctx.request.body);
    console.log("Got a webhook for shop/redact");
    ctx.response.status = 200;
    ctx.response.body = "OK";
  });
  router.post("/webhooks/customers/data_request", webhook, (ctx) => {
    console.log(ctx.request.body);
    console.log("Got a webhook for customers/data_request");
    deleteUserData(ctx.request.body.shop_id);
    ctx.response.status = 200;
    ctx.response.body = "OK";
  });

  router.post("/graphql", verifyRequest(), async (ctx, next) => {
    await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
  });

  router.post("/webhooks/app/uninstall", async (ctx) => {
    await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
    console.log(`Webhook processed with status code 200`);
  });

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.get("(/_next/static/.*)", handleRequest);
  router.get("/_next/webpack-hmr", handleRequest);
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;
    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.use(routerDB.routes());

  server.listen(port, () => {
    console.log(`> It's ready on http://localhost:${port}`);
  });
});
