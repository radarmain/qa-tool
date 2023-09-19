
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/facebook" className="nav-link">Facebook</Link>
        <Link to="/ga" className="nav-link">GA</Link>
      </nav>
    </header>
  );
}

export default Header;
