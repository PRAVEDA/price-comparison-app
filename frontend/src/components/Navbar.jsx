import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <div className="navbar-logo" onClick={() => navigate("/")}>
                    <span className="logo-icon">🚗</span>
                    <span className="logo-text">RidePrice</span>
                </div>

                {/* Navigation Links */}
                <div className="navbar-links">
                    <button className="nav-link" onClick={() => navigate("/")}>
                        <span className="nav-icon">🏠</span>
                        Home
                    </button>
                    <button className="nav-link">
                        <span className="nav-icon">📜</span>
                        History
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
