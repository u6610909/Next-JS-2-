import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Users } from "./Users";
import { UserDetail } from "./UserDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;