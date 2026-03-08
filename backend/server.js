const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
 Host: "sql12.freesqldatabase.com",
  user: "sql12819299",
  password: "sABVDH3sss",
  database: "sql12819299"
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

app.post("/addBook",(req,res)=>{

const title = req.body.title;
const author = req.body.author;

const sql = "INSERT INTO books (title,author) VALUES (?,?)";

db.query(sql,[title,author],(err,result)=>{
if(err){
console.log(err);
}else{
res.send("Book Added");
}
});

});

app.get("/books",(req,res)=>{

db.query("SELECT * FROM books",(err,result)=>{
if(err){
console.log(err);
}else{
res.send(result);
}
});

});

app.listen(5000,()=>{
console.log("Server running on port 5000");
});



app.delete("/deleteBook/:id",(req,res)=>{

const id = req.params.id;

db.query(
"DELETE FROM books WHERE id = ?",
[id],
(err,result)=>{
if(err){
console.log(err);
}else{
res.send("Book Deleted");
}
}
);

});
