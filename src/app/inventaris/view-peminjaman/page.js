"use client";


import React from 'react';

const Page = () => {
  // Data contoh untuk card
  const data = [
    {
      id: 1,
      namaPeminjaman: "Peminjaman 1",
      tanggalPeminjaman: "1 Januari 2024",
      namaPeminjam: "John Doe"
    },
    {
      id: 2,
      namaPeminjaman: "Peminjaman 2",
      tanggalPeminjaman: "5 Februari 2024",
      namaPeminjam: "Jane Doe"
    }
  ];

  return (
<div className="border-b border-gray-200 dark:border-gray-850">
<div className="px-4 py-6 md:px-6 lg:px-8">
    <div className="flex items-center justify-between">
      <a className="flex gap-4 items-center font-nunito-sans" href="#">
        <span className="font-semibold text-base sm:text-xl">MyJISc</span>
      </a>
      <nav className="hidden md:flex gap-4 text-sm font-nunito-sans">
        <a className="font-medium text-gray-900 dark:text-gray-100" href="#">
          Beranda
        </a>
        <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
          Akademik
        </a>
        <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
          Peminjaman Fasilitas
        </a>
        <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
          Nilai
        </a>
        <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
          Tentang Kami
        </a>
      </nav>
      <div className="flex items-center gap-4 md:gap-6">
        {/* <button type="button" className="text-sm font-medium font-nunito-sans">
          Logout
        </button> */}
      </div>
    </div>
  </div>
  <div className="flex justify-center">
  <div className="flex flex-col gap-4">
    {data.map(item => (
      <div key={item.id} style={{ width: '400px', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', border: '2px solid #8B5CF6' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{item.namaPeminjaman}</h3>
          <p style={{ fontSize: '0.875rem' }}>{item.tanggalPeminjaman}</p>
          <p style={{ fontSize: '0.875rem' }}>{item.namaPeminjam}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
        <button style={{ backgroundColor: '#FFFFFF', color: '#8B5CF6', borderColor: '#8B5CF6', borderWidth: '2px', borderStyle: 'solid', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>
        Detail
        </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ backgroundColor: '#8B5CF6', color: '#FFFFFF', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>
              Setujui
            </button>
            <button style={{ backgroundColor: '#FFFFFF', color: '#EF4444', fontWeight: 'bold', padding: '0.5rem 1rem', borderColor: '#EF4444', borderWidth: '2px', borderStyle: 'solid', borderRadius: '0.375rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>
              Tolak
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>



    </div>
  );
};

export default Page;


// import { useState, useEffect } from 'react';
// import axios from 'axios'; // Jika menggunakan axios untuk fetching data

// // Fungsi untuk melakukan fetch data dari backend
// const fetchData = async () => {
//   try {
//     const response = await axios.get('url_api_backend');
//     return response.data; // Mengembalikan data dari backend
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return []; // Mengembalikan array kosong jika terjadi error
//   }
// };

// const Page = () => {
//   const [cards, setCards] = useState([]);

//   useEffect(() => {
//     const fetchCards = async () => {
//       const data = await fetchData(); // Fetch data dari backend
//       setCards(data); // Set data ke state cards
//     };

//     fetchCards();
//   }, []); // Menggunakan useEffect untuk fetch data saat komponen pertama kali dirender

//   return (
//     <div className="flex flex-wrap justify-center">
//       {cards.map((card, index) => (
//         <div key={index} className="max-w-sm mx-4 my-4 bg-white rounded-lg overflow-hidden shadow-lg">
//           <div className="px-6 py-4">
//             <div className="font-bold text-xl mb-2">{card.namaPeminjaman}</div>
//             <p className="text-gray-700 text-base mb-4">Tanggal Peminjaman: {card.tanggalPeminjaman}</p>
//             <p className="text-gray-700 text-base mb-4">Nama Peminjam: {card.namaPeminjam}</p>
//           </div>
//           <div className="px-6 py-4 flex justify-between">
//             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//               Detail
//             </button>
//             <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
//               Setujui
//             </button>
//             <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
//               Tolak
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Page;
