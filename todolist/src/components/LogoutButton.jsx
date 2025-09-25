import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const { logout } = useAuth() || {};
  const navigate = useNavigate();

  const onClick = () => {
    logout();                 
    navigate("/login", { replace: true }); 
  };

  return (
    <button type="button" className="logout-btn" onClick={onClick}>
      Logout
    </button>
  );
}
