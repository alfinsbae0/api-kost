import { Sequelize } from "sequelize";

const db = new Sequelize("express_1", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
