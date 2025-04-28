"use client";

import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("googleUser"); // remove user data
    window.google?.accounts.id.disableAutoSelect(); // disable Google auto-login
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
