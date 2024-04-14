"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as KelasApi from '../../../api/kelas';

const DetailMapel = ({ params }) => {
  const { idMapel } = params;
  const [materiInfo, setMateriInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMapelInfo = async () => {
      try {
        const mapelData = await KelasApi.getMapelByIdMapel(idMapel);
        const materiPromises = mapelData.data.listKontenMapel.map(async (idMateri) => {
          const materiData = await KelasApi.getMateriByIdMateri(idMateri);
          return materiData.data;
        })
        const materiData = await Promise.all(materiPromises);
        setMateriInfo(materiData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    
    console.log(materiInfo);
    fetchMapelInfo();
  }, [idMapel]);

  return (
    <div>
      <h1>Detail Mapel</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div>
          {materiInfo.map((materi, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div className="p-4">
                <h2 className="text-xl font-bold">{materi.judulKonten}</h2>
                <h2 className="text-xl font-bold">{materi.isiKonten}</h2>
                <h2 className="text-xl font-bold">{materi.nama_file}</h2>
                <h2 className="text-xl font-bold">{materi.tipe_file}</h2>
                <h2 className="text-xl font-bold">{materi.idKonten}</h2>

                {/* TODO AFIQ : TOLONG DI HANDLE ini ngecek kalo nama file nya ga ada di disable aja buat nama_file, tipe_file, sama link download ini */}
                <h2 className="text-xl font-bold">Link download : http://localhost:8083/api/kelas/{materi.fileKonten}</h2>
                <h2 className="text-xl font-bold">{materi.materiPelajaran}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailMapel;
