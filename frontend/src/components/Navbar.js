import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { Link } from '@mui/material';

export const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();
  
  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    console.log('You are now logged out!');
    navigate('/');
  };

  return (
    <nav>
      <h1>Page Trail</h1>
      {
        token ? (
          <>
            <Link
              to='/'
            >
              Home
            </Link>
            <Link to='/mylibrary'
            >
              My Library
            </Link>
            <button onClick={logout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to='/'>
              Home
            </Link>
            <Link to='/login'>
              Login
            </Link>
            <Link to='/signup'>
              Sign Up
            </Link>
          </>
        )
      }
    </nav>
  );
};