"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

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
      <Navbar />
      <div class="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg">
        <h1 class="text-2xl font-semibold mb-4">Buat Berita</h1>
        <form onSubmit={handleSubmit}>
        <div>
          <div class="mb-4">
                <label htmlFor="judulArtikel" class="block text-gray-700 font-bold mb-2">Judul Berita</label>
                <input type="text" id="judulArtikel" value={judulArtikel} onChange={(e) => setJudulArtikel(e.target.value)} name="judul" class="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500"/>
          </div>

          <div class="mb-4">
          <label htmlFor="isiArtikel" class="block text-gray-700 font-bold mb-2">Isi Artikel:</label>
          <textarea name="isi" rows="5" class="border border-gray-300 rounded-md py-2 px-4 w-full resize-none focus:outline-none focus:border-blue-500" id="isiArtikel" value={isiArtikel} onChange={(e) => setIsiArtikel(e.target.value)} />
        </div>

        <div class="mb-4">
          <label htmlFor="gambar" class="block text-gray-700 font-bold mb-2">Gambar:</label>
          <input name="gambar" class="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500" type="file" id="gambar" onChange={(e) => setGambar(e.target.files[0])} />
        </div>
        
        <div class="mb-4">
          <label htmlFor="kategori" class="block text-gray-700 font-bold mb-2">Kategori:</label>
          <input class="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500" type="text" id="kategori" value={kategori} onChange={(e) => setKategori(e.target.value)} />
        </div>
        <div class="flex justify-center">
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
        </div>
        
        </div>
      </form>
      </div>
      
      
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
      <Footer />
    </div>
  );
};

export default CreateArticle;
