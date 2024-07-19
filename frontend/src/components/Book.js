import React, { useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

export const Book = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { book } = location.state || {};



  return (
    <div>
      <button type='button' className='flex flex-c back-btn' onClick={() => navigate("/")}>
        <FaArrowLeft size={22} />
        <span className='fs-18 fw-6'>Go Back</span>
      </button>
      <h1>{book.title}</h1>
    </div>
  )
}