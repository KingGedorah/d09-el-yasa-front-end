"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import * as KelasApi from '../../../../api/kelas';
import Select from 'react-select';

const UpdateMapelForm = ({ params }) => {
  const { idMapel } = params;
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

  console.log(idMapel);

  useEffect(() => {
    async function fetchData() {
        try {
            const response = await KelasApi.getMapelByIdMapel(idMapel);
            const {data} = response;

            setNamaMapel(data.namaMapel);
            setSelectedNuptk({value: data.nuptkGuruMengajar, label: data.nuptkGuruMengajar});
        } catch (error) {
            console.error('Error', error.response);
        }
    }
    fetchData();
    
  }, [idMapel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8083/api/kelas/mapel/update/${idMapel}`, {
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
            Update Mapel
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
          {showSuccess && <p className="text-success mt-2">Mapel berhasil diubah!</p>}
        </form>
      </div>
    </div>
  );
};

export default UpdateMapelForm;