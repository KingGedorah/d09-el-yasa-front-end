const BASE_URL = 'https://myjisc-inventaris-146c107038ee.herokuapp.com/api/inventory'

export const getAllInventory = async () => {
  try {
    const response = await fetch(`${BASE_URL}/view-all`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching inventories:', error);
    throw error; // Re-throw the error for handling in the component
  }
};

export const getAllPeminjaman = async () => {
  try {
    const response = await fetch(`${BASE_URL}/borrow/view-all`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching peminjaman:', error);
    throw error; // Re-throw the error for handling in the component
  }
};

export const getInventoryById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching peminjaman:', error);
    throw error; // Re-throw the error for handling in the component
  }
};
