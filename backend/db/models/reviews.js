import client from "../client.js";

async function createReview(userId, userBookId, rating, reviewContent) {
  // function that adds a user's review to the database

  try {
    const { rows: [review] } = await client.query(`
      INSERT INTO reviews("userId", "userBookId", rating, "reviewContent")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [userId, userBookId, rating, reviewContent]);

    return review;
  } catch (error) {
    console.error(error);
  }
};

async function getUserReview(userId, reviewId) {
  // returns review with id that matches the
  // passed in id

  try {
    const { rows: [review] } = await client.query(`
      SELECT * FROM reviews
      WHERE id = $1
      AND "userId" = $2;
    `, [userId, reviewId]);

    return review;
  } catch (error) {
    console.error(error);
  }
}

async function updateReview(reviewId, fields = {}) {
  // function that updates a user's review in the database

  try {
    const string = Object.keys(fields).map((key, index) =>
      `'${key}' = $${index + 1}`).join(', ');
    console.log('UPDATED REVIEW STRING:', string);

    const { rows: [review] } = await client.query(`
    UPDATE reviews
    SET ${string}
    WHERE id = ${reviewId}
    RETURNING *;
    `, Object.values(fields));

    return review;
  } catch (error) {
    console.error(error);
  }
}

async function deleteReview(reviewId) {
  // function that deletes a review from the database

  try {
    await client.query(`
    DELETE FROM reviews
    WHERE id=${reviewId}
    RETURNING *;
    `);
  } catch (error) {
    console.error(error);
  }
}

export {
  createReview,
  getUserReview,
  updateReview,
  deleteReview
};