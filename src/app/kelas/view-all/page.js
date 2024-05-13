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
  const [query, setQuery] = useState("")


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
      if (decodedToken.role === 'ADMIN' || decodedToken.role === 'GURU') {
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

  const handleChangeSearchBar = (e) => {
    setQuery(e.target.value)
  }

  if (loading) {
    return <SpinLoading/>;
  }

  return (
    <div class="bg-[#F3F5FB]">
      <Navbar />
      <div class="container mx-auto flex justify-center mt-8 mb-16">
        <main class="w-4/5 md:w-3/5 lg:w-1/2 p-4">
        <div class="search-container">
            <h2 className="text-2xl mx-auto font-bold mb-4">Classes</h2>
            <div className='relative'>
              <input onChange={handleChangeSearchBar} type='text' className="border !border-[#6C80FF] mb-4 !rounded-xl py-3 bg-transparent px-4 w-full focus:outline-none focus:border-blue-500" />
              <div className='absolute top-[14px] right-4'>
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 0C13.968 0 18 4.032 18 9C18 13.968 13.968 18 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0ZM9 16C12.867 16 16 12.867 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16ZM17.485 16.071L20.314 18.899L18.899 20.314L16.071 17.485L17.485 16.071Z" fill="#6C80FF" />
                </svg>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && (
              <>
                {kelasList.filter(k => k.namaKelas.toLowerCase().includes(query.toLowerCase())).map((kelas) => (
                <div
                  key={kelas.idKelas}
                  className="bg-white mb-2 relative border border-[#6C80FF] rounded-xl"
                  onMouseEnter={() => handleShowDropdown(kelas.idKelas)} // Menampilkan dropdown saat hover
                  onMouseLeave={handleHideDropdown} // Menyembunyikan dropdown saat keluar dari area
                >
                  <div className="flex justify-between items-center p-8 rounded-xl">
                    <a href={`/kelas/${kelas.idKelas}`} className="block">
                      <h2 className="text-2xl font-semibold mb-2">{kelas.namaKelas}</h2>
                      <img
                        src="https://epe.brightspotcdn.com/02/ac/a5498e524778b568fea054141968/math-102023-1281244731-01.jpg"
                        alt="Article Image"
                        className="w-full rounded-md mb-4"
                      />
                      <p className="text-gray-600">{kelas.deskripsiKelas}</p>
                    </a>
                    {/* Icon gerigi untuk dropdown, hanya ditampilkan untuk peran GURU */}
                    {decodedToken.role === 'ADMIN' || decodedToken.role === 'GURU' && showDropdown === kelas.idKelas && (
                      
                      <div className="absolute top-0 right-0 mt-8 mr-8">
                        <div className="bg-white rounded-md shadow-md">
                          <ul className="divide-y divide-gray-200">
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
                    {decodedToken.role === 'ADMIN' || decodedToken.role === 'GURU' && (
                      <div className="absolute top-0 right-0 mt-8 mr-8 flex items-center rotate-90">
                        <FontAwesomeIcon icon={faEllipsisV} onClick={() => handleShowDropdown(kelas.idKelas)} />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              </>
            )}
          </div>
        </main>
        <div className='flex flex-col gap-4'>
            <Link href="/kelas/create" className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'><svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12.5 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.5 12H16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
              Create a Class
            </Link>
            <Sidebar />
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
