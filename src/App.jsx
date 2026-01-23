import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState("...Loading...");

  async function fetchData() {
    try {
      const result = await fetch('http://localhost:3000/api/hello');
      const data = await result.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Error connecting to API");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
       <h1>React Frontend</h1>
       <p>Message from API: <strong>{message}</strong></p>
    </div>
  );
}

export default App;