"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as KelasApi from '../../api/kelas';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';

const KelasByUserId = () => {
  const [kelas, setKelas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        // TODO : Parse jwt token to determine role and change the fetch method
        // For siswa
        const idSiswa = "1"
        const idUser = idSiswa
        const kelasData = await KelasApi.getKelasByIdSiswa(idUser);

        // For Guru
        // const idGuru = "123456"  
        // const kelasData = await KelasApi.getAllKelasDiajarByIdGuru(idUser);

        setKelas(kelasData.data); // Access the 'data' property from the response
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchKelas();
  }, []);

  
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="container mx-auto mt-4">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {kelas && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div key={kelas.idKelas} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="p-4">
                <Link href={`/kelas/${kelas.idKelas}`}>
                  <h3 className="text-lg font-semibold mb-2 cursor-pointer">{kelas.namaKelas}</h3>
                </Link>
                <p className="text-gray-600">{kelas.deskripsiKelas}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default KelasByUserId;