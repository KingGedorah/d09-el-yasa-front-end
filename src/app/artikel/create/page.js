"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

const CreateArticle = () => {
  const router = useRouter();
  const [judulArtikel, setJudulArtikel] = useState('');
  const [isiArtikel, setIsiArtikel] = useState('');
  const [gambar, setGambar] = useState(null);
  const [selectedKategori, setSelectedKategori] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('judulArtikel', judulArtikel);
    formData.append('isiArtikel', isiArtikel);
    formData.append('image', gambar);
    selectedKategori.forEach((kat) => {
      formData.append('kategori[]', kat);
    });

    try {
      const response = await axios.post('https://myjisc-artikel-29c0ad65b512.herokuapp.com/api/artikel/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setIsSuccess(true);
      setJudulArtikel('');
      setIsiArtikel('');
      setGambar(null);
      setSelectedKategori([]);
    } catch (error) {
      console.error('Error creating article:', error);
      setIsError(true);
    }

    router.push('/artikel');
  };

  const handleClosePopup = () => {
    setIsSuccess(false);
    setIsError(false);
  };

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    if (selectedKategori.includes(value)) {
      setSelectedKategori(selectedKategori.filter((kategori) => kategori !== value));
    } else {
      setSelectedKategori([...selectedKategori, value]);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg">
        <h1 className="text-2xl font-semibold mb-4">Buat Berita</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="mb-4">
              <label htmlFor="judulArtikel" className="block text-gray-700 font-bold mb-2">Judul Berita</label>
              <input type="text" id="judulArtikel" value={judulArtikel} onChange={(e) => setJudulArtikel(e.target.value)} name="judul" className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500" required/>
            </div>

            <div className="mb-4">
              <label htmlFor="isiArtikel" className="block text-gray-700 font-bold mb-2">Isi Artikel:</label>
              <textarea name="isi" rows="5" className="border border-gray-300 rounded-md py-2 px-4 w-full resize-none focus:outline-none focus:border-blue-500" id="isiArtikel" value={isiArtikel} onChange={(e) => setIsiArtikel(e.target.value)} required />
            </div>

            <div className="mb-4">
              <label htmlFor="gambar" className="block text-gray-700 font-bold mb-2">Gambar:</label>
              <input name="gambar" className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500" type="file" id="gambar" onChange={(e) => setGambar(e.target.files[0])} required/>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Kategori:</label>
              <div className="flex flex-wrap">
                <label className="mr-4 mb-2"><input type="checkbox" value="Pendidikan" checked={selectedKategori.includes("Pendidikan")} onChange={handleCheckboxChange}/> Pendidikan</label>
                <label className="mr-4 mb-2"><input type="checkbox" value="Teknologi" checked={selectedKategori.includes("Teknologi")} onChange={handleCheckboxChange}/> Teknologi</label>
                <label className="mr-4 mb-2"><input type="checkbox" value="Olahraga" checked={selectedKategori.includes("Olahraga")} onChange={handleCheckboxChange}/> Olahraga</label>
                <label className="mr-4 mb-2"><input type="checkbox" value="Prestasi" checked={selectedKategori.includes("Prestasi")} onChange={handleCheckboxChange}/> Prestasi</label>
              </div>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
            </div>
          </div>
        </form>
      </div>

      {isSuccess && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-green-600 font-semibold">Artikel berhasil dibuat!</p>
            <button onClick={handleClosePopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Tutup</button>
          </div>
        </div>
      )}
      {isError && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-red-600 font-semibold">Gagal membuat artikel!</p>
            <button onClick={handleClosePopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Tutup</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CreateArticle;