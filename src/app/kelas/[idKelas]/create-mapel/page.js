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
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1>Create Mapel</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="namaMapel">Nama Mapel:</label>
            <input 
              type="text" 
              className="form-control" 
              id="namaMapel" 
              value={namaMapel} 
              onChange={(e) => setNamaMapel(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="nuptkGuruMengajar">NUPTK Guru Mengajar:</label>
            <Select
              options={nuptkOptions}
              value={selectedNuptk}
              onChange={setSelectedNuptk}
              placeholder="Pilih NUPTK Guru Mengajar"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Mapel
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
          {showSuccess && <p className="text-success mt-2">Mapel berhasil dibuat!</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default FormCreateMapel;