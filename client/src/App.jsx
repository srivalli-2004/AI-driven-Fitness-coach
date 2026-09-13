import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Diet from "./pages/Diet";
import Progress from "./pages/Progress";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <footer>
        <p>&copy; 2026 NEW-ME. All rights reserved.</p>
      </footer>
    </AuthProvider>
  );
}

export default App;
