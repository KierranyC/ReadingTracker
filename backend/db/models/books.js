import client from '../client.js';


async function addBookToUserList(userId, status, bookId, started, finished, stopped) {
  // adds a book to the user's list
  try {
    const { rows: [book] } = await client.query(`
      INSERT INTO "userBooks" ("userId", status, "bookId", started, finished, stopped)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [userId, status, bookId, started, finished, stopped]);


    return book;
  } catch (error) {
    console.error(error);
  }
}

async function checkIfBookExists(googleBooksId) {
  // function that checks if a book exists in the books
  // table, if it does exist the function will return the book, if
  // it doesn't then the function will return false

  try {
    const { rows: [book] } = await client.query(`
      SELECT * FROM books
      WHERE "googleBookId" = $1;
    `, [googleBooksId]);

    if (book) {
      return book;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

async function addBookToBooksTable(googleBooksId, title, description, author, genre, releaseDate) {
  // add new book info to the books table

  try {
    const { rows: [book] } = await client.query(`
    INSERT INTO books ("googleBooksId", title, description, author, genre, "releaseDate")
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `, [googleBooksId, title, description, author, genre, releaseDate]);

    return book;
  } catch (error) {
    console.error(error);
  }
}

async function getUserBook(userId, bookId) {
  // returns a user's book using the id

  try {
    const { rows: [book] } = await client.query(`
      SELECT * FROM "userBooks"
      WHERE "userId" = $1
      AND "bookId" = $2;
    `, [userId, bookId]);

    return book;
  } catch (error) {
    console.error(error);
  }
}

async function getUserBooksByStatus(userId, status) {
  // function that fetches a user's book list
  try {
    const { rows } = await client.query(`
      SELECT * FROM "userBooks" 
      JOIN books ON "userBooks".id
      WHERE "userBooks"."userId" = ${userId} 
      AND "userBooks".status = ${status};
    `);

    return rows;
  } catch (error) {
    console.error(error);
  }
};

async function getReviewsByUserId(userId) {
  // return a user's reviews
  try {
    const { rows } = await client.query(`
      SELECT * FROM reviews
      WHERE "userId" = $1;
    `, [userId]);

    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getUsersBookLists(userId) {
  // return all of the user's book lists, including 
  // the reviews for the completed books
  try {
    const [wantToReadList, currentlyReadingList, completedList, didNotFinishList, reviews] =
      await Promise.all([
        getUserBooksByStatus(userId, 'want to read'),
        getUserBooksByStatus(userId, 'want to read'),
        getUserBooksByStatus(userId, 'want to read'),
        getUserBooksByStatus(userId, 'want to read'),
        getReviewsByUserId(userId)
      ]);

    // attach reviews to completed books
    completedList.forEach(book => {
      book.reviews = reviews.filter(review => review.userBooksId === book.id);
    });

    return {
      userId,
      wantToRead: wantToReadList,
      currentlyReading: currentlyReadingList,
      completed: completedList,
      didNotFinish: didNotFinishList
    }
  } catch (error) {
    console.error(error);
  }
};

async function updateUserBookInfo(userBookId, fields = {}) {
  // updates a user's book list placement and started, finished, and stopped dates
  console.log('UPDATED BOOK FIELDS:', fields);
  try {
    const string = Object.keys(fields).map((key, index) =>
      `'${key}' = $${index + 1}`).join(', ');
    console.log('UPDATED BOOK STRING:', string);

    const { rows: [book] } = await client.query(`
    UPDATE "userBooks"
    SET ${string}
    WHERE id=${userBookId}
    RETURNING *;
    `, Object.values(fields));

    return book;
  } catch (error) {
    console.error(error);
  }
}

async function deleteUserBook(userId, userBookId) {
  // deletes a book from a user's list

  try {
    await client.query(`
    DELETE FROM "userBooks"
    WHERE "userId"=${userId}
    AND id=${userBookId}
    RETURNING *;
    `);
  } catch (error) {
    console.error(error);
  }
}


export {
  checkIfBookExists,
  addBookToUserList,
  getUsersBookLists,
  getReviewsByUserId,
  addBookToBooksTable,
  updateUserBookInfo,
  getUserBook,
  deleteUserBook
};