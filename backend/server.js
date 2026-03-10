const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});




app.get("/",(req,res)=>{
res.send("Server Running");
});



app.get("/books", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.send({ error: true });
  }
});

app.post("/addBook", async (req, res) => {
  try {
    const { title, author } = req.body;
    await pool.query(
      "INSERT INTO books(title,author) VALUES($1,$2)",
      [title, author]
    );
    res.send("Book Added");
  } catch (err) {
    console.log(err);
  }
});

app.delete("/deleteBook/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM books WHERE id=$1", [id]);
    res.send("Book Deleted");
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});