// pages/index.js
"use client";
import Head from 'next/head';   
import Navbar from './components/navbar';
import { useState, useEffect } from 'react';
import { parseJwt } from '@/app/utils/jwtUtils';

export default function Home() {
  const [id, setId] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = parseJwt(token);
      setId(decodedToken.id);
      console.log("TES" + decodedToken.id)
    }
  }, []);
  return (
    <div>
      <Head>
        <title>Jakarta Islamic School</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
        <style>
          {`.hero-bg {
            background-image: url('https://suaramasjid.com/wp-content/uploads/2023/07/jisc-unggulan.jpg');
            background-size: cover;
            background-position: center;
          }`}
        </style>
      </Head>

      <Navbar role={id} />

      <main className="py-16 md:py-24 lg:py-32 hero-bg">
        <div className="container px-4 md:px-6 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold font-nunito-sans text-white">Selamat Datang di Jakarta Islamic School</h1>
              <p className="dark:text-gray-400 font-nunito-sans text-white">Memberikan Pendidikan Berkualitas Tinggi untuk Masa Depan yang Cerah</p>
            </div>
            <div className="space-y-2">
              <a href="#" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-block">Daftar Sekarang</a>
            </div>
          </div>
        </div>
      </main>

      {/* About */}
      <section className="bg-white dark:bg-gray-950 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Tentang Kami</h2>
          <p className="text-lg text-center">Jakarta Islamic School adalah sekolah menengah atas yang berkomitmen untuk memberikan pendidikan berkualitas tinggi yang membentuk karakter unggul bagi para generasi masa depan.</p>
        </div>
      </section>

      {/* Featured Program */}
      <section className="bg-gray-100 dark:bg-gray-900 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Program Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">STEM</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">Program pendidikan ilmu pengetahuan, teknologi, teknik, dan matematika yang menantang untuk membekali siswa dengan keterampilan inovatif dan keahlian teknis.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Bahasa dan Budaya</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">Pelajari bahasa asing dan apresiasi terhadap berbagai budaya di dunia dengan program bahasa dan budaya kami yang komprehensif.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Seni dan Kreativitas</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">Eksplorasi ekspresi diri melalui seni rupa, musik, teater, dan banyak lagi, dalam lingkungan yang mendukung dan mendorong kreativitas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white dark:bg-gray-950 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Hubungi Kami</h2>
          <p className="text-lg text-center">Alamat: Jalan Manunggal I, Komplek Kodam No.17, RT.11/RW.6, Cipinang Melayu, Kec. Makasar, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13620</p>
          <p className="text-lg text-center">Telepon: (XXX) XXX-XXXX</p>
          <p className="text-lg text-center">Email: info@jakartaislamicschool.com</p>
          <p className="text-lg text-center">Website: <a href="#" className="text-blue-500 hover:underline">www.jakartaislamicschool.com</a></p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; 2024 Jakarta Islamic School. All rights reserved.</p>
      </footer>
    </div>
  );
}
