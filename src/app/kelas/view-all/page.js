"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Import Axios library
import * as KelasApi from '../../api/kelas';
import Navbar from '../../components/navbar';
import { redirect } from 'next/navigation';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import styles from '../../components/button-n-search.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { parseJwt } from '@/app/utils/jwtUtils';


const ViewAllKelas = () => {
  const decodedToken = parseJwt(sessionStorage.getItem('jwtToken'));
  const username = decodedToken ? decodedToken.username : null;
  const userRole = decodedToken ? decodedToken.role : null;
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null); // State untuk menampilkan dropdown

  if (decodedToken) {
    console.log('Decoded Token:', decodedToken);
    console.log('ID:', decodedToken.id);
    console.log('Role:', decodedToken.role);
    console.log('Username:', decodedToken.username);
  } else {
      redirect('/user/login');
  }

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

  // Fungsi untuk menampilkan dropdown
  const handleShowDropdown = (id) => {
    setShowDropdown(id);
  };

  // Fungsi untuk menyembunyikan dropdown
  const handleHideDropdown = () => {
    setShowDropdown(null);
  };

  // Fungsi untuk menghapus kelas
  const handleDeleteKelas = async (idKelas) => {
    try {
      await axios.delete(`http://localhost:8083/api/kelas/delete/${idKelas}`); // Menghapus data dengan menggunakan Axios
      // Refresh halaman setelah penghapusan berhasil
      window.location.reload();
    } catch (error) {
      console.error('Error deleting kelas:', error);
      // Tampilkan pesan error kepada pengguna
    }
  };

  return (
    <div class="bg-white dark:bg-gray-950">
      <Navbar />
      <div class="container mx-auto flex justify-center mt-8">
        <main class="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <div class="search-container">
            <h2 className="text-3xl font-bold mb-4">Daftar Semua Kelas</h2>
            <input type="text" placeholder="Cari kelas..." />
            <a href={`/kelas/create`}>
              <button type="button">Tambahkan kelas baru...</button>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && (
              <>
                {kelasList.map((kelas) => (
                <div
                  key={kelas.idKelas}
                  className="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-800 mb-2 relative"
                  onMouseEnter={() => handleShowDropdown(kelas.idKelas)} // Menampilkan dropdown saat hover
                  onMouseLeave={handleHideDropdown} // Menyembunyikan dropdown saat keluar dari area
                >
                  <div className="flex justify-between items-center">
                    <a href={`/kelas/${kelas.idKelas}`} className="block">
                      <h2 className="text-2xl font-semibold mb-2">{kelas.namaKelas}</h2>
                      <img
                        src="https://epe.brightspotcdn.com/02/ac/a5498e524778b568fea054141968/math-102023-1281244731-01.jpg"
                        alt="Article Image"
                        className="w-full rounded-md mb-4"
                      />
                      <p className="text-gray-600 mb-4">{kelas.deskripsiKelas}</p>
                    </a>
                    {/* Icon gerigi untuk dropdown, hanya ditampilkan untuk peran GURU */}
                    {userRole === 'GURU' && showDropdown === kelas.idKelas && (
                      
                      <div className="absolute top-0 right-0 mt-12 mr-2">
                                <p>Halo, {username}. Role Anda di sini adalah sebagai {userRole}</p>
                        <div className="bg-white dark:bg-gray-800 rounded-md shadow-md">
                          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            <li>
                              <a href={`/kelas/update/${kelas.idKelas}`} className="font-bold text-blue-500 block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-900">Update</a>
                            </li>
                            <li>
                              <a href="#" onClick={() => handleDeleteKelas(kelas.idKelas)} className="font-bold text-red-500 block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-900">Delete</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                    {/* Tampilkan ikon gerigi di sudut kanan atas gambar dengan latar belakang putih, hanya untuk peran GURU */}
                    {userRole === 'GURU' && (
                      <div className="absolute top-0 right-0 mt-2 mr-2 flex items-center">
                        <span className="bg-white rounded-full p-1 font-bold opacity-50">Sunting</span>
                        <FontAwesomeIcon icon={faEllipsisV} onClick={() => handleShowDropdown(kelas.idKelas)} className="ml-1" />
                      </div>
                    )}
                  </div>
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
