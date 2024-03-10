"use client";

import React, { useState } from 'react';
import axios from 'axios';

const CreateArticle = () => {
  const [judulArtikel, setJudulArtikel] = useState('');
  const [isiArtikel, setIsiArtikel] = useState('');
  const [gambar, setGambar] = useState(null);
  const [kategori, setKategori] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('judulArtikel', judulArtikel);
    formData.append('isiArtikel', isiArtikel);
    formData.append('image', gambar);
    formData.append('kategori', kategori);

    try {
      const response = await axios.post('https://myjisc-artikel-29c0ad65b512.herokuapp.com/api/artikel/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data); // Tampilkan respons dari server
      setIsSuccess(true);
      // Reset semua nilai state setelah pengiriman berhasil
      setJudulArtikel('');
      setIsiArtikel('');
      setGambar(null);
      setKategori('');
    } catch (error) {
      console.error('Error creating article:', error);
      setIsError(true);
    }
  };

  const handleClosePopup = () => {
    setIsSuccess(false);
    setIsError(false);
  };

  return (
    <div>
      <h1>Create Article</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="judulArtikel">Judul Artikel:</label>
          <input type="text" id="judulArtikel" value={judulArtikel} onChange={(e) => setJudulArtikel(e.target.value)} />
        </div>
        <div>
          <label htmlFor="isiArtikel">Isi Artikel:</label>
          <textarea id="isiArtikel" value={isiArtikel} onChange={(e) => setIsiArtikel(e.target.value)} />
        </div>
        <div>
          <label htmlFor="gambar">Gambar:</label>
          <input type="file" id="gambar" onChange={(e) => setGambar(e.target.files[0])} />
        </div>
        <div>
          <label htmlFor="kategori">Kategori:</label>
          <input type="text" id="kategori" value={kategori} onChange={(e) => setKategori(e.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
      {isSuccess && (
        <div className="popup success">
          <p>Artikel berhasil dibuat!</p>
          <button onClick={handleClosePopup}>Tutup</button>
        </div>
      )}
      {isError && (
        <div className="popup error">
          <p>Gagal membuat artikel!</p>
          <button onClick={handleClosePopup}>Tutup</button>
        </div>
      )}
    </div>
  );
};

export default CreateArticle;
