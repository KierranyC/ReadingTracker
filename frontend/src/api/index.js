// api calls

export const BASE_URL = 'http://localhost:4000/api';

// user endpoints

// post - login

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password
      }),
    });
    const result = await response.json();
    localStorage.setItem("token", result.token);
    console.log('API CALL LOGIN RESULT:', result);
    return result
  } catch (error) {
    console.error(error)
  }
};

// post - sign up

export const signUp = async (email, username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    });
    const result = await response.json();
    localStorage.setItem("token", result.token);
    console.log('API CALL SIGN UP RESULT:', result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

// book endpoints

// get - book search

  
export const fetchBooks = async (searchTerm) => {

try {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
  const result = await response.json();

  console.log(result.items); 
  return result;
} catch (error) {
  console.error(error);
  }
}


