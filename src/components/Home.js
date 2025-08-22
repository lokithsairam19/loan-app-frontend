import React from 'react';

const Home = ({ onStart }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-4 fw-bold text-primary">Loan Application System</h1>
        <p className="lead mt-3 mb-4">
          Apply, track, and manage your loans easily.
        </p>
        <button className="btn btn-primary btn-lg" onClick={onStart}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
