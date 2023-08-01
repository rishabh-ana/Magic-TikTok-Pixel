const koaBody = require("koa-body");
const Router = require("koa-router");
const router = new Router();
const Store = require("../model/store");
const Sequelize = require("sequelize");
const checkCharge = require("../install/checkCharge");

router.get("/store", async (ctx, next) => {
  const store = await Store.findAll({
    // searchAll
    where: {
      is_delete: 0,
    },
  });
  ctx.body = store;
});
router.post("/store/getid", koaBody(), async (ctx) => {
  const store = await Store.findAll({
    where: {
      shop: ctx.request.body.shop,
    },
  });
  ctx.body = store;
});
router.post("/store", koaBody(), async (ctx) => {
  const store = await Store.build(ctx.request.body).save();
  ctx.body = store;
});

router.put("/store/:id", koaBody(), async (ctx) => {
  const body = ctx.request.body;
  const store = await Store.findByPk(ctx.params.id);
  await store.update({ ...body });
  ctx.body = store;
});

router.post("/store/search/tk_id", koaBody(), async (ctx) => {
  const body = ctx.request.body;
  const store = await Store.findAll({
    attributes: ["tk_id"],
    where: {
      id: { [Sequelize.Op.eq]: `${body.search}` },
    },
  });
  ctx.body = store;
});

router.post("/store/search/date", koaBody(), async (ctx) => {
  const body = ctx.request.body;
  const store = await Store.findAll({
    attributes: ["create_date", "update_date"],
    where: {
      id: { [Sequelize.Op.eq]: `${body.search}` },
    },
  });
  ctx.body = store;
});

router.post("/store/search/status", koaBody(), async (ctx) => {
  const body = ctx.request.body;
  const store = await Store.findAll({
    attributes: ["status", "confirm"],
    where: {
      id: { [Sequelize.Op.eq]: `${body.search}` },
    },
  });
  ctx.body = store;
});

router.post("/store/search/event", koaBody(), async (ctx) => {
  const body = ctx.request.body;
  const store = await Store.findAll({
    attributes: ["base", "checkout", "tk_id"],
    where: {
      id: { [Sequelize.Op.eq]: `${body.search}` },
    },
  });
  ctx.body = store;
});

router.post("/store/search/theme_id", koaBody(), async (ctx) => {
  const body = ctx.request.body;
  const store = await Store.findAll({
    attributes: ["theme_id"],
    where: {
      id: { [Sequelize.Op.eq]: `${body.search}` },
    },
  });
  ctx.body = store;
});

router.post("/store/search/script_id", koaBody(), async (ctx) => {
  const body = ctx.request.body;
  const store = await Store.findAll({
    attributes: ["script_id"],
    where: {
      id: { [Sequelize.Op.eq]: `${body.search}` },
    },
  });
  ctx.body = store;
});

router.post("/store/getcharge/:id", async (ctx) => {
  const res = await checkCharge(ctx.params.id);
  ctx.body = res;
});

module.exports = router;
