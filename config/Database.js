// import { Sequelize } from "sequelize";

// const db = new Sequelize("express_1", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

// export default db;

import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: mysql2,
  }
);

export default db;
