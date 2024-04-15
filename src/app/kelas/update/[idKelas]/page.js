"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';
import * as KelasApi from '../../../api/kelas';

const nuptkOptions = [
  '6842059312456801',
  '7932145087561420',
  '5098361274539812',
  '3289657140927640',
  '6152093478125036',
].map(option => ({ value: option, label: option }));

const nisnOptions = [
  '8912075463',
  '4567891230',
  '3210987654',
  '9876543210',
  '2345678901',
  '1098765432',
  '8765432109',
  '5432109876',
  '6789012345',
  '9012345678',
  '7654321098',
  '5432109876',
  '1234567890',
  '8901234567',
  '5678901234',
  '4321098765',
  '3456789012',
  '8765432109',
  '2109876543',
  '7890123456',
].map(option => ({ value: option, label: option }));

const UpdateKelasForm = ({ params }) => {
  const { idKelas } = params;

  const [namaKelas, setNamaKelas] = useState('');
  const [deskripsiKelas, setDeskripsiKelas] = useState('');
  const [selectedNuptk, setSelectedNuptk] = useState('');
  const [errorPopup, setErrorPopup] = useState(false);
  const [selectedNisn, setSelectedNisn] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await KelasApi.getKelasByIdKelas(idKelas);
        const { data } = response;

        setNamaKelas(data.namaKelas);
        setDeskripsiKelas(data.deskripsiKelas);
        setSelectedNuptk({ value: data.nuptkWaliKelas, label: data.nuptkWaliKelas });
        setSelectedNisn(data.nisnSiswa.map(nisn => ({ value: nisn, label: nisn })));
      } catch (error) {
        console.error('Error:', error.response.data);
      }
    }

    fetchData();
  }, [idKelas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNuptk) {
      console.error('NUPTK is required and must be valid');
      return;
    }
    if (selectedNisn.length === 0) {
      setErrorPopup(true);
      return;
    }

    const uniqueSelectedNisn = selectedNisn.filter((value, index, self) =>
        index === self.findIndex(v => String(v.value) === String(value.value)));

    console.log(uniqueSelectedNisn)

    try {
      const response = await axios.put(
        `http://localhost:8083/api/kelas/update/${idKelas}`,
        {
          namaKelas,
          deskripsiKelas,
          nuptkWaliKelas: selectedNuptk.value,
          nisnSiswa: uniqueSelectedNisn.map(nisn => nisn.value),
        }
      );
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  const handleCloseErrorPopup = () => {
    setErrorPopup(false);
  };

  // Filter NISN options based on selected NISN
  const filteredNisnOptions = nisnOptions.filter(option =>
    !selectedNisn.some(selected => selected.value === option.value)
  );

  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar />
      <div className="container px-4 md:px-6 flex items-center justify-center py-16 md:py-24 lg:py-32">
      <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito-sans">Perbarui kelas</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
              Masukkan informasi kelas di sini.
            </p>
          </div>
      <form
        onSubmit={handleSubmit}
        className=""
      >
        <div className="mb-4">
          <label
            htmlFor="nama-kelas"
            className="inline-block text-sm font-medium"
          >
            Nama Kelas:
          </label>
          <input
            type="text"
            id="nama-kelas"
            value={namaKelas}
            onChange={(e) => setNamaKelas(e.target.value)}
            required
            className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="deskripsi-kelas"
            className="inline-block text-sm font-medium"
          >
            Deskripsi Kelas:
          </label>
          <textarea
            id="deskripsi-kelas"
            value={deskripsiKelas}
            onChange={(e) => setDeskripsiKelas(e.target.value)}
            required
            className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="nuptk-wali-kelas"
            className="inline-block text-sm font-medium"
          >
            NUPTK Wali Kelas:
          </label>
          <Select
            value={selectedNuptk}
            onChange={setSelectedNuptk}
            options={nuptkOptions}
            isSearchable={true}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="nisn-siswa"
            className="inline-block text-sm font-medium"
          >
            Daftar Siswa:
          </label>
          <Select
            value={selectedNisn}
            onChange={setSelectedNisn}
            options={filteredNisnOptions}
            isMulti
            isSearchable={true}
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
        >
          Perbarui
        </button>
      </form>
      {errorPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-md">
            <p className="text-lg text-gray-800 mb-4">Cek kembali inputan anda</p>
            <button
              onClick={handleCloseErrorPopup}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
      </div>
      
      </div>
     <Footer/>
    </div>
  );
};

export default UpdateKelasForm;