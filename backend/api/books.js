import express from 'express';
import { checkIfBookExists, addBookToUserList, getUsersBookLists } from '../db/models/books';
import { requireAuthentication } from './utils.js';
const router = express.Router();

router.get('/lists', requireAuthentication, async (req, res, next) => {
  // route to get all user's book lists
  const { userId } = req.user;

  try {
    const userBookLists = await getUsersBookLists(userId);

    res.send(userBookLists);
  } catch (error) {
    next(error);
  }
});

router.post('/add', requireAuthentication, async (req, res, next) => {
  // route to add a book to a user's list

})


export default router;