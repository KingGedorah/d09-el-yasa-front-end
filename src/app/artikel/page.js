"use client";

import React, { useState, useEffect } from 'react';
import { getAllArticles } from '../api/artikel';
import ArticleImage from '../artikelimage/page'; // Import the modified ArticleImage component
import '../styles/tailwind.css';


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
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map(article => (
            <div key={article.idArtikel} className="border border-gray-300 rounded p-4">
              <h2 className="text-xl font-bold mb-2">{article.judulArtikel}</h2>
              <p className="text-gray-700">{article.isiArtikel}</p>
              {/* Check if article has image */}
              {article.imageArtikel ? (
                <ArticleImage idArtikel={article.idArtikel} />
              ) : (
                <div>
                  <p>Artikel doesn't have an image</p>
                  <p>Image not found</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;

