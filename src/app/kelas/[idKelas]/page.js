"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as KelasApi from '../../api/kelas';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import styles from '../../components/button-n-search.css'

const DetailKelas = ({ params }) => {
  const { idKelas } = params;
  const [kelasInfo, setKelasInfo] = useState([]);
  const [mapelInfo, setMapelInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchMapelInfo = async () => {
      try {
        const kelasData = await KelasApi.getKelasByIdKelas(idKelas);
        setKelasInfo(kelasData.data);
        const mapelPromises = kelasData.data.listMataPelajaran.map(async (mapelId) => {
          const mapelData = await KelasApi.getMapelByIdMapel(mapelId);
          return mapelData.data;
        });
        const mapelData = await Promise.all(mapelPromises);
        setMapelInfo(mapelData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMapelInfo();
  }, [idKelas]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar />
      <div className="container mx-auto flex justify-center mt-8">
        <main className="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <div className="search-container">
            <h2 className="text-3xl text-center font-bold mb-4">Selamat datang di {kelasInfo.namaKelas}</h2>
            <h2 className="text-2xl font-bold mb-4">Daftar Semua Mata Pelajaran</h2>
            <input type="text" placeholder="Cari mata pelajaran..."/>
            <a href={`/kelas/${kelasInfo.idKelas}/create-mapel`}><button type="button">Tambahkan mata pelajaran baru...</button></a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && (
              <>
                {mapelInfo.map((mapel, index) => (
                  <div key={index} className="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-800 mb-2">
                    <a href={`/kelas/mapel/${mapel.idMapel}`} className="block">
                      <h2 className="text-2xl font-semibold mb-2">{mapel.namaMapel}</h2>
                      <img src="https://epe.brightspotcdn.com/02/ac/a5498e524778b568fea054141968/math-102023-1281244731-01.jpg" alt="Article Image" className="w-full rounded-md mb-4"/>
                      <p className="text-gray-600 mb-4">Guru Pengajar: {mapel.nuptkGuruMengajar}</p>
                    </a>
                  </div>
                ))}
              </>
            )}
          </div>
        </main>
        <Sidebar />
      </div>
      <Footer />
    </div>
  );
};

export default DetailKelas;
