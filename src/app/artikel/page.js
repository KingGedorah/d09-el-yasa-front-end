"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllArticles } from '../api/artikel';
import ArticleImage from '../artikelimage/page';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import Image from 'next/image';

const ArtikelList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articlesData = await getAllArticles();
        setArticles(articlesData);
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
      <div className="mx-auto mt-8 px-12 rounded-lg">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-2/3">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {!loading && !error && articles && articles.length > 0 && (
              <div className="flex flex-col gap-4 w-full">
                {articles.map(article => (
                  <div key={article.idArtikel} className="p-4 border-[1px] border-[#8D6B94] w-full rounded-xl">
                    <div className='flex justify-center'>

                      {article.imageArtikel ? (
                        <ArticleImage idArtikel={article.idArtikel} className="w-full h-48 object-cover" />
                      ) : (
                        <Image src="https://via.placeholder.com/600x400" width="600" height="400" objectFit="cover" alt="Placeholder" />
                      )}
                    </div>
                    <Link href={`/artikel/${article.idArtikel}`} passHref>
                      <h2 className='text-lg text-bold mb-4 mt-4'>{article.judulArtikel}</h2>
                    </Link>
                    <p className="text-gray-700">{article.isiArtikel.slice(0, 150)}...</p>
                    <Link href={`/artikel/${article.idArtikel}`} passHref>
                      <button className="mt-2 bg-white border-[1px] border-[#6C80FF] text-[#6C80FF] px-4 py-2 rounded-md cursor-pointer">Baca Selengkapnya</button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-4'>
            <Link href="/artikel/create" className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'><svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12.5 8V16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.5 12H16.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
              Post Artikel
            </Link>
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArtikelList;