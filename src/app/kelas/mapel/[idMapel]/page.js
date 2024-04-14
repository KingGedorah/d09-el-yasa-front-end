"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as KelasApi from '../../../api/kelas';

const DetailMapel = ({ params }) => {
  const { idMapel } = params;
  const [mapelInfo, setMapelInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMapelInfo = async () => {
      try {
        const mapelData = await KelasApi.getMapelByIdMapel(idMapel);
        setMapelInfo(mapelData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
  
    fetchMapelInfo();
  }, [idMapel]);

  return (
    <div>
      <h1>Detail Mapel</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div>
          <p><strong>Nama Mapel:</strong> {mapelInfo.data.namaMapel}</p>
          <p><strong>NUPTK Guru Mengajar:</strong> {mapelInfo.data.nuptkGuruMengajar}</p>
          <p><strong>ID Kelas:</strong> {mapelInfo.data.idKelas}</p>
          <p><strong>Konten Mapel:</strong></p>
          {mapelInfo.data.listKontenMapel ? (
            <ul>
              {mapelInfo.data.listKontenMapel.map(kontenId => (
                <li key={kontenId}>{kontenId}</li>
              ))}
            </ul>
          ) : (
            <p>Tidak ada konten mapel. <button>Tambah Materi</button></p>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailMapel;
