import React, { useContext } from 'react';
import './Menubar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Menubar = () => {
  const { quantities, token, setToken, setQuantities } = useContext(StoreContext);
  const uniqueItemsInCart = Object.values(quantities).filter(qty => qty > 0).length;
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setQuantities({});
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/explore', label: 'Explore' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">
        <Link to="/">
          <img src={assets.logo} alt="Logo" className="mx-4" height={48} width={48} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navLinks.map(link => (
              <li className="nav-item" key={link.path}>
                <Link
                  className={`nav-link ${path === link.path ? 'active-tab' : ''}`}
                  to={link.path}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-4 ms-auto">
            {token && (
              <Link to="/cart">
                <div className="position-relative">
                  <img
                    src={assets.cart}
                    alt="Cart"
                    height={32}
                    width={32}
                    className="cursor-pointer"
                  />
                  {uniqueItemsInCart > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                      {uniqueItemsInCart}
                    </span>
                  )}
                </div>
              </Link>
            )}

            {!token ? (
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button className="btn btn-success" onClick={() => navigate('/register')}>
                  Register
                </button>
              </div>
            ) : (
              <div className="dropdown text-end">
                <a
                  href="#"
                  className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={assets.profile || 'https://via.placeholder.com/32'}
                    alt="Profile"
                    height={32}
                    width={32}
                    className="rounded-circle"
                  />
                </a>
                <ul className="dropdown-menu dropdown-menu-end text-small">
                  <li>
                    <button className="dropdown-item" onClick={() => navigate('/myorders')}>
                      Orders
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
