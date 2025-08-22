import React from 'react';

const DashboardHome = () => {
  const backgroundStyle = {
    backgroundImage: `url('/1.jpg')`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    padding: '3px',
    color: '#fff',
  };

  return (
    <div style={backgroundStyle}>
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: '10px',
          borderRadius: '20px',
        }}
      >
        <div className="container mt-2">
          <h2 className="mb-4 text-white">Dashboard</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="card text-white bg-primary">
                <div className="card-body">
                  <h5 className="card-title">Total Customers</h5>
                  <p className="card-text">25</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-success">
                <div className="card-body">
                  <h5 className="card-title">Total Loans</h5>
                  <p className="card-text">25</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-warning">
                <div className="card-body">
                  <h5 className="card-title">Payments Made</h5>
                  <p className="card-text">25</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-info">
                <div className="card-body">
                  <h5 className="card-title">Active States</h5>
                  <p className="card-text">5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
