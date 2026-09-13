import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <svg width="26" height="18" viewBox="0 0 26 18" aria-hidden="true">
          <path
            d="M0,9 L7,9 L9,2 L12,16 L15,5 L17,9 L26,9"
            fill="none"
            stroke="var(--pulse-coral)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>NEW&#8209;ME</span>
      </Link>
      <nav>
        <ul className="navbar__links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/workout">Workout</Link></li>
          <li><Link to="/diet">Diet</Link></li>
          <li><Link to="/progress">Progress</Link></li>
          {user ? (
            <>
              <li className="navbar__user">Hi, {user.name.split(" ")[0]}</li>
              <li>
                <button className="navbar__logout" onClick={handleLogout}>
                  Log out
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login">Log in</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
