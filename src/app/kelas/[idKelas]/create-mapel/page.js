"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import Select from 'react-select';
import { getAllGuru } from '@/app/api/user';

const FormCreateMapel = ({ params }) => {
  const { idKelas } = params;
  const [namaMapel, setNamaMapel] = useState('');
  const [selectedNuptk, setSelectedNuptk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false); // State untuk menampilkan modal
  const [nuptkOptions, setNuptkOptions] = useState(null);

  useEffect(() => {
    const fetchNuptkOptions = async () => {
      try {
        const data = await getAllGuru(sessionStorage.getItem('jwtToken'));
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  })

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/${idKelas}/create-mapel`, {
        namaMapel,
        nuptkGuruMengajar: selectedNuptk.value,
      });
      console.log('Response:', response);
      setShowSuccess(true);
      setShowModal(true); // Menampilkan modal setelah sukses
    } catch (error) {
      console.error('Error:', error);
      window.alert('Periksa kembali inputan anda');
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar />
      <div className="container px-4 md:px-6 flex items-center justify-center py-16 md:py-24 lg:py-32">
        <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito-sans">Tambahkan mata pelajaran baru</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
              Masukkan informasi mata pelajaran di sini.
            </p>
          </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="inline-block text-sm font-medium" htmlFor="namaMapel">Nama mata pelajaran:</label>
            <input 
              type="text" 
              className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              id="namaMapel" 
              value={namaMapel} 
              onChange={(e) => setNamaMapel(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="inline-block text-sm font-medium" htmlFor="nuptkGuruMengajar">NUPTK Guru Mengajar:</label>
            <Select
              className='text-sm'
              options={nuptkOptions}
              value={selectedNuptk}
              onChange={setSelectedNuptk}
              placeholder="Pilih NUPTK Guru Mengajar"
            />
          </div>
          <div className='grid place-items-center'>
            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 items-center">
              Buat mata pelajaran
            </button>
          </div>
        </form>
      </div>
      {showModal && (
        <div id="modal" className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white max-w-xl w-full rounded-md">
            <div className="p-3 flex items-center justify-between border-b border-b-gray-300"> 
              <h3 className="font-semibold text-xl">
                Berhasil :)
              </h3>
              <span className="modal-close cursor-pointer" onClick={closeModal}>×</span> 
            </div>
            <div className="p-3 border-b border-b-gray-300">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded relative mt-4" role="alert">
                <p className="block sm:inline">Mapel berhasil dibuat! Kembali ke <a className="font-bold" href={`http://localhost:3000/kelas/${idKelas}`}>halaman kelas</a>.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
};

export default FormCreateMapel;
