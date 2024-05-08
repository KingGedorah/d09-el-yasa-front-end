"use client";

import React, { useState, useEffect } from 'react';
import { fetchInventoryImageData } from '../api/inventaris';
import Image from 'next/image';

const InventoryImage = ({ idInventaris }) => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImageData = async () => {
      try {
        const imageUrl = await fetchInventoryImageData(idInventaris);
        setImageData(imageUrl);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    loadImageData();
  }, [idInventaris]);

  if (loading) {
    return <div>Loading image...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <Image src={imageData} width="600" height="400"/>;
};

export default InventoryImage;
