import express from 'express';
import usersRouter from './users.js';
import booksRouter from './books.js';
import reviewsRouter from './reviews.js';

const apiRouter = express.Router();

apiRouter.get('/health', (req, res, next) => {
  res.send({
    healthy: true,
  });
});

// routers

apiRouter.use('/users', usersRouter);
apiRouter.use('/books', booksRouter);
apiRouter.use('/reviews', reviewsRouter);

export default apiRouter;