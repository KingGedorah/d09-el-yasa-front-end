"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/navbar';
import Link from 'next/link';
import Footer from '@/app/components/footer';
import * as InventoryApi from '../../api/inventaris';
import { redirect } from 'next/navigation';
import InventoryImage from '../../inventarisimage/page';
import { parseJwt } from '@/app/utils/jwtUtils';
import axios from 'axios';

const ViewAllInventory = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [role, setRole] = useState('');
  const [decodedToken, setDecodedToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false); // State untuk menandai penghapusan berhasil
  const itemsPerPage = 6;
  const baseUrlInventaris = process.env.NEXT_PUBLIC_BASE_INVENTARIS_API

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const decoded = parseJwt(token);
      setDecodedToken(decoded);
      setId(decoded.id);
      setRole(decoded.role);
    } else {
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
  }, [deleteSuccess]); // Menggunakan deleteSuccess sebagai dependensi agar dijalankan kembali setelah penghapusan berhasil

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteConfirmation = (itemId) => {
    setItemToDeleteId(itemId);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseUrlInventaris}/delete/${itemToDeleteId}`);
      // Set state deleteSuccess menjadi true untuk menandai penghapusan berhasil
      setDeleteSuccess(true);
    } catch (error) {
      console.error('Failed to delete item:', error);
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const filteredInventory = inventoryList.filter(item => {
    return item.namaItem.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-[#F3F5FB]">
      <Navbar role={role} id={id} />
      <div className="container mx-auto flex justify-center mt-8">
        <main className="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Inventory</h2>
          <div className="flex items-center justify-center mb-4">
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 mr-2 focus:outline-none"
              placeholder="Search items..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link href="/inventaris/create" passHref>
              <button className="bg-[#6C80FF] text-center text-white px-4 py-2 rounded-md cursor-pointer">
                Create Inventory
              </button>
            </Link>
          </div>
          {loading && <p>Loading...</p>}
          {!loading && !error && currentItems?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentItems.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-[#6C80FF] transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="p-4 flex flex-col items-center">
                    <div className="flex justify-center items-center mb-4">
                      <div className="w-32 h-32">
                        <InventoryImage idInventaris={item.idItem} className="w-full h-full object-cover object-center" />
                      </div>
                    </div>
                    <h2 className="text-base mb-2">Item name: {item.namaItem}</h2>
                    <h2 className="text-base mb-2">Quantity: {item.quantityItem}</h2>
                    <h2 className="text-base mb-4">Quantity Borrowed: {item.quantityBorrowed}</h2>
                    <div className="flex">
                      <Link href={`/inventaris/update/${item.idItem}`} passHref>
                        <button className="text-white bg-[#6C80FF] text-center px-4 py-2 rounded-md cursor-pointer mr-2">
                          Update
                        </button>
                      </Link>
                      <button className="text-white bg-red-500 text-center px-4 py-2 rounded-md cursor-pointer" onClick={() => handleDeleteConfirmation(item.idItem)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

              ))}
            </div>
          ) : filteredInventory.length === 0 && (
            <div className="text-center">
              <p className="text-lg font-semibold mt-4">Inventory Data Not Found</p>
              <p className="text-sm text-gray-600">You don't have any existing Inventory</p>
            </div>
          )}
          {filteredInventory.length > itemsPerPage && (
            <div className="flex justify-center mt-4">
              {Array(Math.ceil(filteredInventory.length / itemsPerPage)).fill().map((_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 mr-2 bg-[#6C80FF] text-white rounded-md cursor-pointer ${currentPage === index + 1 ? 'bg-[#4E5CD9]' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          {showDeleteConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg font-semibold mb-4">Are you sure you want to delete this item?</p>
                <div className="flex justify-end">
                  <button className="mr-4 px-4 py-2 bg-red-500 text-white rounded-md" onClick={handleDelete}>Delete</button>
                  <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Tampilkan popup pesan sukses jika deleteSuccess bernilai true */}
          {deleteSuccess && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg font-semibold mb-4">Item has been successfully deleted.</p>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => window.location.reload()}>OK</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ViewAllInventory;
