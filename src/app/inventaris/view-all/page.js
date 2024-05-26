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
  const [role, setRole] = useState('');
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
      setRole(decoded.role);
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
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleDelete = async (idItem) => {
    if (confirm("Hapus item?")) {
      try {
        await InventoryApi.deleteInventory(idItem);
        setInventoryList(inventoryList.filter(item => item.idItem !== idItem));
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <div className="bg-[#F3F5FB] ">
      <Navbar role={role} id={id}/>  
      <div className="container mx-auto flex justify-center mt-8">
        <main className="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Inventory</h2>
          <Link href="/inventaris/create" passHref>
            <div className="flex flex-col items-center">
              <button className=" bg-[#6C80FF] text-center text-white px-4 py-2 rounded-md cursor-pointer mb-4">
                Create Inventory
              </button>
            </div>
          </Link>
          {loading && <p>Loading...</p>}
          {!loading && !error && inventoryList?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inventoryList.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-[#6C80FF] transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="p-4 flex flex-col items-center ">
                    <div className="flex justify-center items-center mb-4">
                      <div className="w-32 h-32">
                        <InventoryImage idInventaris={item.idItem} className="w-full h-full object-cover"/>
                      </div>
                    </div>
                    <h2 className="text-base mb-2">Item name: {item.namaItem}</h2>
                    <h2 className="text-base mb-2">Quantity: {item.quantityItem}</h2>
                    <h2 className="text-base mb-4">Quantity Borrowed: {item.quantityBorrowed}</h2>
                    <Link href={`/inventaris/update/${item.idItem}`} passHref>
                      <button className="text-white bg-[#6C80FF] text-center px-4 py-2 rounded-md cursor-pointer">
                        Update
                      </button>
                      {(role === 'STAFF') && (
                      <button 
                        onClick={() => handleDelete(item.idItem)}
                        className="text-white bg-red-500 text-center px-4 py-2 rounded-md cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : inventoryList.length === 0 && (
              <div className="text-center">
                <p className="text-lg font-semibold mt-4">Inventory Data Not Found</p>
                <p className="text-sm text-gray-600">You don't have any existing Inventory</p>
              </div>
            )
          }
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ViewAllInventory;
