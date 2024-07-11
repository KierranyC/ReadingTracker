// api calls

export const BASE_URL = 'https://localhost:3000';

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



