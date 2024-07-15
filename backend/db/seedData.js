// use database adapters to seed the db
import client from './client.js';
import { models } from './index.js';


export async function createTables() {
  try {
    console.log('Starting to build tables...');

    await client.query(`
    CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    );
    CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    "googleBooksId" VARCHAR (255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    author TEXT NOT NULL,
    genre VARCHAR(50) NOT NULL,
    "releaseDate" DATE
    );
    CREATE TABLE "userBooks" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users(id),
    "bookId" INTEGER REFERENCES books(id),
    status VARCHAR(50) NOT NULL,
    started DATE,
    finished DATE,
    stopped DATE
    );
    CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users(id),
    "userBookId" INTEGER REFERENCES "userBooks"(id),
    rating DECIMAL (2,1) CHECK (rating >= 0.0 AND rating <= 5.0),
    "reviewContent" TEXT
    );
    `);

    console.log('Finished creating tables!');
  } catch (error) {
    console.error('Error creating tables!', error);
  }
}

export async function dropTables() {
  try {
    console.log('Dropping all tables...');
 
    await client.query(`
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS userBooks;
    DROP TABLE IF EXISTS books;
    DROP TABLE IF EXISTS users;
    `);

    console.log('Finished dropping tables!');
  } catch (error) {
    console.error('Error dropping tables!');
  }
};

export async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
  } catch (error) {
    console.log('Error during rebuildDB!');
    throw error;
  }
};