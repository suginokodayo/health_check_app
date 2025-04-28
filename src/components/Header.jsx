import React from 'react';
import { Link } from 'react-router-dom';
const Header = () => {
    const handleNavClick = () => {
        const nav = document.getElementById("navbarNav");
        if (nav && nav.classList.contains("show")) {
          new window.bootstrap.Collapse(nav).toggle();
        }
    };
    
    return(
        <nav className="header navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <h1 className="navbar-brand">HealthChecker</h1>
                <button className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse header-list" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link to="/" onClick={handleNavClick} className="custom-btn nav-link">入力</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/analysis" onClick={handleNavClick} className="custom-btn nav-link">記録閲覧&分析</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/goal" onClick={handleNavClick} className="custom-btn nav-link">目標</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;