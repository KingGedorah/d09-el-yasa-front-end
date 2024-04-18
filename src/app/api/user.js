
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';


export const getUsersById = async (IdUser) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${IdUser}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};


export const createUser = async (userData, token) => {
    try {
      const response = await axios.post(`${BASE_URL}/user`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  };

  export const loggedUser = async (userData, token) => {
    try {
      const response = await axios.post(`${API_URL}/v1/authentication`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  };