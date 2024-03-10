"use client";

import React, { useState, useEffect } from 'react';
import { getBeritaById } from '../../api/berita';
import BeritaImage from '@/app/beritaimage/page';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';

const BeritaDetail = ({ params }) => {
  const { idBerita } = params;
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const beritaData = await getBeritaById(idBerita);
        setBerita(beritaData.data); // Access the 'data' property from the response
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
            {berita && ( // Check if berita is not null before rendering
              <div class="bg-gray-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  {berita.imageBerita ? (
                    <BeritaImage idBerita={berita.idBerita} className="w-full h-48 object-cover" />
                  ) : (
                    <img src="https://via.placeholder.com/600x400" alt="Placeholder" className="w-full h-48 object-cover" />
                  )}
                </div>
                <div class="p-4">
                  <h2 class="text-xl font-semibold mb-2">{berita.judulBerita}</h2>
                  <p class="text-gray-700 mb-4">{berita.isiBerita}</p>
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
