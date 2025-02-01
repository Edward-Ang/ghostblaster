// src/components/LogoutButton.jsx
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">
      Logout
    </button>
  );
}

export default LogoutButton;