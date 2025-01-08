import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import authMiddleware from "../middleware/authMiddleware.js";
import authRoutes from "../routes/authRoutes.js";

export default async (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: "*", // or specify your Flutter app's URL
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  //   app.use("/images", express.static(path.join(__dirname, "images")));
  app.use("/api/auth", authRoutes);

  return app;
};
