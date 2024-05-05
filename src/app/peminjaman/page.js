"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPeminjaman } from '../api/peminjaman';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import { parseJwt } from '../utils/jwtUtils';
import { getUsersById } from '@/app/api/user';
import { getInventoryById } from '../api/peminjaman';

const PeminjamanList = () => {
  const [decodedToken, setDecodedToken] = useState('');
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setDecodedToken(parseJwt(token));
    }
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const peminjamanData = await getAllPeminjaman();

        const usersPromises = peminjamanData.map(p => getUsersById(p.idPeminjam));
        const users = await Promise.all(usersPromises);

        let peminjamanWithUser = peminjamanData.map((p, index) => ({
          ...p,
          nama: users[index].firstname + " " + users[index].lastname
        }));

        console.log("pem", peminjamanWithUser)

        const inventoryPromises = peminjamanWithUser.map(p =>
          Promise.all(p.listIdItem.map(itemId => getInventoryById(itemId)))
        );
        const inventories = await Promise.all(inventoryPromises);

        console.log(inventories)

        const finalData = peminjamanWithUser.map((p, index) => ({
          ...p,
          listItems: inventories[index].map(inventory => inventory.namaItem)
        }));

        console.log(finalData)
        setPeminjaman(finalData);
        setLoading(false);
      } catch (error) {
        console.log(error)
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
            {error && <div>Error: {error.message}</div>}

            {loading && <div>Loading...</div>}
            {!loading && !error && peminjaman.length > 0 && (
              <div className="flex flex-col gap-4 w-full">
                {peminjaman.map(p => (
                  <div key={p.idPeminjaman} className="relative flex flex-col gap-2 p-4 border-[1px] border-[#6C80FF] w-full rounded-xl">
                    <strong className='text-lg'>Peminjaman {p.nama}</strong>
                    <p>Tanggal Pengembalian: {new Date(p.returnDate).toLocaleDateString()}</p>
                    <p>Keperluan Peminjaman: {p.keperluanPeminjaman}</p>
                    <p>Barang yang Dipinjam: {p.listItems.join(", ")}</p>
                    <strong className='text-[#6C80FF] absolute bottom-4 right-8'>{p.statusPeminjaman}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-4'>
            <Link href="/peminjaman/create" className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'><svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12.5 8V16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.5 12H16.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
              Buat Peminjaman
            </Link>
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PeminjamanList;