const Sequelize = require("sequelize");
const sequelize = require("./index");

const Store = sequelize.define("tks", {
  id: {
    type: Sequelize.INTEGER(20),
    allowNull: false,
    autoIncrement: false,
    primaryKey: true,
  },
  tk_id: {
    type: Sequelize.INTEGER(20),
  },
  checkout: {
    type: Sequelize.INTEGER(20),
  },
  base: {
    type: Sequelize.INTEGER(20),
  },
  status: {
    type: Sequelize.STRING(255),
  },
  update_date: {
    type: Sequelize.DATE(11),
  },
  create_date: {
    type: Sequelize.DATE(11),
  },
  theme_id: {
    type: Sequelize.INTEGER(20),
  },
  script_id: {
    type: Sequelize.STRING(255),
  },
  confirm: {
    type: Sequelize.STRING(255),
  },
  token: {
    type: Sequelize.STRING(225),
  },
  host: {
    type: Sequelize.STRING(225),
  },
  type: {
    type: Sequelize.INTEGER(1),
    defaultValue: 0,
  },
  email: {
    type: Sequelize.STRING(100),
  },
  charge_id: {
    type: Sequelize.STRING(225),
  },
  shop: {
    type: Sequelize.STRING(225),
  },
});

module.exports = Store;
