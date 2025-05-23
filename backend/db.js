import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }, // Aiven requires SSL
  });
  
  // Check connection
  db.connect((err) => {
    if (err) {
      console.error("❌ MySQL connection failed:", err.message);
    } else {
      console.log("✅ Connected to Aiven MySQL");
    }
  });
