import React, { useState } from 'react';
import { login, register, resetPassword } from '../api';

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityAnswer1, setSecurityAnswer1] = useState('');
  const [securityAnswer2, setSecurityAnswer2] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /.{8,}/.test(password) &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setNewPassword('');
    setSecurityAnswer1('');
    setSecurityAnswer2('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.data.successMessage) {
        onLogin(true);
      } else {
        setError(response.data.failureMessage || 'Login failed');
      }
    } catch {
      setError('Error connecting to server');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }
    try {
      const response = await register({
        name,
        email,
        userName: username,
        password,
        securityAnswer1,
        securityAnswer2,
      });
      if (response.data.successMessage) {
        switchMode('login');
        alert('Registration successful! Please log in.');
      } else {
        setError(response.data.failureMessage || 'Registration failed');
      }
    } catch {
      setError('Error connecting to server');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!isValidPassword(newPassword)) {
      setError('New password must meet complexity requirements.');
      return;
    }
    try {
      const response = await resetPassword({
        userName: username,
        name,
        email,
        securityAnswer1,
        securityAnswer2,
        newPassword,
      });
      if (response.data.successMessage) {
        switchMode('login');
        alert('Password reset successful! Please log in.');
      } else {
        setError(response.data.failureMessage || 'Password reset failed');
      }
    } catch {
      setError('Error connecting to server');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 className="card-title text-center mb-4">
          {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Reset Password'}
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleResetPassword}>
          {(mode !== 'login') && (
            <>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
              </div>
            </>
          )}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required />
          </div>
          {mode !== 'reset' && (
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
            </div>
          )}
          {mode !== 'login' && (
            <>
              <div className="mb-3">
                <label className="form-label">Security Question 1 Answer</label>
                <input type="text" value={securityAnswer1} onChange={(e) => setSecurityAnswer1(e.target.value)} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Security Question 2 Answer</label>
                <input type="text" value={securityAnswer2} onChange={(e) => setSecurityAnswer2(e.target.value)} className="form-control" required />
              </div>
            </>
          )}
          {mode === 'reset' && (
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" required />
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100 mb-2">
            {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Reset Password'}
          </button>
          {mode === 'login' && (
            <>
              <button type="button" className="btn btn-link w-100" onClick={() => switchMode('register')}>Need an account? Register</button>
              <button type="button" className="btn btn-link w-100" onClick={() => switchMode('reset')}>Forgot Password?</button>
            </>
          )}
          {(mode === 'register' || mode === 'reset') && (
            <button type="button" className="btn btn-link w-100" onClick={() => switchMode('login')}>Back to Login</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
