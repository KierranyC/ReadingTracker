import client from '../client.js';


async function addBookToUserList({ }) {
  // adds a book to the user's list
  try {
    const { rows: [book] } = await client.query(`
      INSERT INTO 
    `)


  } catch (error) {
    console.error(error);
  }
}

async function checkIfBookExists(title, author) {
  // function that checks if a book exists in the books
  // table, if it doesn't exist the book will be added, if
  // it does then the function will return false

}

async function getUserBooksByStatus(userId, status) {
  // function that fetches a user's book list
  try {
    const { rows } = await client.query(`
      SELECT * FROM userBooks 
      JOIN books ON userBooks.id
      WHERE userBooks."userId" = ${userId} AND userBooks.status = ${status};
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
      WHERE reviews."userId" = $1;
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


export {
  checkIfBookExists,
  addBookToUserList,
  getUsersBookLists
};
