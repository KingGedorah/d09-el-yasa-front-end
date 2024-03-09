"use client";

import React, { useState, useEffect } from 'react';
import { getAllArticles } from '../api/artikel';
import ArticleImage from '../artikelimage/page'; // Import the modified ArticleImage component

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
      <h1>Articles</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && !error && articles.length > 0 && (
        <div className="card-container">
          {articles.map(article => (
            <div key={article.idArtikel} className="card">
              <h2>{article.judulArtikel}</h2>
              <p>{article.isiArtikel}</p>
              {/* Check if article has image */}
              {article.imageArtikel ? (
                <ArticleImage idArtikel={article.idArtikel} />
              ) : (
                <div>
                  <p>Artikel doesn't have an image</p>
                  <p>Image not found</p> {/* New line */}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .card-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .card {
          width: 300px;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

export default Page;

