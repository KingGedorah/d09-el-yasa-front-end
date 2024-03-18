"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
// Import ReactQuill secara dinamis agar hanya dimuat saat berjalan di browser
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const CreateBerita = () => {
  const router = useRouter()
  const [judulBerita, setJudulBerita] = useState('');
  const [isiBerita, setIsiBerita] = useState('');
  const [gambar, setGambar] = useState(null);
  const [kategori, setKategori] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('judulBerita', judulBerita);
    formData.append('isiBerita', isiBerita);
    formData.append('image', gambar);
    kategori.forEach((kat) => {
      formData.append('kategori[]', kat);
    });

    try {
      const response = await axios.post('https://myjisc-berita-e694a34d5b58.herokuapp.com/api/berita/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data); // Tampilkan respons dari server
      setIsSuccess(true);
      // Reset semua nilai state setelah pengiriman berhasil
      setJudulBerita('');
      setIsiBerita('');
      setGambar(null);
      setKategori([]);
    } catch (error) {
      console.error('Error creating article:', error);
      setIsError(true);
    }
  };

  const handleClosePopup = () => {
    setIsSuccess(false);
    setIsError(false);
    router.push('/berita')
  };

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    if (kategori.includes(value)) {
      setKategori(kategori.filter((kat) => kat !== value));
    } else {
      setKategori([...kategori, value]);
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
              <label htmlFor="judulBerita" className="block text-gray-700 font-bold mb-2">Judul Berita</label>
              <input type="text" id="judulBerita" value={judulBerita} onChange={(e) => setJudulBerita(e.target.value)} name="judulBerita" className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500" required/>
            </div>

            <div className="mb-4">
            <label htmlFor="isiBerita" className="block text-gray-700 font-bold mb-2">Isi Berita:</label>
            <ReactQuill
              theme="snow"
              value={isiBerita}
              onChange={setIsiBerita}
              required
            />
          </div>

            <div className="mb-4">
              <label htmlFor="gambar" className="block text-gray-700 font-bold mb-2">Gambar:</label>
              <input name="imageBerita" className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500" type="file" id="gambar" onChange={(e) => setGambar(e.target.files[0])}/>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Kategori:</label>
              <div className="flex flex-wrap">
                <label className="mr-4 mb-2"><input type="checkbox" value="Pendidikan" checked={kategori.includes("Pendidikan")} onChange={handleCheckboxChange}/> Pendidikan</label>
                <label className="mr-4 mb-2"><input type="checkbox" value="Teknologi" checked={kategori.includes("Teknologi")} onChange={handleCheckboxChange}/> Teknologi</label>
                <label className="mr-4 mb-2"><input type="checkbox" value="Olahraga" checked={kategori.includes("Olahraga")} onChange={handleCheckboxChange}/> Olahraga</label>
                <label className="mr-4 mb-2"><input type="checkbox" value="Prestasi" checked={kategori.includes("Prestasi")} onChange={handleCheckboxChange}/> Prestasi</label>
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
            <p className="text-green-600 font-semibold">Berita berhasil dibuat!</p>
            <button onClick={handleClosePopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Tutup</button>
          </div>
        </div>
      )}
      {isError && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-red-600 font-semibold">Gagal membuat berita!</p>
            <button onClick={handleClosePopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Tutup</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CreateBerita;