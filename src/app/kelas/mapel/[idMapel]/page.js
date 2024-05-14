"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import Sidebar from '@/app/components/sidebar';
import * as KelasApi from '../../../api/kelas';
import axios from 'axios';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';
import { AiOutlineWarning } from 'react-icons/ai';
import { parseJwt } from '@/app/utils/jwtUtils';
import Navbarmurid from '@/app/components/navbarmurid';
import Navbarguru from '@/app/components/navbarguru';
import Link from 'next/link';
import FadeIn from '@/app/components/fadein-div';

const DetailMapel = ({ params }) => {
  const router = useRouter();
  const [materiId, setMateriId] = useState(null);
  const [id, setId] = useState('');
  const [decodedToken, setDecodedToken] = useState('');
  const { idMapel } = params;
  const [query, setQuery] = useState("");
  const [materiInfo, setMateriInfo] = useState([]);
  const [mapelInfo, setMapelInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isErrorDelete, setIsErrorDelete] = useState(false);
  const [activeTab, setActiveTab] = useState('materi');

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
        const mapelData = await KelasApi.getMapelByIdMapel(idMapel);
        if (mapelData.data.listKontenMapel == null) {
          setMateriInfo([])
        } else {
          const materiPromises = mapelData.data.listKontenMapel.map(async (idMateri) => {
            const materiData = await KelasApi.getMateriByIdMateri(idMateri);
            return materiData.data;
          })
          const materiData = await Promise.all(materiPromises);
          setMateriInfo(materiData);
          setMapelInfo(mapelData.data);
        }
        setLoading(false);
      } catch (error) {
        router.push(`/error/500`);
      }
    };

    fetchMapelInfo();
  }, [idMapel]);

  // Fungsi untuk menghapus materi
  const handleDeleteMateri = async (materiId) => {
    try {
      await axios.delete(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/delete/materi/${materiId}`);
    } catch (error) {
      setIsErrorDelete(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await handleDeleteMateri(materiId);
      setShowDeleteConfirmation(false);
      setIsSuccessDelete(true);
    } catch (error) {
      setIsErrorDelete(true);
    }
  }

  const handleSuccessDeletePopup = () => {
    setIsSuccessDelete(false);
    window.location.reload();
  };

  const showConfirmationPopup = (idMateri) => {
    setShowDeleteConfirmation(true);
    setMateriId(idMateri);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleErrorDeletePopUp = () => {
    setIsErrorDelete(false);
  };

  const handleChangeSearchBar = (e) => {
    setQuery(e.target.value);
  };


  if (loading) {
    return <SpinLoading />;
  }

  return (
    <FadeIn>
      {decodedToken && decodedToken.role === 'MURID' && <Navbarmurid role={id} />}
      {decodedToken && decodedToken.role === 'GURU' && <Navbarguru role={id} />}
      <div className="container mx-auto flex justify-center mt-8">
        <main className="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <div className="tabs mb-4 flex" style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`tab${activeTab === 'materi' ? ' active' : ''}`}
              onClick={() => setActiveTab('materi')}
              style={{
                padding: '10px 20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: activeTab === 'materi' ? '#007bff' : '#fff',
                color: activeTab === 'materi' ? '#fff' : '#000',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Materi
            </button>
            <button
              className={`tab${activeTab === 'nilai' ? ' active' : ''}`}
              onClick={() => setActiveTab('nilai')}
              style={{
                padding: '10px 20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: activeTab === 'nilai' ? '#007bff' : '#fff',
                color: activeTab === 'nilai' ? '#fff' : '#000',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Nilai
            </button>
          </div>

          {activeTab === 'materi' && (
            <Suspense fallback={<div>Loading...</div>}>
              <div>
                <div className='relative'>
                  <input onChange={handleChangeSearchBar} type='text' className="border border-[#6C80FF] mb-4 rounded-xl py-3 bg-transparent px-4 w-full focus:outline-none focus:border-blue-500" />
                  <div className='absolute top-[14px] right-4'>
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 0C13.968 0 18 4.032 18 9C18 13.968 13.968 18 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0ZM9 16C12.867 16 16 12.867 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16ZM17.485 16.071L20.314 18.899L18.899 20.314L16.071 17.485L17.485 16.071Z" fill="#6C80FF" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold">Materi</h2>
                {loading && <p>Loading...</p>}
                {!loading && !error && materiInfo.length > 0 ? (
                  materiInfo
                    .filter((materi) =>
                      materi.judulKonten.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((materi, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-4 flex justify-between items-center">
                        <div className="p-4">
                          <h2 className="text-xl font-bold">{materi.judulKonten}</h2>
                          <h2 className="text-base">{materi.isiKonten}</h2>
                          {materi.nama_file && (
                            <h2 className="text-base">
                              <svg className="h-6 w-6 text-blue-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                <line x1="12" y1="11" x2="12" y2="17" />
                                <polyline points="9 14 12 17 15 14" />
                              </svg>{' '}
                              <a className="font-bold text-green-800" href={`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/get/materi/${materi.idKonten}`} target="_blank" rel="noopener noreferrer">
                                {materi.nama_file}
                              </a>
                            </h2>
                          )}
                          <h2 className="text-base">{materi.materiPelajaran}</h2>
                        </div>
                        {/* Tombol Delete */}
                        <div className="p-4">
                        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => showConfirmationPopup(materi.idKonten)}>Delete</button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex justify-center items-center h-40 bg-white rounded-lg">
                    <svg className="h-16 w-16 text-gray-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-gray-400 opacity-50 ml-4">Tidak ada materi yang ditemukan</p>
                  </div>
                )}
              </div>
            </Suspense>
          )}
          {activeTab === 'nilai' && (
            <div>
              <h2 className="text-2xl font-bold">Nilai</h2>
              <div className="flex justify-center items-center h-64">Placeholder untuk nilai</div>
            </div>
          )}
        </main>
        <div className='flex flex-col gap-4'>
          {decodedToken.role === "GURU" && (
            <Link href={`/kelas/mapel/${idMapel}/create-materi`} className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'
              onMouseEnter={(event) => event.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(event) => event.target.style.transform = 'scale(1)'}
            >
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.5 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 12H16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Post Materi
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
              Apakah Anda yakin ingin menghapus materi ini?
            </p>
            <p className="text-red-600 font-semibold mb-4">Materi yang ada tidak dapat dipulihkan kembali!</p>
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
            <p className="text-green-600 font-semibold mb-4">Materi berhasil dihapus!</p>
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
    </FadeIn>
  );
};

export default DetailMapel;
