import express from 'express';
import { models } from '../db/index.js';
import { requireAuthentication } from './utils.js';
const router = express.Router();

router.post('/create', requireAuthentication, async (req, res, next) => {
  // route to create new review
  const { userBookId, rating, reviewContent } = req.body;

  try {
    const newReview = await models.reviews.createReview(req.user.id, userBookId, rating, reviewContent);

    res.send(newReview);
  } catch (error) {
    next(error);
  }
});

router.patch('/:reviewId/edit', requireAuthentication, async (req, res, next) => {
  // route to edit review
  const { reviewId } = req.params;
  const { rating, reviewContent } = req.body;

  const updatedFields = {};

  if (rating) {
    updatedFields.rating = rating;
  }

  if (reviewContent) {
    updatedFields.reviewContent = reviewContent;
  }


  try {
    const userReview = await models.reviews.getUserReview(req.user.id, reviewId);

    if (!userReview) {
      return res.status(404).send({
        name: 'ReviewNotFoundError',
        message: 'User review not found'
      });
    }

    const updatedReview = await models.reviews.updateReview(reviewId, updatedFields);

    res.send(updatedReview);
  } catch (error) {
    next(error);
  }
});

router.delete('/:reviewId/delete', requireAuthentication, async (req, res, next) => {
  // route to delete a review
  const { reviewId } = req.params;

  try {
    const userReview = await models.reviews.getUserReview(req.user.id, reviewId);

    if (!userReview) {
      return res.status(404).send({
        name: 'ReviewNotFoundError',
        message: 'User Review not found'
      });
    }

    await models.reviews.deleteReview(reviewId);
    res.send({ message: 'Review successfully deleted.' });
  } catch (error) {
    next(error);
  }
});

export default router;