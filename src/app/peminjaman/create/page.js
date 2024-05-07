"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getAllInventory } from '@/app/api/peminjaman';
import { getAllKelas } from '@/app/api/kelas';
import { getUsersById } from '@/app/api/user';
import { redirect } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Link from 'next/link';
import { parseJwt } from '@/app/utils/jwtUtils';
import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/navigation';

const CreateArticle = () => {
  const router = useRouter()
  const [decodedToken, setDecodedToken] = useState('');

  const [idPeminjam, setIdPeminjam] = useState('');
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [kelasDipinjam, setKelasDipinjam] = useState('');
  const [keperluanPeminjaman, setKeperluanPeminjaman] = useState('');
  const [tanggalPengembalian, setTanggalPengembalian] = useState('');
  const [itemQuantities, setItemQuantities] = useState([]);

  const [inventories, setInventories] = useState([])
  const [kelas, setKelas] = useState([])

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('jwtToken');
      if (token) {
        try {
          const decodedToken = parseJwt(token);
          const user = await getUsersById(decodedToken.id);
          console.log(user)
          setIdPeminjam(decodedToken.id);
          setNamaPeminjam(user.firstname + " " + user.lastname)
          setDecodedToken(decodedToken);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      } else {
        console.log("Need to login");
        router.push('/user/login');
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role === 'ADMIN') {
        console.log("Access granted");
      } else {
        console.log("Not authorized");
        redirect('/artikel');
      }
    }
  }, [decodedToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoriesData = await getAllInventory();
        setInventories(inventoriesData);
      } catch (error) {
        console.error('Failed to fetch data kelas:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kelasData = await getAllKelas();
        setKelas(kelasData);
      } catch (error) {
        console.error('Failed to fetch data kelas:', error);
      }
    };

    fetchData();
  }, []);

  const handleQuantityChange = (idItem, newQuantity) => {
    console.log(idItem, newQuantity)
    setItemQuantities(currentQuantities => {
      const index = currentQuantities.findIndex(item => item.idItem === idItem);
      console.log("index", index)
      const newQuantities = [...currentQuantities];
      
      if (index !== -1) {
        newQuantities[index] = { ...newQuantities[index], quantity: newQuantity };
      } else {
        newQuantities.push({ idItem, quantity: newQuantity });
      }
      return newQuantities;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const listIdItem = []
    const listQuantityItem = []

    for (const itemQuantity of itemQuantities) {
        listIdItem.push(itemQuantity["idItem"])
        listQuantityItem.push(itemQuantity["quantity"])
    }

    const formData = {
        idPeminjam,
        keperluanPeminjaman,
        returnDate: tanggalPengembalian,
        listIdItem,
        listQuantityItem
      };
  
      const jsonString = JSON.stringify(formData, null, 2);

    try {
      const response = await axios.post('https://myjisc-inventaris-146c107038ee.herokuapp.com/api/inventory/borrow', jsonString, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Error updating:', error);
      setIsError(true);
    }
  };

  const handleSuccessPopup = () => {
    setIsSuccess(false);
    router.push('/peminjaman')
  };

  const handleErrorPopup = () => {
    setIsError(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">Buat Peminjaman</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="mb-4">
              <label htmlFor="namaPeminjam" className="block text-gray-700 font-bold mb-2">Nama Peminjam</label>
              <input disabled type="text" id="namaPeminjam" value={namaPeminjam} onChange={(e) => setNamaPeminjam(e.target.value)} name="namaPeminjam" className="border disabled cursor-not-allowed border-[#6C80FF] rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500" required />
            </div>

            {/* <div className="mb-4">
            <label htmlFor="kelasDipinjam" className="block text-gray-700 font-bold mb-2">Kelas Dipinjam</label>
            <select
                id="kelasDipinjam"
                value={kelasDipinjam}
                onChange={(e) => setKelasDipinjam(e.target.value)}
                name="kelasPeminjam"
                className="border border-[#6C80FF] rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500"
                required
            >
                <option value="">Select a class</option>
                {kelas.map((item) => (
                <option key={item.idKelas} value={item.idKelas}>
                    {item.namaKelas}
                </option>
                ))}
            </select>
            </div> */}

            <div className="mb-4">
              <label htmlFor="keperluanPeminjaman" className="block text-gray-700 font-bold mb-2">Keperluan Peminjaman</label>
              <input type="text" id="keperluanPeminjaman" value={keperluanPeminjaman} onChange={(e) => setKeperluanPeminjaman(e.target.value)} name="keperluanPeminjaman" className="border border-[#6C80FF] rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500" required />
            </div>

            <div className="mb-4">
              <label htmlFor="tanggalPengembalian" className="block text-gray-700 font-bold mb-2">Tanggal Pengembalian</label>
              <input type="date" min={new Date().toISOString().split('T')[0]} id="tanggalPengembalian" value={tanggalPengembalian} onChange={(e) => setTanggalPengembalian(e.target.value)} name="tanggalPeminjaman" className="border border-[#6C80FF] rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500" required />
            </div>

            <div className="mb-4">
                <label htmlFor="tanggalPengembalian" className="block text-gray-700 font-bold mb-2">Daftar Barang Peminjaman</label>
                <div className='border border-[#6C80FF] rounded-xl grid grid-cols-2'>
                    <div className='col-span-1 flex items-center py-4 justify-center'>Nama Barang</div>
                    <div className='col-span-1 flex items-center justify-center'>Kuantitas</div>
                    <hr className='col-span-2 border-[#6C80FF] py-0'/>
                    {inventories?.map((inventory, index) => (
                    <React.Fragment key={inventory.id}>
                        <div className='col-span-1 flex py-4 items-center justify-center'>{inventory.namaItem}</div>
                        <div className='flex items-center justify-center col-span-1'>
                        <input
                            type="number"
                            id={inventory.idItem}
                            min={0}
                            value={itemQuantities.find(item => item.idItem === inventory.idItem)?.quantity || 0}
                            onChange={(e) => handleQuantityChange(inventory.idItem, parseInt(e.target.value, 10) || 0)}
                            name="keperluanPeminjaman"
                            className="border border-[#6C80FF] rounded-xl mx-auto py-2 px-4 w-24 h-10 focus:outline-none focus:border-blue-500"
                            required
                        />
                        </div>
                        {index !== inventories.length - 1 && (
                        <hr className='col-span-2 border-[#6C80FF]'/>
                        )}
                    </React.Fragment>
                    ))}
                </div>
                </div>

            <div className="flex gap-4 justify-end">
              <Link href="/peminjaman" className="bg-white border-[1px] border-[#6C80FF] text-[#6C80FF] py-2 px-4 transition duration-300 w-40 rounded-xl text-center">Cancel</Link>
              <button type="submit" className="bg-[#6C80FF] text-white py-2 px-4 transition duration-300 w-40 rounded-xl">Post</button>
            </div>
          </div>
        </form>
      </div>

      {isSuccess && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-green-600 font-semibold">Peminjaman berhasil dibuat!</p>
            <button onClick={handleSuccessPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Tutup</button>
          </div>
        </div>
      )}
      {isError && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-red-600 font-semibold">Gagal membuat peminjaman!</p>
            <button onClick={handleErrorPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Tutup</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CreateArticle;