import jwt from 'jsonwebtoken';
import { getUserById } from '../db/models/users';

export const requireAuthentication = async (req, res, next) => {
  // ensures that a user is authorized to access a route
  try {
    let user = null;

    // check for user's jwt token
    if (req.headers.authorization !== undefined) {
      const bearerHeader = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET);
      user = await getUserById(decoded.id);
      console.log('USER:', user);
    } else {
      res.send({
        error: 'ERROR',
        title: 'UnauthorizedUser',
        message: 'You must be authorized to access this route.'
      });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};