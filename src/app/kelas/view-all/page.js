"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as KelasApi from '../../api/kelas';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import styles from '../../components/button-n-search.css'

const ViewAllKelas = () => {
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKelasList = async () => {
      try {
        const data = await KelasApi.getAllKelas();
        setKelasList(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchKelasList();
  }, []);

  return (
    <div class="bg-white dark:bg-gray-950">
      
      <Navbar />
      <div class="container mx-auto flex justify-center mt-8">
				<main class="w-4/5 md:w-3/5 lg:w-1/2 p-4">
					<div class="search-container">
          <h2 className="text-3xl font-bold mb-4">Daftar Semua Kelas</h2>
						<input type="text" placeholder="Cari kelas..."/>
						<a href={`/kelas/create`}><button type="button">Tambahkan kelas baru...</button></a>
					</div>
    
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {!loading && !error && (
            <>
              {kelasList.map((kelas) => (
                <div key={kelas.idKelas} className="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-800 mb-2">
                  <a href={`/kelas/${kelas.idKelas}`} className="block">
                    <h2 className="text-2xl font-semibold mb-2">{kelas.namaKelas}</h2>
                    <img src="https://epe.brightspotcdn.com/02/ac/a5498e524778b568fea054141968/math-102023-1281244731-01.jpg" alt="Article Image" className="w-full rounded-md mb-4"/>
                    <p className="text-gray-600 mb-4">{kelas.deskripsiKelas}</p>
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

export default ViewAllKelas;
