"use client";

import React, { useState, useEffect } from 'react';
import { getBeritaById } from '../../api/berita';
import BeritaImage from '@/app/beritaimage/page';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import DOMPurify from 'dompurify';
import { useRouter } from 'next/navigation';

const BeritaDetail = ({ params }) => {
  const router = useRouter()
  const { idBerita } = params;
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(error);
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {berita && ( 
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  {berita.imageBerita ? (
                    <BeritaImage idBerita={berita.idBerita} className="w-full h-48 object-cover" />
                  ) : (
                    <img src="https://via.placeholder.com/600x400" alt="Placeholder" className="w-full h-48 object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{berita.judulBerita}</h2>
                  <div dangerouslySetInnerHTML={{ __html: berita.isiBerita }} />
                  <div className="flex flex-wrap">
                    <span className="font-semibold mr-2 mb-2">Tags:</span>
                    {berita.kategori.map((kategori, index) => (
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

export default BeritaDetail;
