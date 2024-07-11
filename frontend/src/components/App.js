import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  LandingPage,
  Login,
  SignUp,
  BookSearch,
  Navbar,
  MyLibrary
} from './index.js';

export const App = () => {
  const [googleBooks, setGoogleBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [token, setToken] = useState('');


  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <BrowserRouter>
      <div id='app'>
        <Navbar token={token} setToken={setToken} />
        <Routes>
          <Route path='/' element={<LandingPage token={token} />} />
          <Route path='/signup' element={<SignUp token={setToken} />} />
          <Route path='/login' element={<Login token={setToken} />} />
          <Route path='/mylibrary' element={<MyLibrary />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}