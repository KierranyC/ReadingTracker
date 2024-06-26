import client from '../client.js';
import bcrypt from 'bcrypt';

const SALT_COUNT = 10;

async function createUser({ email, username, password }) {
  // create new user, store hashed password in the db,
  // return the user without the password

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)

  try {
    const { rows: [user] } = await client.query(`
    INSERT INTO users(email, username, password)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [email, username, hashedPassword]);

    delete user.password;

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUser({ username, password }) {
  // verifies is the password used during login matches
  // the password that is saved with the usernmae in the db
  // if it doesn't, the function will return false, if it does, 
  // the function will return the user without their password

  const user = await getUserByUsername(username);
  const hashedPassword = user.password;

  const isValid = await bcrypt.compare(password, hashedPassword);

  if (!isValid) {
    return false;
  } else {
    delete user.password;
    return user;
  }
}

async function getUserByUsername(username) {
  // returns user with a usernmae that matches
  // the password in username

  try {
    const { rows: [user] } = await client.query(`
    SELECT * 
    FROM users
    WHERE username = $1;
    `, [username]);

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserById(userId) {
  // return user with an id that matches
  // the passed in user id

  try {
    const { rows: [user] } = await client.query(`
    SELECT * 
    FROM users
    WHERE id = ${userId};
    `);

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function updateUser(id, fields = {}) {
  // update user info with the passed in info

  // if password is updated, hash it before storing
  // it in the db
  if (fields.password) {
    const hashedPassword = await bcrypt.hash(fields.password, SALT_COUNT);
    fields.password = hashedPassword;
  }

  try {
    const string = Object.keys(fields).map((key, index) =>
      `'${key}' = $${index + 1}`).join(', ');

    const { rows: [user] } = await client.query(`
    UPDATE users
    SET ${string}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields));

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function deleteUser(id) {
  // delete user from db and all data
  // associated with them in other tables

  try {
    await client.query(`
    DELETE FROM books
    WHERE "userId"=${id};
    `);

    await client.query(`
    DELETE FROM reviews
    WHERE "userId"=${id};
    `);

    await client.query(`
    DELETE FROM users
    WHERE users.id=${id};
    `);

  } catch (error) {
    console.error(error);
  }
}

export {
  createUser,
  getUser,
  getUserByUsername,
  getUserById,
  updateUser,
  deleteUser
}