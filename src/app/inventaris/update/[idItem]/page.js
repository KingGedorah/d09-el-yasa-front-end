"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Link from 'next/link';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';
// import { parseJwt } from '@/app/utils/jwtUtils';
import { redirect } from 'next/navigation';
import { parseJwt } from '@/app/utils/jwtUtils';
import * as InventoryApi from '../../../api/inventaris';

const UpdateInventoryForm = ({ params }) => {
  const { idItem } = params;
  const [decodedToken, setDecodedToken] = useState('');
  const [namaItem, setNamaItem] = useState('');
  const [quantityItem, setQuantityItem] = useState(0);
  const [imageFile, setImageFile] = useState(null); // Tambah state untuk file gambar
  const [errorPopup, setErrorPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setDecodedToken(parseJwt(token));
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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await InventoryApi.getInventoryById(idItem);
        const { data } = response;

        setNamaItem(response.namaItem);
        setQuantityItem(response.quantityItem);

        console.log(response)
      } catch (error) {
        if (error.response) {
          console.error('Error:', error.response.data);
        } else {
          console.error('Error:', error.message);
        }
      }
    }

    fetchData();
  }, [idItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('namaItem', namaItem);
      formData.append('quantityItem', quantityItem);
      
      // Tambahkan gambar baru ke FormData jika ada
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.put(
        `https://myjisc-inventaris-146c107038ee.herokuapp.com/api/inventory/update/${idItem}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Response:', response.data);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const handleCloseErrorPopup = () => {
    setErrorPopup(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccess(false);
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar />
      <div className="container px-4 md:px-6 flex items-center justify-center py-16 md:py-24 lg:py-32">
        <div className="w-full max-w-sm space-y-4">
        <Link href="/inventaris/view-all" passHref>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer">
              Kembali ke daftar inventaris
            </button>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito-sans">Perbarui Inventaris</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
              Masukkan informasi inventaris di sini.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="mb-4">
              <label htmlFor="nama-item" className="inline-block text-lg font-bold">
                Nama Item:
              </label>
              <input
                type="text"
                id="nama-item"
                value={namaItem}
                onChange={(e) => setNamaItem(e.target.value)}
                required
                className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity-item" className="inline-block text-sm font-medium">
                Quantity Item:
              </label>
              <input
                type="number"
                id="quantity-item"
                value={quantityItem}
                onChange={(e) => setQuantityItem(e.target.value)}
                required
                className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="inline-block text-sm font-medium">
                Gambar: (maks 1 MB)
              </label>
              <input
                type="file"
                id="image"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
            >
              Perbarui
            </button>
          </form>
          {errorPopup && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-md shadow-md">
                <p className="text-lg text-gray-800 mb-4">Cek kembali inputan anda</p>
                <button
                  onClick={handleCloseErrorPopup}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
          {showSuccess && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-md shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Success!</h2>
                  <span className="modal-close cursor-pointer text-gray-700" onClick={handleCloseSuccessModal}>×</span>
                </div>
                <p className="text-lg text-gray-800 mb-4">Inventaris berhasil diperbarui.</p>
                <button
                  onClick={handleCloseSuccessModal}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateInventoryForm;
