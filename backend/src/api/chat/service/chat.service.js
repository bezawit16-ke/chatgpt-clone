
import { Connection } from "mysql2";
import db from "../../../../db/db.config.js";
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = process.env.GEMNI_MODEL || "models/gemini-2.5-flash";
// const createGeminiClient = () => {
//   if (!process.env.GEMINI_API_KEY) {
//     throw new Error("GEMINI_API_KEY is not set in environment variables");
//     } 
    const gemniClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });



export const getRecentConversationsRows = async (limit = 5) => {
     const normalizedLimit = parseInt(limit, 10);
    const safeLimit =
        isNaN(normalizedLimit) ||  normalizedLimit <= 0
        ? 20
        : normalizedLimit;
    const [rows] = await db.execute(
        `SELECT id,role,content,created_at
        FROM conversations
         ORDER BY created_at DESC
         LIMIT ${safeLimit}`,
    );
    return rows;
};

const generateAssistantAnswer = async ({ historyRows, question }) => {
    //format history for gemini
    const fromattedHistory = [...historyRows].map((row) => ({
        role: row.role === "assistant" ? "model" : "user",
        parts: [{ text: row.content }],
    }));




    const chat = gemniClient.chats.create({
        model: GEMINI_MODEL,
        config: {
            maxOutputTokens: 1000,
            systemInstructions: `  You are a helpful assistant that provides concise and accurate answers.
                Always answer in a clear and concise manner. If you don't know the answer, say you don't know.`
        },
          
        history: fromattedHistory,
    });


    const result = await chat.sendMessage({ message: question });
    console.log(result.usageMetadata.totalTokenCount);
    return {
        text: result.text,
        totalTokens: result.usageMetadata.totalTokenCount
    };
};


const getMessageById = async (messageId) => {
  const [rows] = await db.execute(
    "SELECT id, role, content, token_count, created_at FROM conversations WHERE id = ? LIMIT 1",
    [messageId],
  );

  if (!rows[0]) return null;

  return {
    id: rows[0].id,
    role: rows[0].role,
    content: rows[0].content,
    tokenCount: Number(rows[0].token_count || 0),
    createdAt: rows[0].created_at,
  };
};





export async function createConversationService(question) {
    try {

//validation 
if (!question.trim() ) {
    const error = new Error("Invalid question format");
    error.status = 400;
    throw error;
}
        // //save to db
        // await db.execute("INSERT INTO conversations (content) VALUES (?)", [
        //   question,
        // ]);
  
        
//get recent conversations
const historyRows = await getRecentConversationsRows(5);
        // insert new conversation
        const [result] = await db.execute(
          "INSERT INTO conversations (role, content) VALUES (?, ?)",
          ["user", question.trim()],
        );

        const { text, totalTokens } = await generateAssistantAnswer({ historyRows, question });

const [createAssistantMessageResult] = await db.execute(
  "INSERT INTO conversations (role, content, token_count) VALUES (?, ?, ?)",
  ["assistant", text, totalTokens],
);

const userConversations = await getMessageById(result.insertId);
const assistantConversation = await getMessageById(createAssistantMessageResult.insertId);


        return {
           userConversations,
            assistantConversation,
        }
    } catch (error) {
        throw error;
    }
}
