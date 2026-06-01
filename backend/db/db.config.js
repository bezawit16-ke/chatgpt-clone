import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
});

async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        token_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ✅ safe way to add column
    await db
      .query(
        `
      ALTER TABLE conversations 
      ADD COLUMN token_count INT DEFAULT 0
    `,
      )
      .catch(() => {
        console.log("token_count column already exists, skipping...");
      });

    console.log("Table ready!");
  } catch (error) {
    console.error("DB init error:", error.message);
  }
}

initDB();

export default db;
