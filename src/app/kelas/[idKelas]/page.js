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
import { AiOutlineWarning } from 'react-icons/ai';
import Navbarguru from '@/app/components/navbarguru';
import Navbaradmin from '@/app/components/navbaradmin';
import FadeIn from '@/app/components/fadein-div';
import { FaBook, FaArrowLeft } from 'react-icons/fa';


const ViewAllKelas = ({ params }) => {
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
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
  const { idKelas } = params;
  const [kelasInfo, setKelasInfo] = useState([]);
  const [mapelInfo, setMapelInfo] = useState([]);
  const baseUrlKelas = process.env.NEXT_PUBLIC_BASE_KELAS_API
  const baseUrlUser = process.env.NEXT_PUBLIC_BASE_USER_API

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const decoded = parseJwt(token);
      setDecodedToken(decoded);
      setId(decoded.id);
      setRole(decoded.role);
    } else {
      redirect('/user/login');
    }
  }, []);

  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role === 'MURID' || decodedToken.role === 'GURU') {
        //Authorized
      } else {
        redirect(`/kelas/myclass`);
      }
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
  const handleShowDropdown = (id) => {
    setShowDropdown(id);
  };

  // Fungsi untuk menyembunyikan dropdown
  const handleHideDropdown = () => {
    setShowDropdown(null);
  };

  // Fungsi untuk menghapus mata pelajaran
  const handleDeleteMapel = async (mapelId) => {
    try {
      await axios.delete(`${baseUrlKelas}/delete/mapel/${mapelId}`);

      // Pengecekan jika terdapat nilai siswa dari mapel tersebut
      const scoreResponse = await axios.get(`${baseUrlUser}/score/view-all/mapel/${mapelId}`);
      if (scoreResponse.status === 200) {
        await axios.delete(`${baseUrlUser}/score/delete/mape/${mapelId}`);
      }

      setIsSuccessDelete(true);
    } catch (error) {
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
    return <SpinLoading />;
  }

  return (
    <FadeIn>
      <div class="bg-[#F3F5FB]">
        <Navbar id={id} role={role}/>
        <div class="container mx-auto flex justify-center mt-8 mb-16">
          <main class="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <div className="flex items-center mb-4">
            <Link href="/kelas/myclass" className="text-[#6C80FF] flex items-center gap-2">
              <FaArrowLeft className="text-[#6C80FF]" />
              MyClass
            </Link>
          </div>
            <div class="search-container">
              <h2 className="text-2xl text-center font-bold mb-4">Welcome to {kelasInfo.namaKelas}</h2>
              <div className='relative'>
                <input placeholder='Search subject....' onChange={handleChangeSearchBar} type='text' className="border !border-[#6C80FF] mb-4 !rounded-xl py-3 bg-transparent px-4 w-full focus:outline-none focus:border-blue-500" />
                <div className='absolute top-[14px] right-4'>
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 0C13.968 0 18 4.032 18 9C18 13.968 13.968 18 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0ZM9 16C12.867 16 16 12.867 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16ZM17.485 16.071L20.314 18.899L18.899 20.314L16.071 17.485L17.485 16.071Z" fill="#6C80FF" />
                  </svg>
                </div>
              </div>
            </div>

            {mapelInfo == null || mapelInfo.length == 0 && (
                <div className="justify-center text-center">
                  <FaBook size={64} className="text-gray-400 mx-auto" />
                  <p className="text-lg font-semibold mt-4">No subject registered</p>
                  <p className="text-sm text-gray-600">Contact teacher immediately</p>
                </div>
              )}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading && <p>Loading...</p>}
              {error && <p>Error: {error.message}</p>}
              {!loading && !error && mapelInfo.length > 0 && (
                <>
                  {mapelInfo.filter(m => m.namaMapel.toLowerCase().includes(query.toLowerCase())).map((mapel, index) => (
                    <div
                      key={index}
                      className="bg-white mb-2 relative border border-[#6C80FF] rounded-xl"
                      onMouseEnter={() => handleShowDropdown(index)} // Menampilkan dropdown saat hover
                      onMouseLeave={handleHideDropdown} // Menyembunyikan dropdown saat keluar dari area
                    >
                      <div className="flex justify-between items-center p-8 rounded-xl">
                        <a href={`/kelas/mapel/${mapel.idMapel}`} className="block">
                          <h2 className="text-2xl font-semibold mb-2">{mapel.namaMapel}</h2>
                          <img src="https://epe.brightspotcdn.com/02/ac/a5498e524778b568fea054141968/math-102023-1281244731-01.jpg" alt="Article Image" className="w-full rounded-md mb-4" />
                        </a>
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
                        {decodedToken.role === 'GURU' && (
                          <div className="absolute top-0 right-0 mt-10 mr-4 flex items-center rotate-90">
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
          <div className='flex flex-col gap-4'>
            {decodedToken.role === "GURU" && (
              <Link href={`/kelas/${kelasInfo.idKelas}/create-mapel`} className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'><svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.5 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 12H16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
                Create New Subject
              </Link>
            )}
            {(decodedToken && decodedToken.role === "GURU" || decodedToken.role === "MURID") && (
            <Link href={`/absensi/${kelasInfo.idKelas}`} className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'>
              <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg"> 
              <path d="M7.7 10.1C7.47333 10.1 7.28347 10.0232 7.1304 9.8696C6.9768 9.71653 6.9 9.52667 6.9 9.3C6.9 9.07333 6.9768 8.8832 7.1304 8.7296C7.28347 8.57653 7.47333 8.5 7.7 8.5C7.92667 8.5 8.1168 8.57653 8.2704 8.7296C8.42347 8.8832 8.5 9.07333 8.5 9.3C8.5 9.52667 8.42347 9.71653 8.2704 9.8696C8.1168 10.0232 7.92667 10.1 7.7 10.1ZM4.5 10.1C4.27333 10.1 4.0832 10.0232 3.9296 9.8696C3.77653 9.71653 3.7 9.52667 3.7 9.3C3.7 9.07333 3.77653 8.8832 3.9296 8.7296C4.0832 8.57653 4.27333 8.5 4.5 8.5C4.72667 8.5 4.9168 8.57653 5.0704 8.7296C5.22347 8.8832 5.3 9.07333 5.3 9.3C5.3 9.52667 5.22347 9.71653 5.0704 9.8696C4.9168 10.0232 4.72667 10.1 4.5 10.1ZM10.9 10.1C10.6733 10.1 10.4835 10.0232 10.3304 9.8696C10.1768 9.71653 10.1 9.52667 10.1 9.3C10.1 9.07333 10.1768 8.8832 10.3304 8.7296C10.4835 8.57653 10.6733 8.5 10.9 8.5C11.1267 8.5 11.3165 8.57653 11.4696 8.7296C11.6232 8.8832 11.7 9.07333 11.7 9.3C11.7 9.52667 11.6232 9.71653 11.4696 9.8696C11.3165 10.0232 11.1267 10.1 10.9 10.1ZM7.7 13.3C7.47333 13.3 7.28347 13.2232 7.1304 13.0696C6.9768 12.9165 6.9 12.7267 6.9 12.5C6.9 12.2733 6.9768 12.0835 7.1304 11.9304C7.28347 11.7768 7.47333 11.7 7.7 11.7C7.92667 11.7 8.1168 11.7768 8.2704 11.9304C8.42347 12.0835 8.5 12.2733 8.5 12.5C8.5 12.7267 8.42347 12.9165 8.2704 13.0696C8.1168 13.2232 7.92667 13.3 7.7 13.3ZM4.5 13.3C4.27333 13.3 4.0832 13.2232 3.9296 13.0696C3.77653 12.9165 3.7 12.7267 3.7 12.5C3.7 12.2733 3.77653 12.0835 3.9296 11.9304C4.0832 11.7768 4.27333 11.7 4.5 11.7C4.72667 11.7 4.9168 11.7768 5.0704 11.9304C5.22347 12.0835 5.3 12.2733 5.3 12.5C5.3 12.7267 5.22347 12.9165 5.0704 13.0696C4.9168 13.2232 4.72667 13.3 4.5 13.3ZM10.9 13.3C10.6733 13.3 10.4835 13.2232 10.3304 13.0696C10.1768 12.9165 10.1 12.7267 10.1 12.5C10.1 12.2733 10.1768 12.0835 10.3304 11.9304C10.4835 11.7768 10.6733 11.7 10.9 11.7C11.1267 11.7 11.3165 11.7768 11.4696 11.9304C11.6232 12.0835 11.7 12.2733 11.7 12.5C11.7 12.7267 11.6232 12.9165 11.4696 13.0696C11.3165 13.2232 11.1267 13.3 10.9 13.3ZM2.1 16.5C1.66 16.5 1.2832 16.3435 0.9696 16.0304C0.656533 15.7168 0.5 15.34 0.5 14.9V3.7C0.5 3.26 0.656533 2.88347 0.9696 2.5704C1.2832 2.2568 1.66 2.1 2.1 2.1H2.9V0.5H4.5V2.1H10.9V0.5H12.5V2.1H13.3C13.74 2.1 14.1168 2.2568 14.4304 2.5704C14.7435 2.88347 14.9 3.26 14.9 3.7V14.9C14.9 15.34 14.7435 15.7168 14.4304 16.0304C14.1168 16.3435 13.74 16.5 13.3 16.5H2.1ZM2.1 14.9H13.3V6.9H2.1V14.9Z" fill="white"/>
              </svg>
              View Attendance
            </Link>
          )}
            <Sidebar />
          </div>
        </div>

        {showDeleteConfirmation && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
              <p className="text-red-600 font-semibold mb-4 flex items-center">
                <AiOutlineWarning className="mr-2" />
                Confirm delete class?
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
              <p className="text-green-600 font-semibold mb-4">Subject successfully deleted!</p>
              <button onClick={handleSuccessDeletePopup} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
            </div>
          </div>
        )}

        {isErrorDelete && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
              <p className="text-green-600 font-semibold mb-4">Server error. Please try again.</p>
              <button onClick={handleErrorDeletePopUp} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
            </div>
          </div>
        )}


        <Footer />
      </div>
    </FadeIn>
  );
};

export default ViewAllKelas;
