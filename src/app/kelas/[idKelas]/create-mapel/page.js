"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import * as KelasApi from '../../../api/kelas';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import Sidebar from '../../../components/sidebar';
import Select from 'react-select';

const FormCreateMapel = ({ params }) => {
  const { idKelas } = params;
  const [namaMapel, setNamaMapel] = useState('');
  const [selectedNuptk, setSelectedNuptk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const nuptkOptions = [
    '6842059312456801',
    '7932145087561420',
    '5098361274539812',
    '3289657140927640',
    '6152093478125036'
  ].map(option => ({ value: option, label: option }));

  console.log(idKelas);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8083/api/kelas/${idKelas}/create-mapel`, {
        namaMapel,
        nuptkGuruMengajar: selectedNuptk.value,
      });
      console.log('Response:', response);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      window.alert('Periksa kembali inputan anda');
    }
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
          {error && <p className="text-danger mt-2">{error}</p>}
          {showSuccess && <p className="text-success mt-2">Mapel berhasil dibuat!</p>}
        </form>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default FormCreateMapel;