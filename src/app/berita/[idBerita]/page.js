"use client";

import React, { useState, useEffect } from 'react';
import { getBeritaById } from '../../api/berita';
import BeritaImage from '@/app/beritaimage/page';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import DOMPurify from 'dompurify';
import { useRouter } from 'next/navigation';
import { parseJwt } from '@/app/utils/jwtUtils';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { redirect } from 'next/navigation';
import SpinLoading from '@/app/components/spinloading';
import Navbarguru from '@/app/components/navbarguru';

const BeritaDetail = ({ params }) => {
  const router = useRouter();
  const [role, setRole] = useState('')
  const [id, setId] = useState('');
  const [decodedToken, setDecodedToken] = useState('');
  const { idBerita } = params;
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const decoded = parseJwt(token);
      setDecodedToken(decoded);
      setId(decoded.id);
      setRole(decoded.role)
      console.log(decoded.id + decoded.role)
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
    const fetchBerita = async () => {
      try {
        const beritaData = await getBeritaById(idBerita);
        const cleanedBerita = {
          ...beritaData.data,
          isiBerita: DOMPurify.sanitize(beritaData.data.isiBerita)
        };
        setBerita(cleanedBerita);
        setLoading(false);
      } catch (error) {
        router.push(`/error/500`);
      }
    };

    fetchBerita();
  }, []);

  const handleBack = () => {
    router.push('/berita');
  };

  const handleUpdate = () => {
    router.push(`/berita/update/${idBerita}`);
  };

  const handleDelete = async () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://myjisc-berita-e694a34d5b58.herokuapp.com/api/berita/delete/${idBerita}`);
      setIsSuccessDelete(true);
      setShowDeleteConfirmation(false);
    } catch (error) {
      router.push(`/error/500`);
    }
  };

  const handleSuccessDeletePopup = () => {
    setIsSuccessDelete(false);
    window.location.href = '/berita';
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', options);
  }

  if (loading) {
    return <SpinLoading/>;
  }

  return (
    <div>
      <Navbar role={role} id={id} />
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg" style={{ marginBottom: '100px' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {berita && (
              <div className="bg-white-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={handleBack}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center transition-all duration-300 ease-in-out"
                      style={{ transform: 'scale(1)', transition: 'transform 0.2s' }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      <FaArrowLeft className="mr-2" />
                      Back
                    </button>
                    <div>
                      <span className="text-sm text-gray-500">Tanggal Pembuatan: {formatDate(berita.dateCreated)}</span>
                    </div>
                  </div>
                  {berita.imageBerita ? (
                    <BeritaImage idBerita={berita.idBerita} className="w-full h-48 object-cover" />
                  ) : (
                    <img src="https://via.placeholder.com/600x400" alt="Placeholder" className="w-full h-48 object-cover" style={{ filter: 'brightness(0) invert(1)' }} />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{berita.judulBerita}</h2>
                  <div dangerouslySetInnerHTML={{ __html: berita.isiBerita }} />
                  <div className="flex flex-wrap mb-4">
                    <span className="font-semibold mr-2 mb-2">Tags:</span>
                    {berita.kategori.map((kategori, index) => (
                      <span key={index} className="bg-[#6C80FF] text-white rounded-full px-2 py-1 mr-2 mb-2 text-sm">{kategori}</span>
                    ))}
                    <div className="flex justify-end w-full mt-2">
                      {decodedToken.role === 'GURU' || decodedToken.role === 'STAFF' ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 transition-all duration-300 ease-in-out"
                            style={{ transform: 'scale(1)', transition: 'transform 0.2s' }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          >
                            Update
                          </button>
                          <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out"
                            style={{ transform: 'scale(1)', transition: 'transform 0.2s' }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          >
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
            <p className="text-red-600 font-semibold mb-4">Apakah Anda yakin ingin menghapus berita?</p>
            <div className="flex">
              <button onClick={confirmDelete} className="bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600 transition duration-300">
                Hapus
              </button>
              <button onClick={handleCloseDeleteConfirmation} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
            <p className="text-green-600 font-semibold mb-4">Berita berhasil dihapus!</p>
            <button onClick={handleSuccessDeletePopup} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BeritaDetail;
