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
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';


const ViewAllKelas = () => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState('');
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isErrorDelete, setIsErrorDelete] = useState(false);


  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setDecodedToken(parseJwt(token));
    } else {
      redirect('/user/login');
    }
  }, []);

  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role === 'ADMIN') {
        //Authorized
      } else {
        redirect(`/kelas/myclass`);
      }
    }
  }, [decodedToken]);

  useEffect(() => {
    const fetchKelasList = async () => {
      try {
        const data = await KelasApi.getAllKelas();
        setKelasList(data);
        setLoading(false);
      } catch (error) {
        router.push(`/error/500`);
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
      await axios.delete(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/delete/${idKelas}`); // Menghapus data dengan menggunakan Axios
      // Refresh halaman setelah penghapusan berhasil
      setIsSuccessDelete(true);
    } catch (error) {
      console.error('Error deleting kelas:', error);
      setIsErrorDelete(true);
    }
  };

  const handleSuccessDeletePopup = () => {
    setIsSuccessDelete(false);
    window.location.reload();
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleErrorDeletePopUp = () => {
    setIsErrorDelete(false);
  };

  if (loading) {
    return <SpinLoading/>;
  }

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
                    {decodedToken.role === 'ADMIN' && showDropdown === kelas.idKelas && (
                      
                      <div className="absolute top-0 right-0 mt-12 mr-2">
                                
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
                    {decodedToken.role === 'ADMIN' && (
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
      
      {showDeleteConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
            <p className="text-red-600 font-semibold mb-4 flex items-center">
              <AiOutlineWarning className="mr-2" />
              Apakah Anda yakin ingin menghapus kelas ini?
            </p>
            <div className="flex">
              <button onClick={confirmDelete} className="bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600 transition duration-300">
                Delete
              </button>
              <button onClick={handleCloseDeleteConfirmation} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 flex items-center justify-center mx-auto">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
            <p className="text-green-600 font-semibold mb-4">Kelas berhasil dihapus!</p>
            <button onClick={handleSuccessDeletePopup} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}

      {isErrorDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
            <p className="text-green-600 font-semibold mb-4">Terjadi kesalahan pada server coba lagi nanti</p>
            <button onClick={handleErrorDeletePopUp} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}


      <Footer />
    </div>
  );
};

export default ViewAllKelas;
