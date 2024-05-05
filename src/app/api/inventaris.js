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