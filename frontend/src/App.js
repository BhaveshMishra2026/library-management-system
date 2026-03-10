import "./App.css";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

function App() {

  const [books,setBooks] = useState([]);

  const [title,setTitle] = useState("");
  const [author,setAuthor] = useState("");

  const addBook = () => {
    axios.post("https://book-api-vj3a.onrender.com/addBook",{
      title:title,
      author:author
    })
    .then(()=>{
      alert("Book Added Successfully");
    });
  };

  const deleteBook = (id) => {

axios.delete("https://book-api-vj3a.onrender.com/deleteBook/"+id)
.then(()=>{
alert("Book Deleted");
window.location.reload();
});

};

  useEffect(()=>{
axios.get("https://book-api-vj3a.onrender.com/books")
.then((response)=>{
setBooks(response.data);
});
},[]);

  return (
    <div className="container">
  
      <h1>LIBRARY MANAGEMENT SYSTEM</h1>
      <p>~Submitted by Bhavesh mishra </p>

      <hr/>

      <input
        placeholder="Book Title"
        onChange={(e)=>setTitle(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Author"
        onChange={(e)=>setAuthor(e.target.value)}
      />

      <br/><br/>

      <button onClick={addBook}>Add Book</button>
      <hr/>

      <h2>Book List</h2>

<table border="1" align="center">


<tr>
<th>ID</th>
<th>Title</th>
<th>Author</th>
<th>Action</th>
</tr>


{books.map((book)=>{
return(
<tr key={book.id}>
<td>{book.id}</td>
<td>{book.title}</td>
<td>{book.author}</td>

<td>
<button className="delete-btn" onClick={()=>deleteBook(book.id)}>
Delete
</button>
</td>

</tr>
);
})}

</table>

    </div>
  );
}

export default App;