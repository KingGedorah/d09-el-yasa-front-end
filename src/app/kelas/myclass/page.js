"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllKelasDiajarByIdGuru, getKelasByIdSiswa } from '@/app/api/kelas';
import styles from '../../components/button-n-search.css';
import { parseJwt } from '@/app/utils/jwtUtils';
import { redirect } from 'next/navigation';

import axios from 'axios'; // Import Axios library
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const KelasByUserId = () => {
  const [kelas, setKelas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const decodedToken = parseJwt(sessionStorage.getItem('jwtToken'));
        if (decodedToken) {
            if (decodedToken.role == 'GURU') {
                const kelasData = await getAllKelasDiajarByIdGuru(decodedToken.id);
                console.log('id guru ', decodedToken.id);
                setKelas(kelasData);
                console.log(kelas);
            } else if (decodedToken.role == 'MURID'){
              const kelasData = await getKelasByIdSiswa(decodedToken.id);
              console.log('id siswa', decodedToken.id)
              setKelas(kelasData.data);
            }
        } else {
            redirect(`/user/login`)
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchKelas();
  }, []);

  // Fungsi untuk menghapus kelas
  const handleDeleteKelas = async () => {
    try {
      await axios.delete(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/delete/${kelas.idKelas}`); // Menghapus data dengan menggunakan Axios
      // Refresh halaman setelah penghapusan berhasil
      window.location.reload();
    } catch (error) {
      console.error('Error deleting kelas:', error);
      // Tampilkan pesan error kepada pengguna
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar />
      <div className="container mx-auto flex justify-center mt-8">
        <main className="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <div className="search-container">
            <h2 className="text-3xl font-bold mb-4">Kelasku</h2>
            <input type="text" placeholder="Cari kelas yang kamu ikuti.."/>
          </div>
          <div className="container mx-auto mt-4">
            {loading && <p>Loading...</p>}
            {error && <p>Tidak ada kelas.</p>}
            {kelas && (
              <div key={kelas.idKelas} className="relative">
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <Link href={`/kelas/${kelas.idKelas}`}>
                        <h3 className="text-lg font-semibold mb-2 cursor-pointer">{kelas.namaKelas}</h3>
                      </Link>
                      <p className="text-gray-600">{kelas.deskripsiKelas}</p>
                    </div>
                    <div className="flex">
                      <a href={`/kelas/update/${kelas.idKelas}`} className="font-bold text-blue-500 block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-900">Update</a>
                      <button onClick={handleDeleteKelas} className="font-bold text-red-500 block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-900">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Sidebar />
      </div>
      <Footer />
    </div>
  );
};

export default KelasByUserId;
