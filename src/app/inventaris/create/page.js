"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Link from 'next/link';
import Footer from '../../components/footer';
import Navbar from '../../components/navbar';
import { parseJwt } from '@/app/utils/jwtUtils';
import { useRouter, redirect } from 'next/navigation';
import Navbaradmin from '@/app/components/navbaradmin';

const CreateInventoryForm = () => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState('');
  const [id, setId] = useState('');
  const [namaItem, setNamaItem] = useState('');
  const [quantityItem, setQuantityItem] = useState(0);
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const decoded = parseJwt(token);
      setDecodedToken(decoded);
      setId(decoded.id);
    } else {
      console.log("Need to login");
      redirect('/user/login');
    }
  }, []);
  
  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role === 'ADMIN' || decodedToken.role === 'STAFF') {
        console.log("Access granted");
      } else {
        console.log("Not authorized");
        redirect('/inventaris/view-all');
      }
    }
  }, [decodedToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('namaItem', namaItem);
      formData.append('quantityItem', quantityItem);
      formData.append('image', image);

      const response = await axios.post('https://myjisc-inventaris-146c107038ee.herokuapp.com/api/inventory/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Response:', response.data);
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/inventaris/view-all');
      }, 2000);
    } catch (error) {
      console.error('Error:', error.response);
      setShowSuccess(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    router.push('/inventaris/view-all');
  };

  return (
    <div className="bg-[#F3F5FB]">
      {decodedToken && decodedToken.role === 'ADMIN' && <Navbaradmin role={id} />}
      {decodedToken && decodedToken.role === 'STAFF' && <Navbar role={id} />}      
      <div className="container px-4 md:px-6 flex items-center justify-center py-16 md:py-24 lg:py-32">
        <div className="w-full bg-white rounded-xl max-w-sm px-8 py-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito-sans">Add Inventory</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
              Insert inventory details
            </p>
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="mb-4">
              <label htmlFor="nama-item" className="inline-block text-sm font-medium">Item Name</label>
              <input type="text" id="nama-item" value={namaItem} onChange={(e) => setNamaItem(e.target.value)} required className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity-item" className="inline-block text-sm font-medium">Item Quantity</label>
              <input type="number" id="quantity-item" value={quantityItem} onChange={(e) => setQuantityItem(e.target.value)} required className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="inline-block text-sm font-medium">Image (max 1 MB)</label>
              <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} required className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex flex-row gap-2 justify-end">
              <Link href="/inventaris/view-all" passHref>
                <button className="bg-white border border-[#6C80FF] text-[#6C80FF] px-4 py-2 rounded-md cursor-pointer">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="bg-[#6C80FF] text-white px-4 py-2 rounded-md hover:bg-indigo-600 ">
                Add Inventory
              </button>
            </div>
          </form>
        </div>

        {showSuccess && (
          <div id="modal" className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white max-w-xl w-full rounded-md">
              <div className="p-3 flex items-center justify-between border-b border-b-gray-300">
                <h3 className="font-semibold text-xl">
                  Successful
                </h3>
                <span className="modal-close cursor-pointer" onClick={handleCloseModal}>×</span>
              </div>
              <div className="p-3 border-b border-b-gray-300">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded relative mt-4" role="alert">
                  <p className="block sm:inline">Inventory created successfully</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CreateInventoryForm;
