const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:[N5xLF2OzGiIblznn]@db.cdubbljidemvblbvtaxl.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false }
});


db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Database connected");
  }
});

db.connect((err)=>{
if(err){
console.log(err);
}else{
console.log("Connected to MySQL");
}
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