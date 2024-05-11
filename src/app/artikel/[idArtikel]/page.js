"use client"

import React, { useState, useEffect } from 'react';
import { getArticleById, deleteArticleById } from '../../api/artikel';
import ArticleImage from '@/app/artikelimage/page';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import DOMPurify from 'dompurify';
import { parseJwt } from '@/app/utils/jwtUtils';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';

const ArtikelDetail = ({ params }) => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState('');
  const { idArtikel } = params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setDecodedToken(parseJwt(token));
    }
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleData = await getArticleById(idArtikel);
        const cleanedArtikel = {
          ...articleData.data,
          isiArtikel: DOMPurify.sanitize(articleData.data.isiArtikel)
        }
        setArticle(cleanedArtikel);
        setLoading(false);
      } catch (error) {
        router.push(`/error/505`);
      }
    };

    fetchArticle();
  }, [idArtikel]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://myjisc-artikel-29c0ad65b512.herokuapp.com/api/artikel/delete/${idArtikel}`).then(() => {
        setIsSuccessDelete(true)
      })
    } catch (error) {
      router.push(`/error/505`);
    }
  };

  const handleBack = () => {
    router.push('/artikel');
  };

  const handleSuccessDeletePopup = () => {
    setIsSuccessDelete(false);
    window.location.href = '/artikel';
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
    return <SpinLoading />;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg" style={{ marginBottom: '100px' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {article && (
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
                      <span className="text-sm text-gray-500">Tanggal Pembuatan: {formatDate(article.dateCreated)}</span>
                    </div>
                  </div>
                  {article.imageArtikel ? (
                    <ArticleImage idArtikel={article.idArtikel} className="w-full h-48 object-cover" />
                  ) : (
                    <img src="https://via.placeholder.com/600x400" alt="Placeholder" className="w-full h-48 object-cover" style={{ filter: 'brightness(0) invert(1)' }} />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{article.judulArtikel}</h2>
                  <div dangerouslySetInnerHTML={{ __html: article.isiArtikel }} />
                  {!article.kategori && (
                    <div className="flex flex-wrap mb-4">
                      <span className="font-semibold mr-2 mb-2">Tags:</span>
                    </div>
                  )}
                  {article.kategori && article.kategori.length > 0 && (
                    <div className="flex flex-wrap mb-4">
                      <span className="font-semibold mr-2 mb-2">Tags:</span>
                      {article.kategori.map((kategori, index) => (
                        <span key={index} className="bg-[#6C80FF] text-white rounded-full px-2 py-1 mr-2 mb-2 text-sm">{kategori}</span>
                      ))}
                      <div className="flex justify-end w-full mt-2">
                        {decodedToken.role === 'ADMIN' ? (
                          <>
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
                  )}
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
            <p className="text-red-600 font-semibold mb-4">Apakah Anda yakin ingin menghapus artikel?</p>
            <div className="flex">
              <button onClick={confirmDelete} className="bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600 transition duration-300">
                Hapus
              </button>
              <button onClick={handleCloseDeleteConfirmation} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 flex items-center justify-center mx-auto">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
            <p className="text-green-600 font-semibold mb-4">Artikel berhasil dihapus!</p>
            <button onClick={handleSuccessDeletePopup} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ArtikelDetail;
