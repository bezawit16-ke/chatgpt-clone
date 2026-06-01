import { createConversationService,getRecentConversationsRows } from "../service/chat.service.js";


// 1. Post a new conversation message
export async function createConversationController(req, res) {
  try {
   const { question } = req.body;

    // Await the response from your service database layer
    const result = await createConversationService(question);

    // Send the database result back to the frontend
      res.status(201).json({
          success: true,
          message: "Conversation created successfully",
          data: result,
        
    });
  } catch (error) {
    throw error;
  }
}

// 2. Get all stored conversations
export async function getConversationsController(req, res) {
  try {

const result = await getRecentConversationsRows(100);
res.status(200).json({
  success: true,
  message: "Conversations fetched successfully.",
  data: result,
});
  
    
  } catch (error) {
    throw error;
  }
}
