import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from "react-router-dom";

import { useState } from "react";
import Login from "./Login";
import Slots from "./Slots";
import Register from "./Register";

function MainApp({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // Check if current route is auth page
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/parking"
        element={
          user ? (
            <Slots loggedUser={user} setUser={setUser} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <MainApp user={user} setUser={setUser} />
    </BrowserRouter>
  );
}

export default App;