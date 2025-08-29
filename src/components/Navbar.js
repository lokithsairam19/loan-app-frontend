import React from 'react';

const Navbar = ({ setSection }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
      <a className="navbar-brand" href="/">Loan Application System</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <button className="nav-link btn btn-link" onClick={() => setSection('home')}>
               Home
             </button>
          </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => setSection('customers')}>
                Customers
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => setSection('cities')}>
                Admin Add
              </button>
            </li>
            
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => setSection('coverages')}>
                Coverages
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => setSection('loanTypes')}>
                Loan Types
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => setSection('loans')}>
                Loans
              </button>
            </li>
            
            <li className="logout">
              <button className="nav-link btn btn-link">
                <a href='/' style={{textDecoration: "none", color: "#FFFFFF8C"}}>Logout</a>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;