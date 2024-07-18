import React, { useState } from 'react';
import { fetchBooks } from '../api';
import { FaSearch } from 'react-icons/fa';

export const BookSearch = ({ googleBooks, setGoogleBooks }) => {
  const [input, setInput] = useState('');


  const handleSearch = async () => {
    try {
      const booksData = await fetchBooks(input);
      setGoogleBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    // <div className='search-bar-container'>
    <div className='input-wrapper'>
      <FaSearch id='search-icon' />
      <input
        type='text'
        placeholder='Search for books'
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {googleBooks.map((book) => (
          <div key={book.googleBooksId}>
            <h3>{book.title}</h3>
            <p>{book.description}</p>
            <p>Authors: {book.authors.join(', ')}</p>
            <p>Genre: {book.genre}</p>
            <p>Release Date: {book.releaseDate}</p>
            <label>
              Add to list
              <select value={value} onChange={handlleChange}>

              </select>
            </label>
          </div>
        ))}
      </div>
    </div>
    // </div>
  );
};