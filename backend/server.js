import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kaviya@080206",
  database: "accetconnect",
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Database connected");
  }
});

// Correct endpoint: ORDER BY event_date
app.get("/events", (req, res) => {
  const query = "SELECT * FROM events ORDER BY event_date DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err.sqlMessage || err });
    } else {
      res.json(results);
    }
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

