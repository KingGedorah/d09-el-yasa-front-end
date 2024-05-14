import axios from 'axios';

const baseUrl = 'https://myjisc-inventaris-146c107038ee.herokuapp.com/api/inventory'; 

export const getAllInventory = async () => {
  try {
    const response = await axios.get(`${baseUrl}/view-all`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return null;
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