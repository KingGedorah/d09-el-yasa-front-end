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
import { getAllPeminjaman } from '@/app/api/peminjaman';
import { getInventoryById } from '@/app/api/peminjaman';
import { confirmPeminjaman } from '@/app/api/peminjaman';
import { declinePeminjaman } from '@/app/api/peminjaman';
import { deletePeminjaman } from '@/app/api/peminjaman';
import Navbarmurid from '@/app/components/navbarmurid';
import Navbaradmin from '@/app/components/navbaradmin';

const DetailPeminjaman = (params) => {
  const {idPeminjaman} = params.params;
  const router = useRouter()
  const [decodedToken, setDecodedToken] = useState('');

  const [idPeminjam, setIdPeminjam] = useState('');
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [keperluanPeminjaman, setKeperluanPeminjaman] = useState('');
  const [tanggalPengembalian, setTanggalPengembalian] = useState('');
  const [itemQuantities, setItemQuantities] = useState([]);

  const [inventories, setInventories] = useState([])
  const [kelas, setKelas] = useState([])

  const [isSuccessConfirm, setIsSuccessConfirm] = useState(false);
  const [isErrorConfirm, setIsErrorConfirm] = useState(false);
  const [isSuccessDecline, setIsSuccessDecline] = useState(false);
  const [isErrorDecline, setIsErrorDecline] = useState(false);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);
  const [isErrorDelete, setIsErrorDelete] = useState(false);

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
        const allPeminjaman = await getAllPeminjaman();
        let peminjamanData = allPeminjaman.find(data => data.idRequest === idPeminjaman); 
    
        if (!peminjamanData) {
          console.log("No matching peminjaman data found");
          setLoading(false);
          return; 
        }
    
        const user = await getUsersById(peminjamanData.idPeminjam);
    
        peminjamanData.nama = user.firstname + " " + user.lastname;

        const inventories = await Promise.all(peminjamanData.listIdItem.map(itemId => getInventoryById(itemId)));
    
        peminjamanData.listItems = inventories.map(inventory => inventory.namaItem);

        setPeminjaman(peminjamanData);
        setLoading(false);
      } catch (error) {
        console.log(error)
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role === 'MURID' || decodedToken.role === 'STAFF' || decodedToken.role === 'ADMIN') {
        //Authorized
      } else {
        redirect(`/inventaris/view-all`);
      }
    }
  }, [decodedToken]);

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('jwtToken');
      if (token) {
        try {
          const decodedToken = parseJwt(token);
          setDecodedToken(decodedToken);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      } else {
        console.log("Need to login");
        router.push('/user/login')
      }
    };

    fetchData();
  }, []); 


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

  const handleConfirm = async (e) => {
    e.preventDefault()
    try {
      const data = await confirmPeminjaman(idPeminjaman)
      setIsSuccessConfirm(true);
    } catch (error) {
      console.error('Error confirm peminjaman:', error);
      setIsErrorConfirm(true);
    }
  };

  const handleDecline = async (e) => {
    e.preventDefault()
    try {
      const data = await declinePeminjaman(idPeminjaman)
      setIsSuccessDecline(true);
    } catch (error) {
      console.error('Error decline peminjaman:', error);
      setIsErrorDecline(true);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      const data = await deletePeminjaman(idPeminjaman)
      setIsSuccessDelete(true);
    } catch (error) {
      console.error('Error decline peminjaman:', error);
      setIsErrorDelete(true);
    }
  };

  const handleSuccessConfirmPopup = () => {
    setIsSuccessConfirm(false);
    router.push('/peminjaman')
  };

  const handleErrorConfirmPopup = () => {
    setIsErrorConfirm(false);
  };

  const handleSuccessDeclinePopup = () => {
    setIsSuccessDecline(false);
    router.push('/peminjaman')
  };

  const handleErrorDeclinePopup = () => {
    setIsErrorDecline(false);
  };

  const handleSuccessDeletePopup = () => {
    setIsSuccessDelete(false);
    router.push('/peminjaman')
  };

  const handleErrorDeletePopup = () => {
    setIsErrorDelete(false);
  };

  return (
    <div>
      {decodedToken && decodedToken.role === 'MURID' && <Navbarmurid role={decodedToken.id} />}
      {decodedToken && decodedToken.role === 'STAFF' && <Navbar role={decodedToken.id} />}
      {decodedToken && decodedToken.role === 'ADMIN' && <Navbaradmin role={decodedToken.id} />}

      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg mb-32">
        <h1 className="text-2xl font-semibold mb-4 text-center">Request Detail</h1>
        <form>
          <div>
            <div className="mb-4">
              <label htmlFor="namaPeminjam" className="block text-gray-700 font-bold mb-2">Applicant's name</label>
              <input disabled type="text" id="namaPeminjam" value={peminjaman?.nama} onChange={(e) => setNamaPeminjam(e.target.value)} name="namaPeminjam" className="border disabled cursor-not-allowed border-[#6C80FF] rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500" required />
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
              <label htmlFor="keperluanPeminjaman" className="block text-gray-700 font-bold mb-2">Request Purpose</label>
              <input disabled type="text" id="keperluanPeminjaman" value={peminjaman?.keperluanPeminjaman} onChange={(e) => setKeperluanPeminjaman(e.target.value)} name="keperluanPeminjaman" className="border border-[#6C80FF] cursor-not-allowed rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500" required />
            </div>

            <div className="mb-4">
              <label htmlFor="tanggalPengembalian" className="block text-gray-700 font-bold mb-2">Return Date</label>
              <input disabled type="date" id="tanggalPengembalian" value={peminjaman?.returnDate?.split('T')[0]} onChange={(e) => setTanggalPengembalian(e.target.value)} name="tanggalPeminjaman" className="border border-[#6C80FF] cursor-not-allowed rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500" required />
            </div>

            <div className="mb-4">
                <label htmlFor="tanggalPengembalian" className="block text-gray-700 font-bold mb-2">Items Requested</label>
                <div className='border border-[#6C80FF] rounded-xl grid grid-cols-2'>
                    <div className='col-span-1 flex items-center py-4 justify-center'>Item Name</div>
                    <div className='col-span-1 flex items-center justify-center'>Quantity</div>
                    <hr className='col-span-2 border-[#6C80FF] py-0'/>
                    {inventories?.map((inventory, index) => (
                    <React.Fragment key={inventory.id}>
                        <div className='col-span-1 flex py-4 items-center justify-center'>{inventory.namaItem}</div>
                        <div className='flex items-center justify-center col-span-1'>
                        <input
                            type="number"
                            id={inventory.idItem}
                            min={0}
                            value={peminjaman?.listQuantityItem?.[peminjaman?.listIdItem?.indexOf(inventory.idItem) ?? -1] ?? 0}
                            onChange={(e) => handleQuantityChange(inventory.idItem, parseInt(e.target.value, 10) || 0)}
                            name="keperluanPeminjaman"
                            disabled
                            className="border cursor-not-allowed border-[#6C80FF] rounded-xl mx-auto py-2 px-4 w-24 h-10 focus:outline-none focus:border-blue-500"
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
              {
                (decodedToken?.role === "ADMIN" || decodedToken?.role === "STAFF") && (
                  <>
                    {peminjaman?.status === 'CONFIRMED' && (
                      <button type='button' onClick={handleDelete} className="bg-[#E16B6B] border-[1px] border-[#E16B6B] text-white py-2 px-4 transition duration-300 w-40 rounded-xl text-center">Complete</button>
                    )}
                    {peminjaman?.status === 'PENDING' && (
                      <button type='button' onClick={handleDecline} className="bg-white border-[1px] border-[#E16B6B] text-[#E16B6B] py-2 px-4 transition duration-300 w-40 rounded-xl text-center">Decline</button>
                    )}
                    {peminjaman?.status === 'PENDING' && (
                      <button type='button' onClick={handleConfirm} className="bg-[#6C80FF] text-white py-2 px-4 transition duration-300 w-40 rounded-xl">Approve</button>
                    )}
                  </>
                )
              }
            </div>
          </div>
        </form>
      </div>

      {isSuccessDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-green-600 font-semibold">Request succesfully completed</p>
            <button onClick={handleSuccessDeletePopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Selesaikan</button>
          </div>
        </div>
      )}
      {isErrorDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-red-600 font-semibold">Failed to complete request</p>
            <button onClick={handleErrorDeletePopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Selesaikan</button>
          </div>
        </div>
      )}
      {isSuccessConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-green-600 font-semibold">Request approved succesfully</p>
            <button onClick={handleSuccessConfirmPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Close</button>
          </div>
        </div>
      )}
      {isErrorConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-red-600 font-semibold">Failed to approve request</p>
            <button onClick={handleErrorConfirmPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Close</button>
          </div>
        </div>
      )}
      {isSuccessDecline && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-green-600 font-semibold">Request declined succesfully</p>
            <button onClick={handleSuccessDeclinePopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Close</button>
          </div>
        </div>
      )}
      {isErrorDecline && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-red-600 font-semibold">Failed to decline request</p>
            <button onClick={handleErrorDeclinePopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Close</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default DetailPeminjaman;