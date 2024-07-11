import React, { useState } from 'react';
import { Form, Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { FormGroup } from '@mui/material';

export const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = async () => {
      try {
        const result = await loginUser(email, username, password);
        setToken(result.token);
        setUsername('');
        setPassword('');
        if (result.token) {
          navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    };
    loginData();
  };

  return (
    <div className='text-center form'>
      <h1 className='form-header'>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type='text'
            placeholder='Username'
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type='text'
            placeholder='Password'
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button
          type='submit'
        >
          Login
        </button>
      </form>
      <Link to='/signup'>
        <button
          type='submit'
        >
          Don't have an account? Sign up now!
        </button>
      </Link>
    </div>
  );
};