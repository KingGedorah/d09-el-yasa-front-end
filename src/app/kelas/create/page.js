"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
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

  const handleOk = () => {
    setShowSuccess(false);
    redirect('/kelas/view-all'); // Redirect to '/kelas/view-all' using redirect function
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
        <div className="mb-4">
          <label htmlFor="nama-kelas" className="block text-sm font-medium text-gray-700">Nama Kelas:</label>
          <input type="text" id="nama-kelas" value={namaKelas} onChange={(e) => setNamaKelas(e.target.value)} required className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="deskripsi-kelas" className="block text-sm font-medium text-gray-700">Deskripsi Kelas:</label>
          <textarea id="deskripsi-kelas" value={deskripsiKelas} onChange={(e) => setDeskripsiKelas(e.target.value)} required className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="nuptk-wali-kelas" className="block text-sm font-medium text-gray-700">NUPTK Wali Kelas:</label>
          <Select
            value={selectedNuptk}
            onChange={setSelectedNuptk}
            options={nuptkOptions}
            isSearchable={true}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nisn-siswa" className="block text-sm font-medium text-gray-700">Daftar Siswa:</label>
          <Select
            value={selectedNisn}
            onChange={(selectedOption) => setSelectedNisn(selectedOption)}
            options={nisnOptions}
            isMulti
            isSearchable={true}
            closeMenuOnSelect={false}
          />
        </div>
        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Submit</button>
      </form>
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
          <strong className="font-bold">Berhasil!</strong>
          <span className="block sm:inline">Data berhasil disimpan.</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" onClick={handleOk}>
              <title>Close</title>
              <path fillRule="evenodd" d="M14.354 5.354a1 1 0 0 1 0 1.414L11.414 10l2.94 2.94a1 1 0 1 1-1.414 1.416L10 11.414l-2.94 2.94a1 1 0 1 1-1.414-1.416L8.586 10 5.646 7.06a1 1 0 1 1 1.414-1.416L10 8.586l2.94-2.94a1 1 0 0 1 1.414 0z"/>
            </svg>
          </span>
        </div>
      )}
    </div>
  );
};

export default CreateKelasForm;
