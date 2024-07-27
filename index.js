import express from "express";
import db from "./config/Database.js";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import KostModel from "./models/KostModel.js";
import Users from "./models/UserModel.js";

dotenv.config();

const app = express();

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

async function connectToDatabase() {
  try {
    await db.authenticate();
    console.log("Database Connected...");
    await KostModel.sync();
    console.log("KostModel synchronized");
    await Users.sync();
    console.log("Users model synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

connectToDatabase();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(_dirname, "uploads")));

app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log("Server is running on port 3000")
);
