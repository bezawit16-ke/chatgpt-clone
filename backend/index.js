import "dotenv/config";

import express from "express";
import db from "./db/db.config.js";
import { errorHandler } from "./src/middleware/error-handler.js";
import cors from "cors";

import mainRouter from "./src/api/main.route.js";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://firstrealaiproject.netlify.app",
        "https://firstrealaiproject.netlify.app/",
        "http://localhost:5174",
        "http://localhost:5173",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api", mainRouter);

app.use(errorHandler);

async function startServer() {
  try {
    const connection = await db.getConnection();
    connection.release();

    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server is running on port ${process.env.PORT || 4000}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error.message);
  }
}

startServer();
