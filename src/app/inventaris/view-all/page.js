"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/navbar';
import Link from 'next/link';
import Footer from '@/app/components/footer';
import Sidebar from '@/app/components/sidebar';
import * as InventoryApi from '../../api/inventaris';
import { redirect } from 'next/navigation';
import InventoryImage from '../../inventarisimage/page';
import Navbarmurid from '@/app/components/navbarmurid';
import { parseJwt } from '@/app/utils/jwtUtils';
import Navbarguru from '@/app/components/navbarguru';
import Navbaradmin from '@/app/components/navbaradmin';

const ViewAllInventory = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [decodedToken, setDecodedToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      console.log("Access granted");
      const decoded = parseJwt(token);
      setDecodedToken(decoded);
      setId(decoded.id);
    } else {
      console.log("Need to login");
      redirect('/user/login');
    }
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryData = await InventoryApi.getAllInventory();
        setInventoryList(inventoryData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      {decodedToken && decodedToken.role === 'ADMIN' && <Navbaradmin role={id} />}
      {decodedToken && decodedToken.role === 'STAFF' && <Navbar role={id} />}   
      {decodedToken && decodedToken.role === 'MURID' && <Navbarmurid role={id} />}   
      {decodedToken && decodedToken.role === 'GURU' && <Navbarguru role={id} />}    
      <div className="container mx-auto flex justify-center mt-8">
        <main className="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Daftar Inventaris</h2>
          <Link href="/inventaris/create" passHref>
            <div className="flex flex-col items-center">
              <button className="btext-white bg-[#6C80FF] text-center text-white px-4 py-2 rounded-md cursor-pointer mb-4">
                Tambah Inventaris
              </button>
            </div>
          </Link>
          {loading && <p>Loading...</p>}
          {!loading && !error && inventoryList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inventoryList.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-dotted border-gray-300 transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="p-4 flex flex-col items-center border-[1px] border-[#6C80FF]">
                    <div className="flex justify-center items-center mb-4">
                      <div className="w-32 h-32">
                        <InventoryImage idInventaris={item.idItem} className="w-full h-full object-cover"/>
                      </div>
                    </div>
                    <h2 className="text-base mb-2">Nama Item: {item.namaItem}</h2>
                    <h2 className="text-base mb-2">Quantity: {item.quantityItem}</h2>
                    <h2 className="text-base mb-4">Quantity Borrowed: {item.quantityBorrowed}</h2>
                    <Link href={`/inventaris/update/${item.idItem}`} passHref>
                      <button className="text-white bg-[#6C80FF] text-center px-4 py-2 rounded-md cursor-pointer">
                        Update
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Tidak ada inventaris yang tersedia.</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ViewAllInventory;
