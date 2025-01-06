import express from "express";
import App from "./services/express_app.js";
import { connectDB } from "./config/database.js";

const startServer = async () => {
  const app = express();
  const port = 8000;
  connectDB();
  await App(app);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

startServer();
