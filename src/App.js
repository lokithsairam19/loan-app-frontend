import React, { useState } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Customers from './components/Customers';
import Cities from './components/Cities';
import Coverages from './components/Coverages';
import LoanTypes from './components/LoanTypes';
import Loans from './components/Loans';
import Home from './components/Home';
import DashboardHome from './components/DashboardHome';


import './App.css';

const App = () => {
  const [isStarted, setIsStarted] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [section, setSection] = useState('home'); 


  if (!isStarted) {
    return <Home onStart={() => setIsStarted(true)} />;
  }

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={setIsLoggedIn} />
      ) : (
        <>
          <Navbar setSection={setSection} />
          {section === 'home' && <DashboardHome />}
          {section === 'customers' && <Customers />}
          {section === 'cities' && <Cities />}
          {section === 'coverages' && <Coverages />}
          {section === 'loanTypes' && <LoanTypes />}
          {section === 'loans' && <Loans />}
        </>
      )}
    </div>
  );
};

export default App;
