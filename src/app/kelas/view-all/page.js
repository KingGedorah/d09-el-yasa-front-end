"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as KelasApi from '../../api/kelas';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';

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
    <div>
      <Navbar />
      <Sidebar />
      <div className="container mx-auto mt-4">
        <h2 className="text-2xl font-bold mb-4">Daftar Semua Kelas</h2>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kelasList.map((kelas) => (
              <div key={kelas.idKelas} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="p-4">
                  <Link href={`/kelas/${kelas.idKelas}`} legacyBehavior>
                    <a>
                      <h3 className="text-lg font-semibold mb-2">{kelas.namaKelas}</h3>
                    </a>
                  </Link>
                  <p className="text-gray-600 mb-4">{kelas.deskripsiKelas}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ViewAllKelas;
