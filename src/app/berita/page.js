"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllBeritas } from '../api/berita';
import BeritaImage from '../beritaimage/page';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import Image from 'next/image';

const BeritaList = () => {
  const [beritas, setBeritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const beritasData = await getAllBeritas();
        setBeritas(beritasData);
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
            {!loading && !error && beritas.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {beritas.map(berita => (
                  <div key={berita.idBerita} className="p-4">
                    {berita.imageBerita ? (
                      <BeritaImage idBerita={berita.idBerita} className="w-full h-48 object-cover" />
                      ) : (
                        <Image src="https://via.placeholder.com/600x400" width="600" height="400" objectFit="cover" alt="Placeholder" />
                      )}
                    <Link href={`/berita/${berita.idBerita}`} passHref>
                      <h2 className='text-lg text-bold mb-4 mt-4'>{berita.judulBerita}</h2>
                    </Link>
                    <p className="text-gray-700">{berita.isiBerita.slice(0, 150)}...</p>
                    <Link href={`/berita/${berita.idBerita}`} passHref>
                      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Baca Selengkapnya</button>
                    </Link>
                  </div>
                ))}
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

export default BeritaList;