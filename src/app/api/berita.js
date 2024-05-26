const BASE_URL = process.env.NEXT_PUBLIC_BASE_BERITA_API;

export const getAllBeritas = async () => {
  try {
    const response = await fetch(`${BASE_URL}/view-all`);
    if (response.status == 404) {
      return null;
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error; // Re-throw the error for handling in the component
  }
};

export const fetchImageData = async (idBerita) => {
    try {
      const response = await fetch(`${BASE_URL}/${idBerita}/image`, {
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
      throw error; // Re-throw the error for handling in the component
    }
};

export const getBeritaById = async (idBerita) => {
  try {
    const response = await fetch(`${BASE_URL}/${idBerita}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching berita by ID:', error);
    throw error;
  }
};
