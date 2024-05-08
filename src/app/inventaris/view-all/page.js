"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/navbar';
import Link from 'next/link';
import Footer from '@/app/components/footer';
import Sidebar from '@/app/components/sidebar';
import * as InventoryApi from '../../api/inventaris';
import { redirect } from 'next/navigation';
import InventoryImage from '../../inventarisimage/page';

const ViewAllInventory = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      console.log("Access granted");
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
      <Navbar />
      <div className="container mx-auto flex justify-center mt-8">
        <main className="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <h2 className="text-3xl font-bold mb-4">Daftar Inventaris</h2>
          {loading && <p>Loading...</p>}
          {!loading && !error && inventoryList.length > 0 ? (
            inventoryList.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-4 flex justify-between items-center">
                <div className="p-4">
                <h2 className="text-base">ID: {item.idItem}</h2>
                <InventoryImage idInventaris={item.idItem} className="w-24 h-24 object-cover"/>

                  <h2 className="text-base">Nama Item: {item.namaItem}</h2>
                  <h2 className="text-base">Quantity: {item.quantityItem}</h2>
                  <h2 className="text-base">Quantity Borrowed: {item.quantityBorrowed}</h2>
                </div>
                <div className="p-4">
                  <Link href={`/inventaris/update/${item.idItem}`} passHref>
                    <button 
                      className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer" 
                    >
                      Update
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>Tidak ada inventaris yang tersedia.</p>
          )}
        </main>
        {/* <Sidebar /> */}
      </div>
      <Footer />
    </div>
  );
};

export default ViewAllInventory;
