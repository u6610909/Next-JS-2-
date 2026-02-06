import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function Users() {
  const [users, setUsers] = useState([]);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();

  async function loadUsers() {
    try {
      const response = await fetch("http://localhost:3000/api/user");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }

  async function onUserSubmit() {
    const body = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
    };

    try {
      const result = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      const data = await result.json();
      
      if (result.status === 200) {
        alert("Success! User ID: " + data.id);
        loadUsers(); 
        usernameRef.current.value = "";
        emailRef.current.value = "";
        passwordRef.current.value = "";
        firstnameRef.current.value = "";
        lastnameRef.current.value = "";
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Connection failed!");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management System</h2>
      
      <div style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "15px" }}>
        <h3>Register New User</h3>
        <input ref={usernameRef} placeholder="Username" style={{margin: "5px"}} />
        <input ref={emailRef} placeholder="Email" style={{margin: "5px"}} />
        <input ref={passwordRef} type="password" placeholder="Password" style={{margin: "5px"}} />
        <input ref={firstnameRef} placeholder="First Name" style={{margin: "5px"}} />
        <input ref={lastnameRef} placeholder="Last Name" style={{margin: "5px"}} />
        <button onClick={onUserSubmit}>Create User</button>
      </div>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.firstname} {user.lastname}</td>
              <td>{user.status}</td>
              <td>
                <Link to={`/user/${user._id}`}>Edit / Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}