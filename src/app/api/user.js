import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_USER_API;


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

export const getAllGuru = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/user/get-all-guru`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching guru', error);
    throw error;
  }
}


export const getAllMurid = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/user/get-all-murid`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching murid', error);
    throw error;
  }
}

export const getScoreByIdMapel = async (idMapel) => {
  try {
    const response = await fetch(`${BASE_URL}/score/view-all/mapel/${idMapel}`);
    if (response.status == 404) {
      return null
    } else {
      const data = await response.json();
    return data.data;
    }
  } catch (error) {
    console.error('Error fetching score by ID Mapel:', error);
    throw error;
  }
};

export const getScoreByIdSiswa = async (IdUser) => {
  try {
    const response = await fetch(`${BASE_URL}/score/view-all/siswa/${IdUser}`);
    if (response.status == 404) {
      return null
    } else {
      const data = await response.json();
    return data.data;
    }
  } catch (error) {
    console.error('Error fetching score by ID User:', error);
    throw error;
  }
};

export const getScoreByIdScore = async (idScore) => {
  try {
    const response = await fetch(`${BASE_URL}/score/${idScore}`);
    if (response.status == 404) {
      return null
    } else {
      const data = await response.json();
    return data.data;
    }
  } catch (error) {
    console.error('Error fetching score by ID User:', error);
    throw error;
  }
};