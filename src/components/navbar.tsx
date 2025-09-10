import { Link, NavLink } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Logo from "../assets/logo.svg";
import "./navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="app-container navbar__row">
        <nav className="navbar__nav">
          <Link to="/" className="navbar__brand">
            <img src={Logo} alt="PanPal" className="navbar__logo" />
          </Link>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `navbar__link ${isActive ? "is-active" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              `navbar__link ${isActive ? "is-active" : ""}`
            }
          >
            Explore Recipe
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) =>
              `navbar__link ${isActive ? "is-active" : ""}`
            }
          >
            Add Recipe
          </NavLink>
        </nav>

        <div className="navbar__search">
          <input
            className="navbar__search-input"
            placeholder="Search by dish, ingredient, or chef..."
          />
          <button className="navbar__icon-btn" aria-label="Search">
            <SearchRoundedIcon fontSize="small" />
          </button>
        </div>

        <div className="navbar__actions">
          <button className="navbar__avatar" aria-label="Account">
            <PersonRoundedIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
