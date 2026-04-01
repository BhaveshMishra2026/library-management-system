import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔐 LOGIN
  const login = () => {
    axios.post("https://book-api-vj3a.onrender.com/login", {
      email,
      password
    }).then((res) => {
      if(res.data.token){
        sessionStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
      } else {
        alert("Wrong credentials");
      }
    });
  };

  // CHECK LOGIN
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // GET BOOKS
  useEffect(() => {
    if(isLoggedIn){
      axios.get("https://book-api-vj3a.onrender.com/books", {
        headers: {
          Authorization: sessionStorage.getItem("token")
        }
      }).then((res) => {
        if(Array.isArray(res.data)){
          setBooks(res.data);
        }
      });
    }
  }, [isLoggedIn]);

  // ADD BOOK
  const addBook = () => {
    axios.post("https://book-api-vj3a.onrender.com/addBook",
      { title, author },
      {
        headers: {
          Authorization: sessionStorage.getItem("token")
        }
      }
    ).then(() => {
      alert("Book Added");
      window.location.reload();
    });
  };

  // DELETE BOOK
  const deleteBook = (id) => {
    axios.delete(`https://book-api-vj3a.onrender.com/deleteBook/${id}`, {
      headers: {
        Authorization: sessionStorage.getItem("token")
      }
    }).then(() => {
      alert("Deleted");
      window.location.reload();
    });
  };

  // 🔐 LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={login}>Login</button>
      </div>
    );
  }

  // 📚 MAIN UI
  return (
    <div className="container">
      <h1>LIBRARY MANAGEMENT SYSTEM</h1>

      <input
        placeholder="Book Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Author"
        onChange={(e) => setAuthor(e.target.value)}
      />
      <br /><br />

      <button onClick={addBook}>Add Book</button>

      <h2>Book List</h2>

      <table border="1" align="center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>
                <button onClick={() => deleteBook(book.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;