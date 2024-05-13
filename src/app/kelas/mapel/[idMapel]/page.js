"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import Sidebar from '@/app/components/sidebar';
import * as KelasApi from '../../../api/kelas';
import axios from 'axios';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';

const DetailMapel = ({ params }) => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState('');
  const { idMapel } = params;
  const [materiInfo, setMateriInfo] = useState([]);
  const [mapelInfo, setMapelInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      //Authorized
    }
  }, [decodedToken]);

  useEffect(() => {
    const fetchMapelInfo = async () => {
      try {
        const mapelData = await KelasApi.getMapelByIdMapel(idMapel);
        const materiPromises = mapelData.data.listKontenMapel.map(async (idMateri) => {
          const materiData = await KelasApi.getMateriByIdMateri(idMateri);
          return materiData.data;
        })
        const materiData = await Promise.all(materiPromises);
        setMateriInfo(materiData);
        setMapelInfo(mapelData.data);
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
      // Setelah penghapusan berhasil, refresh halaman
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

  if (loading) {
    return <SpinLoading/>;
  }

  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar />
      <div className="container mx-auto flex justify-center mt-8">
        <main className="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <div className="search-container">
            <h2 className="text-3xl font-bold mb-4">Selamat datang di mata pelajaran {mapelInfo.namaMapel}!</h2>
            <a href={`/kelas/mapel/${idMapel}/create-materi`}><button type="button">Tambahkan materi baru...</button></a>
          </div>
          <h2 className="text-2xl font-bold">Materi</h2>
          {loading && <p>Loading...</p>}
          {!loading && !error && materiInfo.length > 0 ? (
            materiInfo.map((materi, index) => (
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
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteMateri(materi.idKonten)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>Tidak ada materi yang tersedia untuk mapel ini.</p>
          )}
        </main>
        <Sidebar />
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
    </div>
  );
};

export default DetailMapel;
