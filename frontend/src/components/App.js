import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LandingPage } from './LandingPage';

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
        </Routes>
      </div>
    </BrowserRouter>
  )
}