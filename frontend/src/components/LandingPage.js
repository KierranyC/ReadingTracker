import React from 'react';
import { BookSearch } from './BookSearch';
import { Link } from 'react-router-dom';

export const LandingPage = ({ token, googleBooks, setGoogleBooks, setInput, input }) => {


  if (token) {
    return (
      <div>
        <BookSearch
          googleBooks={googleBooks}
          setGoogleBooks={setGoogleBooks}
          input={input}
          setInput={setInput}
        />
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