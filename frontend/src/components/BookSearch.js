import React, { useState } from 'react';
import { fetchBooks } from '../api';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const BookSearch = ({ googleBooks, setGoogleBooks, input, setInput }) => {


  const handleSearch = async () => {
    try {
      const booksData = await fetchBooks(input);
      setGoogleBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleClearButtonClick = () => {
    setInput('')
  }

  return (
    // <div className='search-bar-container'>
    <div className='search-container'>
      <FaSearch id='search-icon' />
      <input
        type='text'
        placeholder='Search for books'
        value={input}
        id='search-form-input'
        onChange={(event) => setInput(event.target.value)}
      />
      {input && (
        <button className='clear-button' onClick={handleClearButtonClick}>&#x2716;</button>
      )}
      <button onClick={handleSearch}>Search</button>
      {googleBooks.map((book) => (
        <div key={book.googleBooksId}>
          <Link to={`/book/${book.googleBooksId}`} state={{ book }}><h3>{book.title}</h3></Link>
          <p>{book.description}</p>
          <p>Author(s): {book.authors.join(', ')}</p>
          <p>Genre: {book.genre}</p>
          <p>Release Date: {book.releaseDate}</p>
        </div>
      ))}
    </div>
    // </div>
  );
};