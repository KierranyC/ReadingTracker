import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../api';

export const SignUp = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    const signUpData = async (event) => {
      try {
        const result = await signUp(email, username, password);
        setToken(result.token);
        setEmail('');
        setUsername('');
        setPassword('');
        if (result.token) {
          navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    };
    signUpData();
  }
  
  return (
    <div className='text-center form'>
      <h1 className='form-header'>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <label>
          Email:
          <input
            type='text'
            placeholder='Email'
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Username:
          <input
            type='text'
            placeholder='Username'
            value={username}
            minLength={8}
            maxLength={15}
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
            minLength={8}
            maxLength={20}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type='submit'>Create Account</button>
      </form>
    </div>
  );
};