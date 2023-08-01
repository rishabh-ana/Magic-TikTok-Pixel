const Store = require("../model/store.js");

const getSubscriptionUrl = async (accessToken, shop, returnUrl, host) => {
  const query = JSON.stringify({
    query: `mutation {
      appSubscriptionCreate(
          name: "Unlimited"
          returnUrl: "${returnUrl}"
          trialDays: 90
          test:false
          lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: 9.95, currencyCode: USD }
              }
            }
          }
          ]
        ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
	            status
            }
        }
    }`,
  });

  const queryid = JSON.stringify({
    query: `{
        shop {
          id
          email
        }
      }`,
  });

  const webhookSubscription = JSON.stringify({
    query: `mutation {
        webhookSubscriptionCreate(topic: APP_SUBSCRIPTIONS_UPDATE, webhookSubscription: {callbackUrl: "${process.env.HOST}/webhooks/subscription/update", format: JSON}) {
          userErrors {
            field
            message
          }
          webhookSubscription {
            id
            endpoint {
              ... on WebhookHttpEndpoint {
                __typename
                callbackUrl
              }
            }
          }
        }
      }
      `,
  });

  const uninstallSubscription = JSON.stringify({
    query: `mutation {
        webhookSubscriptionCreate(topic: APP_UNINSTALLED, webhookSubscription: {callbackUrl: "${process.env.HOST}/webhooks/app/uninstall", format: JSON}) {
          userErrors {
            field
            message
          }
          webhookSubscription {
            id
            endpoint {
              ... on WebhookHttpEndpoint {
                __typename
                callbackUrl
              }
            }
          }
        }
      }
      `,
  });

  const responseid = await fetch(
    `https://${shop}/admin/api/2021-07/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: queryid,
    }
  );
  const responseId = await responseid.json();
  const config = require("../config/httpConfig.js");
  const id = config.ExtractId(responseId.data.shop.id);
  const email = config.ExtractId(responseId.data.shop.email);
  const user = await Store.findByPk(id);
  // old user
  if (user != null && (user.status == "ACTIVE" || user.status == "active")) {
    console.log("old user");
    await Store.update(
      {
        shop: shop,
        host: host,
        email: email,
        token: accessToken,
      },
      { where: { id: id } }
    );
    return returnUrl;
  }

  //return user
  const response = await fetch(
    `https://${shop}/admin/api/2021-07/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: query,
    }
  );

  await fetch(`https://${shop}/admin/api/2021-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: webhookSubscription,
  });

  await fetch(`https://${shop}/admin/api/2021-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: uninstallSubscription,
  });

  const responseJson = await response.json();
  const confirmationUrl =
    responseJson.data.appSubscriptionCreate.confirmationUrl;
  const status = responseJson.data.appSubscriptionCreate.appSubscription.status;
  const charge_id = responseJson.data.appSubscriptionCreate.appSubscription.id;
  if (user != null && (user.status != "ACTIVE" || user.status != "active")) {
    console.log("return user");
    await Store.update(
      {
        shop: shop,
        status: status,
        host: host,
        email: email,
        token: accessToken,
        charge_id: charge_id,
      },
      { where: { id: id } }
    );
    return confirmationUrl;
  }
  //new user
  const postData = {
    shop: shop,
    status: status,
    create_date: new Date(),
    id: id,
    token: accessToken,
    host: host,
    email: email,
    charge_id: charge_id,
  };

  await Store.create(postData);
  // sendEmail(email);

  return confirmationUrl;
};

module.exports = getSubscriptionUrl;
