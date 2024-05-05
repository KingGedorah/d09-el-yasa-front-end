"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Footer from '../../components/footer';
import Navbar from '../../components/navbar';

const CreateInventoryForm = () => {
  const [namaItem, setNamaItem] = useState('');
  const [quantityItem, setQuantityItem] = useState(0);
  const [quantityBorrowed, setQuantityBorrowed] = useState(0);
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('namaItem', namaItem);
      formData.append('quantityItem', quantityItem);
      formData.append('quantityBorrowed', quantityBorrowed);
      formData.append('image', image);

      const response = await axios.post('https://myjisc-inventaris-146c107038ee.herokuapp.com/api/inventory/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Response:', response.data);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error:', error.response);
      setShowSuccess(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar />
      <div className="container px-4 md:px-6 flex items-center justify-center py-16 md:py-24 lg:py-32">
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito-sans">Tambahkan inventaris</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
              Masukkan informasi inventaris di sini.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="mb-4">
              <label htmlFor="nama-item" className="inline-block text-sm font-medium">Nama Item:</label>
              <input type="text" id="nama-item" value={namaItem} onChange={(e) => setNamaItem(e.target.value)} required className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity-item" className="inline-block text-sm font-medium">Quantity Item:</label>
              <input type="number" id="quantity-item" value={quantityItem} onChange={(e) => setQuantityItem(e.target.value)} required className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity-borrowed" className="inline-block text-sm font-medium">Quantity Borrowed:</label>
              <input type="number" id="quantity-borrowed" value={quantityBorrowed} onChange={(e) => setQuantityBorrowed(e.target.value)} required className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="inline-block text-sm font-medium">Gambar:</label>
              <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} required className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Tambah</button>
          </form>
        </div>

        {showSuccess && (
          <div id="modal" className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white max-w-xl w-full rounded-md">
              <div className="p-3 flex items-center justify-between border-b border-b-gray-300">
                <h3 className="font-semibold text-xl">
                  Berhasil :)
                </h3>
                <span className="modal-close cursor-pointer" onClick={() => setShowSuccess(false)}>×</span>
              </div>
              <div className="p-3 border-b border-b-gray-300">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded relative mt-4" role="alert">
                  <p className="block sm:inline">Berhasil menambahkan inventaris!</p>
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
