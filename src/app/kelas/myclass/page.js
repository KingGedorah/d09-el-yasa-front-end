"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllKelasDiajarByIdGuru, getKelasByIdSiswa } from '@/app/api/kelas';
import styles from '../../components/button-n-search.css';
import { parseJwt } from '@/app/utils/jwtUtils';
import { redirect } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';
import Navbar2 from '@/app/components/navbarmurid';

const KelasByUserId = () => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState('');
  const [error, setError] = useState(null);
  const [kelas, setKelas] = useState(null);
  const [loading, setLoading] = useState(true);

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
      //Authorized
    }
  }, [decodedToken]);


  useEffect(() => {
    const fetchKelas = async () => {
      try {
        if (decodedToken) {
          let kelasData;
          if (decodedToken.role === 'GURU') {
            kelasData = await getAllKelasDiajarByIdGuru(decodedToken.id);
          } else if (decodedToken.role === 'MURID') {
            kelasData = await getKelasByIdSiswa(decodedToken.id);
          }
          if (Array.isArray(kelasData.data)) {
            setKelas(kelasData.data);
          } else {
            setKelas([kelasData.data]);
          }
        } else {
          redirect(`/user/login`);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching kelas:', error);
        router.push(`/error/500`);
      }
    };
  
    fetchKelas();
  }, [decodedToken]);
  

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

  if (loading) {
    return <SpinLoading />;
  }


  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar/>
      <div className="container mx-auto flex justify-center mt-8">
        <main className="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <div className="search-container">
            <h2 className="text-3xl font-bold mb-4">Kelasku</h2>
            <input type="text" placeholder="Cari kelas yang kamu ikuti.." />
          </div>
          <div className="container mx-auto mt-4">
            {loading && <p>Loading...</p>}
            {error && <p>Terdapat kesalahan saat memuat kelas</p>}
            {kelas && Array.isArray(kelas) && (
              <div className="container mx-auto mt-4">
                <ul className="divide-y divide-gray-200">
                  {kelas.map((kelasItem) => (
                    <li key={kelasItem.idKelas}>
                      <div className="bg-white rounded-lg overflow-hidden shadow-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <Link href={`/kelas/${kelasItem.idKelas}`}>
                              <h3 className="text-lg font-semibold mb-2 cursor-pointer">{kelasItem.namaKelas}</h3>
                            </Link>
                            <p className="text-gray-600">{kelasItem.deskripsiKelas}</p>
                          </div>
                          <div className="flex">
                            <a href={`/kelas/update/${kelasItem.idKelas}`} className="font-bold text-blue-500 block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-900">Update</a>
                            <button onClick={() => handleDeleteKelas(kelasItem.idKelas)} className="font-bold text-red-500 block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-900">Delete</button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
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
