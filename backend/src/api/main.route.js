import express from "express";
import chatRouter from "./chat/chat.route.js";
const mainRouter = express.Router();



// mainRouter.use("/chat" ,(req, res) => {
//     res.send("Hello from chat");
// });

// /api/chat/conversations

mainRouter.use("/chat", chatRouter);

// /api/admin/

export default mainRouter;