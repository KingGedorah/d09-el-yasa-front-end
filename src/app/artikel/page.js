"use client";

import React, { useState, useEffect } from 'react';
import { getAllArticles } from '../api/artikel';
import ArticleImage from '../artikelimage/page'; // Import the modified ArticleImage component
import '../styles/tailwind.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';

const Page = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articlesData = await getAllArticles();
        setArticles(articlesData.artikel);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {!loading && !error && articles.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {articles.map(article => (
                  <div key={article.idArtikel} className="p-4">
                    {/* Check if article has image */}
                    {article.imageArtikel ? (
                      <ArticleImage idArtikel={article.idArtikel} className="w-full h-48 object-cover" />
                    ) : (
                      <img src="https://via.placeholder.com/600x400" alt="Placeholder" className="w-full h-48 object-cover" />
                    )}
                    <h2 className="text-xl font-semibold mb-2 mt-4">{article.judulArtikel}</h2>
                    <p className="text-gray-700">{article.isiArtikel.slice(0, 150)}...</p>
                    <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">Baca Selengkapnya</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Sidebar/>
        </div>
      </div>
      <Footer /> 
    </div>
  );
};

export default Page;