"use client"

import React, { useState, useEffect } from 'react';
import { getArticleById } from '../../api/artikel';
import ArticleImage from '@/app/artikelimage/page';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import DOMPurify from 'dompurify';

const ArtikelDetail = ({ params }) => {
  const { idArtikel } = params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleData = await getArticleById(idArtikel);
        const cleanedArtikel = {
          ...articleData.data,
          isiArtikel: DOMPurify.sanitize(articleData.data.isiArtikel)
        }
        setArticle(articleData.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, []);

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
                <div className="p-4 w-full">
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