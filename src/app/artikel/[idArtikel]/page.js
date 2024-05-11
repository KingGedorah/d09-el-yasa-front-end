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

const ArtikelDetail = ({ params }) => {
  const [decodedToken, setDecodedToken] = useState('');
  const { idArtikel } = params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);

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
        setError(error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [idArtikel]);

  const handleSuccessDeletePopup = () => {
    setIsSuccessDelete(false);
    window.location.href = '/artikel';
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://myjisc-artikel-29c0ad65b512.herokuapp.com/api/artikel/delete/${idArtikel}`).then(() => {
        setIsSuccessDelete(true)
      })
      // Redirect to a different page or show a success message
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mt-8 p-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {article && (
              <div className="border-[1px] border-[#8D6B94] rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold mt-4 text-center">{article.judulArtikel}</h2>
                <div className="p-4 w-full flex justify-center">
                  {article.imageArtikel && <ArticleImage idArtikel={article.idArtikel} className="w-full h-48 object-cover" />}
                  {!article.imageArtikel && <div className="w-full h-48 bg-gray-200"></div>}
                </div>
                <div className="p-4">
                  <div dangerouslySetInnerHTML={{ __html: article.isiArtikel }} />
                  {/* Menampilkan kategori artikel */}
                  <div className="flex flex-wrap">
                    <span className="font-semibold mr-2 mb-2">Tags:</span>
                    {article.kategori?.map((kategori, index) => (
                      <span key={index} className="bg-[#6C80FF] text-white rounded-full px-2 py-1 mr-2 mb-2 text-sm">{kategori}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex justify-end">
                  {(
                    <div className="p-4 flex justify-end">
                      {/* {decodedToken.role === 'Admin' && ( */}
                      <button className="bg-red-500 text-white rounded px-4 py-2" onClick={handleDelete}>Delete</button>
                      {/* )} */}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </div>

      {isSuccessDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
            <p className="text-green-600 font-semibold mb-4">Artikel berhasil dihapus!</p>
            <button onClick={handleSuccessDeletePopup} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Tutup</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ArtikelDetail;
