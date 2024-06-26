import express from 'express';
// import { checkIfBookExists, addBookToUserList, getUsersBookLists } from '../db/models/books';
import { models } from '../db/index.js';
import { requireAuthentication } from './utils.js';
const router = express.Router();

router.get('/lists', requireAuthentication, async (req, res, next) => {
  // route to get all the user's book lists

  try {
    const userBookLists = await models.books.getUsersBookLists(req.user.id);

    res.send(userBookLists);
  } catch (error) {
    next(error);
  }
});

router.post('/add', requireAuthentication, async (req, res, next) => {
  // route to add a book to a user's list
  // check if book is in the books table already, if it is then just 
  // add the book to the user's list, if it's not add it and add
  // it to the user's list
  const { status, googleBooksId, title, description, author, genre, releaseDate, started, finished, stopped } = req.body;

  try {
    const book = await models.books.checkIfBookExists(googleBooksId);

    let userBook;
    if (book) {
      userBook = await models.books.addBookToUserList(req.user.id, status, book.id, started, finished, stopped);
    } else {
      const newBook = await models.books.addBookToBooksTable(googleBooksId, title, description, author, genre, releaseDate);
      userBook = await models.books.addBookToUserList(req.user.id, status, newBook.id, started, finished, stopped);
    }

    res.send(userBook);
  } catch (error) {
    next(error);
  }
});

router.patch('/:bookId/update', requireAuthentication, async (req, res, next) => {
  // route to update a user's book's list placement or started, stopped, and finished dates
  // if the updated status is not an expected value, the server will send back 
  // a status 400 error, if it is valid the user's book info will be updated
  const { bookId } = req.params;
  const { status, started, finished, stopped } = req.body;

  const updatedFields = {};

  if (status.length > 0) {
    updatedFields.status = status;
  }

  if (started) {
    updatedFields.started = started;
  }

  if (finished) {
    updatedFields.finished = finished;
  }

  if (stopped) {
    updatedFields.stopped = stopped;
  }


  try {
    const validStatuses = ['want to read', 'currently reading', 'completed', 'did not finish'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    };

    const userBook = await models.books.getUserBook(req.user.id, bookId);

    if (!userBook) {
      return res.status(404).send({
        name: 'BookNotFoundError',
        message: 'Book not found in user list'
      });
    }

    const updateBook = await models.books.updateUserBookInfo(req.user.id, updatedFields);

    res.send(updateBook);
  } catch (error) {
    next(book);
  }
});

router.delete('/:bookId/delete', requireAuthentication, async (req, res, next) => {
  // route to delete a book from a user's list
  const { bookId } = req.params;

  try {
    const userBook = await models.books.getUserBookById(req.user.id, bookId);

    if (!userBook) {
      return res.status(404).send({
        name: 'BookNotFoundError',
        message: 'Book not found in user list.'
      });
    }

    await models.books.deleteUserBook(req.user.id, bookId);
    res.send({ message: 'Book successfully removed from list.' });
  } catch (error) {
    next(error);
  }
});


export default router;