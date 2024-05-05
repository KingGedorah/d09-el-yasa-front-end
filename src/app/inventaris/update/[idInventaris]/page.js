"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';
import * as InventaryApi from '../../api/inventaris';
import { parseJwt } from '@/app/utils/jwtUtils';
import { redirect } from 'next/navigation';

const UpdateInventoryForm = ({ params }) => {
  const { idItem } = params;
  const [decodedToken, setDecodedToken] = useState('');
  const [namaItem, setNamaItem] = useState('');
  const [quantityItem, setQuantityItem] = useState(0);
  const [quantityBorrowed, setQuantityBorrowed] = useState(0);
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
      // Lakukan pengecekan otorisasi di sini
      // Sesuaikan dengan logika otorisasi Anda
    }
  }, [decodedToken]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await InventoryApi.getInventoryById(idItem); // Sesuaikan dengan API untuk mendapatkan data inventaris berdasarkan ID
        const { data } = response;

        setNamaItem(data.namaItem);
        setQuantityItem(data.quantityItem);
        setQuantityBorrowed(data.quantityBorrowed);
      } catch (error) {
        console.error('Error:', error.response.data);
      }
    }

    fetchData();
  }, [idItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://myjisc-inventaris-146c107038ee.herokuapp.com/api/inventory/update/${idItem}`, // Sesuaikan dengan URL API Anda
        {
          namaItem,
          quantityItem,
          quantityBorrowed,
        }
      );
      console.log('Response:', response.data);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error:', error.response.data);
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
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito-sans">Perbarui Inventaris</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
              Masukkan informasi inventaris di sini.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="mb-4">
              <label htmlFor="nama-item" className="inline-block text-sm font-medium">
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
              <label htmlFor="quantity-borrowed" className="inline-block text-sm font-medium">
                Quantity Borrowed:
              </label>
              <input
                type="number"
                id="quantity-borrowed"
                value={quantityBorrowed}
                onChange={(e) => setQuantityBorrowed(e.target.value)}
                required
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