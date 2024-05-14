"use client";

import React, { useState, useEffect } from 'react';
import { fetchImageData } from '../api/berita';
import Image from 'next/image';

const BeritaImage = ({ idBerita }) => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImageData = async () => {
      try {
        const imageUrl = await fetchImageData(idBerita);
        setImageData(imageUrl);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    loadImageData();
  }, [idBerita]);

  if (loading) {
    return <div>Loading image...</div>;
  }

  if (error) {
    return null;
  }

  return <Image src={imageData} alt="berita" width="600" height="400"/>;
};

export default BeritaImage;
