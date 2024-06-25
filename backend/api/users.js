import express from 'express';
import {
  createUser,
  getUserById,
  getUser,
  getUserByUsername,
  updateUser,
  deleteUser
} from '../db/models/users.js';
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
    const user = await getUser({ username, password });

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

router.post('register', async (req, res, next) => {
  // route to register new user
  // checks if username is already taken and if password
  // is too short, send error messages if both are true, if 
  // both are false, new user will be created in the database,
  // and server will send a confirmation message back to client
  const { email, username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

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
      const user = await createUser({ email, username, password });

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

router.patch('/:userId', requireAuthentication, async (req, res, next) => {
  // route to update user's account
  const { userId } = req.params;
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
    const bearerHeader = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET);

    const user = await getUserById(userId);

    if (user.id === decoded.id) {
      const updatedUser = await updateUser(decoded.id, updatedFields);

      res.send(updatedUser);
    } else {
      res.status(403).send({
        name: 'UnauthorizedUserError',
        message: `User ${decoded.username} is not allowed to update ${user.username}`
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:userId/delete', requireAuthentication, async (req, res, next) => {
  // route to delete user's account
  const { userId } = req.body;

  try {
    const bearerHeader = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET);

    const user = await getUserById(userId);

    if (user.id === decoded.id) {
      await deleteUser(decoded.id);


    } else {
      res.status(403).send({
        name: 'UnauthorizedUserError',
        message: `User ${decoded.username} is not allowed to delete ${user.username}`
      });
    }
  } catch (error) {
    next(error);
  }
});


export default router;