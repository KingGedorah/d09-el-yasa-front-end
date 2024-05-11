"use client";

import styles from '../../components/button-n-search.css';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as KelasApi from '../../api/kelas';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { parseJwt } from '@/app/utils/jwtUtils';
import { redirect } from 'next/navigation';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';


const DetailKelas = ({ params }) => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState('');
  const { idKelas } = params;
  const [kelasInfo, setKelasInfo] = useState([]);
  const [mapelInfo, setMapelInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setDecodedToken(parseJwt(token));
    } else {
      console.log("Need to login");
      redirect('/user/login');
    }
  }, []);
  
  useEffect(() => {
    if (decodedToken) {
      console.log("Access granted");
    }
  }, [decodedToken]);

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
        router.push(`/error/500`);
      }
    };

    fetchMapelInfo();
  }, [idKelas]);

  // Fungsi untuk menampilkan dropdown
  const handleShowDropdown = (index) => {
    setShowDropdown(index);
  };

  // Fungsi untuk menyembunyikan dropdown
  const handleHideDropdown = () => {
    setShowDropdown(null);
  };

  // Fungsi untuk menghapus mata pelajaran
  const handleDeleteMapel = async (mapelId) => {
    try {
      await axios.delete(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/delete/mapel/${mapelId}`); // Hapus mata pelajaran menggunakan axios.delete
      // Refresh halaman setelah penghapusan berhasil
      window.location.reload();
    } catch (error) {
      console.error('Error deleting mapel:', error);
    }
  };

  if (loading) {
    return <SpinLoading/>;
  }

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
                  <div key={index} className="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-800 mb-2 relative"
                    onMouseEnter={() => handleShowDropdown(index)} // Menampilkan dropdown saat hover
                    onMouseLeave={handleHideDropdown} // Menyembunyikan dropdown saat keluar dari area
                  >
                    <div className="flex justify-between items-center">
                      <a href={`/kelas/mapel/${mapel.idMapel}`} className="block">
                        <h2 className="text-2xl font-semibold mb-2">{mapel.namaMapel}</h2>
                        <img src="https://epe.brightspotcdn.com/02/ac/a5498e524778b568fea054141968/math-102023-1281244731-01.jpg" alt="Article Image" className="w-full rounded-md mb-4"/>
                        <p className="text-gray-600 mb-4">Guru Pengajar: {mapel.nuptkGuruMengajar}</p>
                      </a>
                      {/* Icon gerigi untuk dropdown, hanya ditampilkan untuk peran GURU */}
                      {decodedToken.role === 'GURU' && showDropdown === index && (
                        <div className="absolute top-0 right-0 mt-12 mr-2">
                          <div className="bg-white dark:bg-gray-800 rounded-md shadow-md">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                              <li>
                                <a href={`/kelas/mapel/update/${mapel.idMapel}`} className="font-bold text-blue-500 block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-900">Update</a>
                              </li>
                              <li>
                                <button className="font-bold text-red-500 block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-900" onClick={() => handleDeleteMapel(mapel.idMapel)}>Delete</button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                      {/* Tampilkan ikon gerigi di sudut kanan atas gambar dengan latar belakang putih, hanya untuk peran GURU */}
                      {decodedToken.role  === 'GURU' && (
                        <div className="absolute top-0 right-0 mt-2 mr-2 flex items-center">
                          <p className="font-bold bg-white rounded-full p-1 opacity-50">Sunting</p>
                          <FontAwesomeIcon icon={faEllipsisV} onClick={() => handleShowDropdown(index)} className="ml-1" />
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

export default DetailKelas;
