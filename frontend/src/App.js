import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [emailStudent, setEmailStudent] = useState("");

  const [totalBooks, setTotalBooks] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  // LOGIN
  const login = () => {
    axios.post("https://book-api-vj3a.onrender.com/login", {
      email, password
    }).then(res => {
      if (res.data.token) {
        sessionStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
      } else alert("Wrong credentials");
    });
  };

  // हर refresh पर logout
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  // FETCH DATA
  useEffect(() => {
    if (isLoggedIn) {

      axios.get("https://book-api-vj3a.onrender.com/books", {
        headers: { Authorization: sessionStorage.getItem("token") }
      }).then(res => {
        setBooks(res.data);
        setTotalBooks(res.data.length);
      });

      axios.get("https://book-api-vj3a.onrender.com/students", {
        headers: { Authorization: sessionStorage.getItem("token") }
      }).then(res => {
        setStudents(res.data);
        setTotalStudents(res.data.length);
      });
    }
  }, [isLoggedIn]);

  // ADD BOOK
  const addBook = () => {
    axios.post("https://book-api-vj3a.onrender.com/addBook",
      { title, author },
      { headers: { Authorization: sessionStorage.getItem("token") } }
    ).then(res => {
      setBooks([...books, res.data]);
      setTotalBooks(totalBooks + 1);
    });
  };

  // DELETE BOOK
  const deleteBook = (id) => {
    axios.delete(`https://book-api-vj3a.onrender.com/deleteBook/${id}`, {
      headers: { Authorization: sessionStorage.getItem("token") }
    }).then(() => {
      setBooks(books.filter(b => b.id !== id));
      setTotalBooks(totalBooks - 1);
    });
  };

  // ADD STUDENT
  const addStudent = () => {
    axios.post("https://book-api-vj3a.onrender.com/addStudent",
      { name, course, email: emailStudent },
      { headers: { Authorization: sessionStorage.getItem("token") } }
    ).then(res => {
      setStudents([...students, res.data]);
      setTotalStudents(totalStudents + 1);
    });
  };

  // LOGIN UI
  if (!isLoggedIn) {
    return (
      <div className="login">
        <h1 className="h1">LIBRARY MANAGEMENT SYSTEM</h1>
        <h2>Login</h2>
        <label>Enter the Email</label>
        <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        <br/>
        <label>Enter the Password</label>
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
        <br/>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div className="container">

      <h1 className="h1">LIBRARY MANAGEMENT SYSTEM</h1>
      <h2>Dashboard</h2>

      <div className="dashboard">
        <div className="card">
          <h3>Total Books</h3>
          <p>{totalBooks}</p>
        </div>

        <div className="card">
          <h3>Total Students</h3>
          <p>{totalStudents}</p>
        </div>
      </div>
      <hr/>

      <h2>Add Book</h2>
      <input placeholder="Title" onChange={(e)=>setTitle(e.target.value)} />
      <input placeholder="Author" onChange={(e)=>setAuthor(e.target.value)} />
      <button onClick={addBook}>Add Book</button>
      <hr/>

      <h2>Books</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Title</th><th>Author</th><th>Action</th></tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>
                <button className="delete" onClick={()=>deleteBook(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr/>

      <h2>Student Admission</h2>
      <input placeholder="Name" onChange={(e)=>setName(e.target.value)} />
      <input placeholder="Course" onChange={(e)=>setCourse(e.target.value)} />
      <input placeholder="Email" onChange={(e)=>setEmailStudent(e.target.value)} />
      <button onClick={addStudent}>Add Student</button>

      <hr/>
      <h2>Students</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Course</th><th>Email</th></tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.course}</td>
              <td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default App;