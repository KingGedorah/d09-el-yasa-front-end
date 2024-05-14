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
import { AiOutlineWarning } from 'react-icons/ai';
import Navbarmurid from '@/app/components/navbarmurid';
import Navbarguru from '@/app/components/navbarguru';

const KelasByUserId = () => {
  const [id, setId] = useState('');
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState(null); // Use null instead of empty string
  const [error, setError] = useState(null);
  const [kelas, setKelas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isErrorDelete, setIsErrorDelete] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const decoded = parseJwt(token);
      setDecodedToken(decoded);
      setId(decoded.id);
      console.log("TES " + decoded.id);
    } else {
      redirect('/user/login');
    }
  }, []);

  useEffect(() => {
    if (decodedToken) {
      const fetchKelas = async () => {
        try {
          let kelasData;
          if (decodedToken.role === 'GURU') {
            kelasData = await getAllKelasDiajarByIdGuru(decodedToken.id);
            console.log(decodedToken.role);
          } else if (decodedToken.role === 'MURID') {
            kelasData = await getKelasByIdSiswa(decodedToken.id);
            console.log(decodedToken.role);
          }
          if (Array.isArray(kelasData.data)) {
            setKelas(kelasData.data);
          } else {
            setKelas([kelasData.data]);
          }
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };

      fetchKelas();
    }
  }, [decodedToken]);

  const handleDeleteKelas = async (kelasId) => {
    try {
      await axios.delete(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/delete/${kelasId}`);
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
    return <SpinLoading />;
  }

  return (
    <div className="bg-white dark:bg-gray-950">
      {decodedToken && decodedToken.role === 'MURID' && <Navbarmurid role={id} />}
      {decodedToken && decodedToken.role === 'GURU' && <Navbarguru role={id} />}
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

      {showDeleteConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
            <p className="text-red-600 font-semibold mb-4 flex items-center">
              <AiOutlineWarning className="mr-2" />
              Apakah Anda yakin ingin menghapus kelas ini?
            </p>
            <div className="flex">
              <button onClick={handleDeleteKelas} className="bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600 transition duration-300">
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
            <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan pada server coba lagi nanti</p>
            <button onClick={handleErrorDeletePopUp} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default KelasByUserId;
