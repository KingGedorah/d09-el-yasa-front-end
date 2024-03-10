import React, { useState, useEffect } from 'react';
import { fetchImageData } from '../api/artikel';

const ArticleImage = ({ idArtikel }) => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImageData = async () => {
      try {
        const imageUrl = await fetchImageData(idArtikel);
        setImageData(imageUrl);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    loadImageData(); // Call the function to fetch image data when the component mounts
  }, [idArtikel]); // Ensure useEffect runs only when idArtikel changes

  if (loading) {
    return <div>Loading image...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <img src={imageData} alt="Article" />;
};

export default ArticleImage;
