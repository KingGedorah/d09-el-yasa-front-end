import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BASE_INVENTARIS_API;

export const getAllInventory = async () => {
  try {
    const response = await fetch(`${baseUrl}/view-all`);
    const data = await response.json();
    if (!response.ok && data.message && data.message === 'Data not found') {
      return [];
    }
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return null;
  }
};

export const getAllPeminjaman = async () => {
  try {
    const response = await fetch(`${baseUrl}/borrow/view-all`);
    const data = await response.json();
    if (!response.ok && data.message && data.message === 'Data not found') {
      return [];
    }
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching peminjaman:', error);
    throw error; // Re-throw the error for handling in the component
  }
};


export const getInventoryById = async (idInventory) => {
    try {
      const response = await axios.get(`${baseUrl}/${idInventory}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching inventory by ID:', error);
      throw error;
    }
  };

  export const fetchInventoryImageData = async (idInventory) => {
    try {
      const response = await fetch(`${baseUrl}/${idInventory}/image`, {
        method: 'GET',
        mode: 'cors', // Set the mode to 'cors' to enable CORS
        headers: {
          'Access-Control-Allow-Origin': '*', // Allow requests from any origin
          // Add any other headers as needed
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
  
      const data = await response.blob();
      const imageUrl = URL.createObjectURL(data);
      return imageUrl;
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error; 
    }
  };
