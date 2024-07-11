import express from 'express';
// import { createUser, getUserById, getUser, getUserByUsername, updateUser, deleteUser } from '../db/models/users.js';
import { models } from '../db/index.js';
import { requireAuthentication } from './utils.js';
import jwt from 'jsonwebtoken';
const router = express.Router();


router.post('/login', async (req, res, next) => {
  // route to log user in
  // gets user from the database, if user info is 
  // correct the server will send their info back to 
  // the client with a login confirmation message
  const { username, password } = req.body;

  try {
    const user = await models.users.getUser({ username, password });

    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username
        },
        process.env.JWT_SECRET
      );

      res.send({
        user: {
          id: user.id,
          username: username
        },
        message: 'You have successfully logged in!',
        token
      });
    } else {
      res.send({
        message: 'INCORRECT LOGIN DETAILS!'
      });
    };
  } catch (error) {
    next(error);
  };
});

router.post('/register', async (req, res, next) => {
  // route to register new user
  // checks if username is already taken and if password
  // is too short, send error messages if both are true, if 
  // both are false, new user will be created in the database,
  // and server will send a confirmation message back to client
  const { email, username, password } = req.body;

  try {
    const _user = await models.users.getUserByUsername(username);

    if (_user) {
      res.send({
        name: 'UserExistsError',
        message: `User ${_user.username} is already taken.`
      });
    } else if (password.length < 8) {
      res.send({
        name: 'PasswordTooShortError',
        message: 'Password is too short!'
      });
    } else {
      const user = await models.users.createUser({ email, username, password });

      const token = jwt.sign({
        id: user.id,
        username
      },
        process.env.JWT_SECRET, {
        expiresIn: '1w'
      })

      res.send({
        message: 'Thanks for signing up!',
        token: token,
        user: {
          id: user.id,
          username
        }
      });
    };
  } catch (error) {
    next(error);
  }
});

router.patch('/update', requireAuthentication, async (req, res, next) => {
  // route to update user's account
  const { username, password, email } = req.body;

  const updatedFields = {};

  if (username.length > 0) {
    updatedFields.username = username
  }

  if (password.length > 0) {
    updatedFields.password = password
  }

  if (email.length > 0) {
    updatedFields.email = email
  }

  try {

    const updatedUser = await models.users.updateUser(req.user.id, updatedFields);
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete('/delete', requireAuthentication, async (req, res, next) => {
  // route to delete user's account

  try {
    await models.users.deleteUser(req.user.id);
    res.send({ message: 'Account successfully deleted' });
  } catch (error) {
    next(error);
  }
});


export default router;