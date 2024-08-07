import React from 'react';
import { BookSearch } from './BookSearch';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { Link } from 'react-router-dom';

export const LandingPage = ({ token }) => {


  if (token) {
    return (
      <div>
        <BookSearch />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Welcome to Page Trail!</h1>
        <Link to='/login'>Login</Link>
        <Link to='/signup'>Sign Up</Link>
      </div>
    );
  }
};