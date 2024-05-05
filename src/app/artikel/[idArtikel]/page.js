"use client"

import React, { useState, useEffect } from 'react';
import { getArticleById } from '../../api/artikel';
import ArticleImage from '@/app/artikelimage/page';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';

const ArtikelDetail = ({ params }) => {
  const { idArtikel } = params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleData = await getArticleById(idArtikel);
        setArticle(articleData.data); // Access the 'data' property from the response
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, []);

  const handleLogout = () => {
    // Clear session storage or remove the token
    sessionStorage.removeItem('jwtToken');
    // Redirect to login page or home page
    window.location.href = '/user/login';
  };

  return (
    <div>
      <Navbar handleLogout={handleLogout} />
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {article && (
              <div class="bg-gray-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  {article.imageArtikel ? (
                    <ArticleImage idArtikel={article.idArtikel} className="w-full h-48 object-cover" />
                  ) : (
                    <img src="https://via.placeholder.com/600x400" alt="Placeholder" className="w-full h-48 object-cover" />
                  )}
                </div>
                <div class="p-4">
                  <h2 class="text-xl font-semibold mb-2">{article.judulArtikel}</h2>
                  <p class="text-gray-700 mb-4">{article.isiArtikel}</p>
                  {/* Menampilkan kategori artikel */}
                  <div className="flex flex-wrap">
                    <span className="font-semibold mr-2 mb-2">Tags:</span>
                    {article.kategori.map((kategori, index) => (
                      <span key={index} className="bg-blue-500 text-white rounded-full px-2 py-1 mr-2 mb-2 text-sm">{kategori}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArtikelDetail;