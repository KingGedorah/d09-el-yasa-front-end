const BASE_URL = process.env.NEXT_PUBLIC_BASE_ARTIKEL_API

export const getAllArticles = async () => {
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

export const fetchImageData = async (idArtikel) => {
    try {
      const response = await fetch(`${BASE_URL}/${idArtikel}/image`, {
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

export const getArticleById = async (idArtikel) => {
  try {
    const response = await fetch(`${BASE_URL}/${idArtikel}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    throw error;
  }
};
