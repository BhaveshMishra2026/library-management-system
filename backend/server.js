const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "1234") {
    res.json({ token: "mytoken123" });
  } else {
    res.send("Invalid credentials");
  }
});

// TOKEN
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token === "mytoken123") next();
  else res.send("Access Denied");
};

// BOOKS
app.get("/books", verifyToken, (req, res) => {
  pool.query("SELECT * FROM books ORDER BY id ASC", (err, result) => {
    if (err) res.send({ error: true });
    else res.send(result.rows);
  });
});

app.post("/addBook", verifyToken, (req, res) => {
  const { title, author } = req.body;

  pool.query(
    "INSERT INTO books (title, author) VALUES ($1,$2) RETURNING *",
    [title, author],
    (err, result) => {
      if (err) res.send({ error: true });
      else res.send(result.rows[0]);
    }
  );
});

app.delete("/deleteBook/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  pool.query("DELETE FROM books WHERE id=$1", [id], (err) => {
    if (err) res.send({ error: true });
    else res.send("Deleted");
  });
});

// STUDENTS
app.get("/students", verifyToken, (req, res) => {
  pool.query("SELECT * FROM students ORDER BY id ASC", (err, result) => {
    if (err) res.send({ error: true });
    else res.send(result.rows);
  });
});

app.post("/addStudent", verifyToken, (req, res) => {
  const { name, course, email } = req.body;

  pool.query(
    "INSERT INTO students (name, course, email) VALUES ($1,$2,$3) RETURNING *",
    [name, course, email],
    (err, result) => {
      if (err) res.send({ error: true });
      else res.send(result.rows[0]);
    }
  );
});

app.listen(5000, () => console.log("Server running..."));