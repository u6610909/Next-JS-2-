import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const statusRef = useRef();

  async function loadUser() {
    const response = await fetch(`http://localhost:3000/api/user/${id}`);
    const data = await response.json();
    if (data) {
      firstnameRef.current.value = data.firstname || "";
      lastnameRef.current.value = data.lastname || "";
      statusRef.current.value = data.status || "ACTIVE";
    }
  }

  async function onUpdate() {
    const body = {
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      status: statusRef.current.value
    };

    const result = await fetch(`http://localhost:3000/api/user/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (result.status === 200) {
      alert("Updated successfully!");
      navigate("/");
    } else {
      alert("Update failed");
    }
  }

  async function onDelete() {
    if (!window.confirm("Are you sure?")) return;

    const result = await fetch(`http://localhost:3000/api/user/${id}`, {
      method: "DELETE"
    });

    if (result.status === 200) {
      alert("User deleted!");
      navigate("/");
    } else {
      alert("Delete failed");
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h3>Edit User: {id}</h3>
      <div style={{ display: "grid", gap: "10px", maxWidth: "300px" }}>
        <label>First Name:</label> <input ref={firstnameRef} />
        <label>Last Name:</label> <input ref={lastnameRef} />
        <label>Status:</label> 
        <select ref={statusRef}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="SUSPENDED">SUSPENDED</option>
          <option value="DELETED">DELETED</option>
        </select>
        <button onClick={onUpdate} style={{background:"green", color:"white"}}>Save Update</button>
        <button onClick={onDelete} style={{background:"red", color:"white"}}>Delete User</button>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    </div>
  );
}