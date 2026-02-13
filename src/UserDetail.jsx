import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef(); // Added Email field
  const statusRef = useRef();
  
  // State for Profile Image
  const [profileImage, setProfileImage] = useState(null);

  // 1. Load User Data
  async function loadUser() {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${id}`);
      const data = await response.json();
      
      if (data) {
        firstnameRef.current.value = data.firstname || "";
        lastnameRef.current.value = data.lastname || "";
        emailRef.current.value = data.email || ""; // Load Email
        statusRef.current.value = data.status || "ACTIVE";
        
        // Set Profile Image if exists [cite: 1469]
        if (data.profileImage) {
          setProfileImage("http://localhost:3000" + data.profileImage);
        }
      }
    } catch (err) {
      console.error("Error loading user:", err);
    }
  }

  // 2. Handle Image Upload [cite: 1415]
  async function onUploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // [cite: 1478]

    try {
      // Call our new API route
      const response = await fetch(`http://localhost:3000/api/user/${id}/image`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        // Update preview immediately
        setProfileImage("http://localhost:3000" + data.imageUrl);
        alert("Image uploaded successfully!");
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file.");
    }
  }

  // 3. Update User Info (Text Data)
  async function onUpdate() {
    const body = {
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      email: emailRef.current.value,
      status: statusRef.current.value
    };

    const result = await fetch(`http://localhost:3000/api/user/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (result.status === 200) {
      alert("Profile info updated!");
      navigate("/");
    } else {
      alert("Update failed");
    }
  }

  // 4. Delete User
  async function onDelete() {
    if (!window.confirm("Are you sure?")) return;
    const result = await fetch(`http://localhost:3000/api/user/${id}`, { method: "DELETE" });
    if (result.status === 200) navigate("/");
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "500px", margin: "0 auto" }}>
      <h2>User Profile Management</h2>
      
      {/* PROFILE IMAGE SECTION */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ 
            width: "150px", height: "150px", borderRadius: "50%", 
            overflow: "hidden", margin: "0 auto", 
            border: "2px solid #ccc", backgroundColor: "#f0f0f0" 
        }}>
            {profileImage ? (
                <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
                <div style={{ lineHeight: "150px", color: "#888" }}>No Image</div>
            )}
        </div>
        <br />
        <input type="file" accept="image/*" onChange={onUploadImage} />
      </div>

      {/* TEXT DATA SECTION */}
      <div style={{ display: "grid", gap: "10px" }}>
        <label>First Name: <input ref={firstnameRef} style={{ width: "100%", padding: "5px" }} /></label>
        <label>Last Name: <input ref={lastnameRef} style={{ width: "100%", padding: "5px" }} /></label>
        <label>Email: <input ref={emailRef} style={{ width: "100%", padding: "5px" }} /></label>
        <label>Status: 
            <select ref={statusRef} style={{ width: "100%", padding: "5px" }}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="DELETED">DELETED</option>
            </select>
        </label>
        
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button onClick={onUpdate} style={{ flex: 1, padding: "10px", background: "green", color: "white", border: "none" }}>Save Info</button>
            <button onClick={onDelete} style={{ flex: 1, padding: "10px", background: "red", color: "white", border: "none" }}>Delete User</button>
            <button onClick={() => navigate("/")} style={{ flex: 1, padding: "10px", background: "gray", color: "white", border: "none" }}>Back</button>
        </div>
      </div>
    </div>
  );
}