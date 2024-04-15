"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import Sidebar from '@/app/components/sidebar';
import * as KelasApi from '../../../api/kelas';
import styles from '@/app/components/button-n-search.css'


const DetailMapel = ({ params }) => {
  const { idMapel } = params;
  const [materiInfo, setMateriInfo] = useState({});
  const [mapelInfo, setMapelInfo] = useState([]);
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
        setMapelInfo(mapelData.data);
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
    <div class="bg-white dark:bg-gray-950">
      <Navbar />
      <div class="container mx-auto flex justify-center mt-8">
				<main class="w-4/5 md:w-3/5 lg:w-1/2 p-4">
					<div class="search-container">
          <h2 className="text-3xl font-bold mb-4">Selamat datang di mata pelajaran {mapelInfo.namaMapel}!</h2>
						<a href={`/kelas/mapel/${idMapel}/create-materi`}><button type="button">Tambahkan materi baru...</button></a>
					</div>
          <h2 className="text-2xl font-bold">Materi</h2>
    {loading && <p>Loading...</p>}
    {!loading && !error && materiInfo ? (
      materiInfo.map((materi, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          
          <div className="p-4">
            <h2 className="text-xl font-bold">{materi.judulKonten}</h2>
            <h2 className="text-base">Materi: {materi.isiKonten}</h2>
            {materi.nama_file && (
              <h2 className="text-base"></h2>
            )}
            {materi.nama_file && (
              
              <h2 className="text-base">
                <svg class="h-6 w-6 text-blue-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M14 3v4a1 1 0 0 0 1 1h4" />  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />  <line x1="12" y1="11" x2="12" y2="17" />  <polyline points="9 14 12 17 15 14" /></svg>{' '}
                <a className="font-bold text-green-800" href={`http://localhost:8083/api/kelas/get/materi/${materi.idKonten}`} target="_blank" rel="noopener noreferrer">
                  {materi.nama_file}
                </a>
              </h2>
            )}
            <h2 className="text-base">{materi.materiPelajaran}</h2>
</div>

        </div>
      ))
    ) : (
      <p>Tidak ada materi yang tersedia untuk mapel ini.</p>
    )}
    </main>
    <Sidebar/>
    </div>
    <Footer/>
  </div>
  

  );
};

export default DetailMapel;
