// Inside Navbar.js or wherever the Logout button is rendered
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                 
    setTimeout(() => {
      navigate('/login');     
    }, 0);                     
  };

  return (
    <button onClick={handleLogout}>
      🔓 Logout
    </button>
  );
};

export default LogoutButton;
