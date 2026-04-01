const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔐 Simple Login API (hardcoded)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "1234") {
    res.json({ token: "mytoken123" });
  } else {
    res.send("Invalid credentials");
  }
});

// 🔒 Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token === "mytoken123") {
    next();
  } else {
    res.send("Access Denied");
  }
};

// 📚 Get Books (Protected)
app.get("/books", verifyToken, (req, res) => {
  pool.query("SELECT * FROM books", (err, result) => {
    if (err) {
      console.log(err);
      res.send({ error: true });
    } else {
      res.send(result.rows);
    }
  });
});

// ➕ Add Book (Protected)
app.post("/addBook", verifyToken, (req, res) => {
  const { title, author } = req.body;

  pool.query(
    "INSERT INTO books (title, author) VALUES ($1, $2)",
    [title, author],
    (err) => {
      if (err) {
        console.log(err);
        res.send({ error: true });
      } else {
        res.send("Book Added");
      }
    }
  );
});

// ❌ Delete Book (Protected)
app.delete("/deleteBook/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  pool.query("DELETE FROM books WHERE id=$1", [id], (err) => {
    if (err) {
      console.log(err);
      res.send({ error: true });
    } else {
      res.send("Book Deleted");
    }
  });
});

// SERVER START
app.listen(5000, () => {
  console.log("Server running...");
});