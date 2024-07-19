import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  LandingPage,
  Login,
  SignUp,
  BookSearch,
  Navbar,
  MyLibrary,
  Book
} from './index.js';
import '../style.css';

export const App = () => {
  const [googleBooks, setGoogleBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [input, setInput] = useState('');
  const [token, setToken] = useState('');


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <BrowserRouter>
      <div id='app'>
        <Navbar token={token} setToken={setToken} />
        <Routes>
          <Route path='/'
            element={
              <LandingPage
                token={token}
                googleBooks={googleBooks}
                setGoogleBooks={setGoogleBooks}
                input={input}
                setInput={setInput}
              />
            }
          />
          <Route path='/signup' element={<SignUp setToken={setToken} />} />
          <Route path='/login' element={<Login setToken={setToken} />} />
          <Route path='/mylibrary' element={<MyLibrary />} />
          <Route path='/book/:id' element={<Book />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};