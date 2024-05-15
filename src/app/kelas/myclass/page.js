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
import FadeIn from '@/app/components/fadein-div';
import { FaRegSadCry } from 'react-icons/fa';

const KelasByUserId = () => {
  const [id, setId] = useState('');
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState(null); // Use null instead of empty string
  const [error, setError] = useState(null);
  const [kelas, setKelas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isErrorDelete, setIsErrorDelete] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const decoded = parseJwt(token);
      setDecodedToken(decoded);
      setId(decoded.id);
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
          } else if (decodedToken.role === 'MURID') {
            kelasData = await getKelasByIdSiswa(decodedToken.id);
          }
          if (kelasData == null) {
            // setLoading(false)
          } else {
            if (Array.isArray(kelasData.data)) {
              setKelas(kelasData.data);
            } else {
              setKelas([kelasData.data]);
            }
          }
          setLoading(false);
        } catch (error) {
          // console.log(error);
          router.push(`/error/500`)
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
    <FadeIn>
      <div style={{ marginBottom: '100px' }}>
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
              {kelas === null && (
                <div className="text-center">
                  <FaRegSadCry size={64} className="text-gray-400 mx-auto" />
                  <p className="text-lg font-semibold mt-4">Tidak ada kelas yang kamu ikuti</p>
                  <p className="text-sm text-gray-600">Segera hubungi staff atau pengajar akademik !</p>
                </div>
              )}
              {kelas && Array.isArray(kelas) && (
                <div className="container mx-auto mt-4">
                  <ul className="divide-y divide-gray-200">
                    {kelas.map((kelasItem) => (
                      <li key={kelasItem.idKelas} className="mb-4">
                        <div className="bg-white rounded-lg overflow-hidden shadow-md p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <Link href={`/kelas/${kelasItem.idKelas}`}>
                                <h3 className="text-lg font-semibold mb-2 cursor-pointer">{kelasItem.namaKelas}</h3>
                              </Link>
                              <p className="text-gray-600">{kelasItem.deskripsiKelas}</p>
                            </div>
                            {decodedToken && decodedToken.role === 'GURU' && (
                              <div className="flex">
                                <a href={`/kelas/update/${kelasItem.idKelas}`} className="font-bold text-blue-500 block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-900">Update</a>
                                <button onClick={() => handleDeleteKelas(kelasItem.idKelas)} className="font-bold text-red-500 block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-900">Delete</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </main>
          <div>
            <div className="flex items-center justify-between">
              {decodedToken && decodedToken.role === "GURU" && (
                <a href="/kelas/view-all" className="sidebar-button flex items-center justify-center gap-2 py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 w-full">
                  <span>View All Kelas</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 4a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2h-1l-2 3H6l-2-3H2a2 2 0 01-2-2V4zm2-2a1 1 0 00-1 1v1h16V3a1 1 0 00-1-1H4zm2 10h8v3l-2 2H8l-2-2v-3zm1 2v-1h6v1l1 1H6l1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
            </div>
            <div className="mt-4">
              <Sidebar />
            </div>
          </div>
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
    </FadeIn>
  );
};

export default KelasByUserId;