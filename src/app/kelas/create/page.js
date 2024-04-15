"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Footer from '../../components/footer';
import Navbar from '../../components/navbar';
import { redirect } from 'next/navigation'; // Import redirect from next/navigation

const CreateKelasForm = () => {
  const [namaKelas, setNamaKelas] = useState('');
  const [deskripsiKelas, setDeskripsiKelas] = useState('');
  const [selectedNuptk, setSelectedNuptk] = useState('');
  const [selectedNisn, setSelectedNisn] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const nuptkOptions = [
    '6842059312456801',
    '7932145087561420',
    '5098361274539812',
    '3289657140927640',
    '6152093478125036'
  ].map(option => ({ value: option, label: option }));

  const nisnOptions = [
    '8912075463', '4567891230', '3210987654', '9876543210', '2345678901',
    '1098765432', '8765432109', '5432109876', '6789012345', '9012345678',
    '7654321098', '5432109876', '1234567890', '8901234567', '5678901234',
    '4321098765', '3456789012', '8765432109', '2109876543', '7890123456',
  ].map(option => ({ value: option, label: option }));

  useEffect(() => {
    if (showSuccess) {
      setTimeout(() => {
        redirect('http://localhost:3000/kelas/view-all');
      }, 2000);
    }
  }, [showSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedNisn);
    if (!selectedNuptk || !selectedNuptk.value) {
      window.alert('NUPTK is required');
      return;
    }
    if (selectedNisn.length === 0) {
      window.alert('At least one NISN is required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8083/api/kelas/create', {
        namaKelas,
        deskripsiKelas,
        nuptkWaliKelas: selectedNuptk.value,
        nisnSiswa: selectedNisn.map(nisn => nisn.value),
      });
      console.log('Response:', response.data);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error:', error.response.data);
      window.alert('Periksa kembali inputan anda');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar />
      <div className="container px-4 md:px-6 flex items-center justify-center py-16 md:py-24 lg:py-32">
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito-sans">Tambahkan kelas</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
              Masukkan informasi kelas di sini.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="mb-4">
              <label htmlFor="nama-kelas" className="inline-block text-sm font-medium">Nama Kelas:</label>
              <input placeholder='Nama kelas' type="text" id="nama-kelas" value={namaKelas} onChange={(e) => setNamaKelas(e.target.value)} required className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="deskripsi-kelas" className="inline-block text-sm font-medium">Deskripsi Kelas:</label>
              <textarea placeholder='Deskripsi kelas' id="deskripsi-kelas" value={deskripsiKelas} onChange={(e) => setDeskripsiKelas(e.target.value)} required className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="nuptk-wali-kelas" className="inline-block text-sm font-medium">NUPTK Wali Kelas:</label>
              <Select
                value={selectedNuptk}
                onChange={setSelectedNuptk}
                options={nuptkOptions}
                isSearchable={true}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nisn-siswa" className="inline-block text-sm font-medium">Daftar Siswa:</label>
              <Select
                value={selectedNisn}
                onChange={(selectedOption) => setSelectedNisn(selectedOption)}
                options={nisnOptions}
                isMulti
                isSearchable={true}
                closeMenuOnSelect={false}
              />
            </div>
            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Tambah</button>
          </form>
          {showSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
              <strong className="font-bold">Berhasil!</strong>
              <span className="block sm:inline"> Kelas berhasil ditambahkan.</span>
              <p>Kembali ke <a href="/kelas/view-all">halaman <p class="font-extrabold"></p>semua kelas.</a></p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateKelasForm;
