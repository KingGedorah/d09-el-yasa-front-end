"use client";

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

    if (idArtikel) {
      fetchArticle();
    }
  }, [idArtikel]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!article) {
    return <p>Article not found</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4">
                {article.imageArtikel ? (
                  <ArticleImage idArtikel={article.idArtikel} className="w-full h-48 object-cover" />
                  ) : (
                  <img src="https://via.placeholder.com/600x400" alt="Placeholder" className="w-full h-48 object-cover" />
                )}
                <h2>{article.judulArtikel}</h2>
                <p className="text-gray-700">{article.isiArtikel}</p>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">Baca Selengkapnya</button>
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArtikelDetail;