import "dotenv/config";

import express from "express";
import db from "./db/db.config.js";
import { errorHandler } from "./src/middleware/error-handler.js";
import cors from "cors";

import mainRouter from "./src/api/main.route.js";


const app = express();
app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}));
app.use(express.json());
app.use('/api', mainRouter);



app.use(errorHandler) ;



// function logger(req, res, next) {
//   console.log(`${req.method} ${req.url}`);
//     next();
//     res.send("From logger middleware");
// }
// function logger2(req, res, next) {
//   console.log("This is the second logger middleware");
//     next();
//     res.send("From logger2 middleware");
// }

// function errorHandler(err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// }

// app.use('/api', logger);
// // app.use('/api', logger2);

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });
// app.get("/about", (req, res) => {
//     throw new Error("This is a test error");

// res.send("About Page");
// });
// app.get("/api/contact", (req, res) => {
//   res.send("Contact Page");
// });
// app.get("/api/Conversations", (req, res) => {
//   res.send("Conversations Page");
// });

// // app.use(errorHandler);

async function startServer() {
    try {
        const connection = await db.getConnection();
        connection.release();

    app.listen(4000, () => {
      console.log("Server is running on port http://localhost:4000");
    });
  } catch (error) {
    console.error("Error starting the server:", error.message);
  }
}

startServer();
