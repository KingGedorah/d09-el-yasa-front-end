"use client";

import React, { useState, useEffect } from 'react';
import { getAllInventory } from '@/app/api/peminjaman';
import { getUsersById } from '@/app/api/user';
import { redirect } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Link from 'next/link';
import { parseJwt } from '@/app/utils/jwtUtils';
import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/navigation';
import SpinLoading from '@/app/components/spinloading';
import Select from 'react-select'; // Import react-select
import Navbarmurid from '@/app/components/navbarmurid';

const CreatePeminjaman = () => {
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState('');
  const [idPeminjam, setIdPeminjam] = useState('');
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [keperluanPeminjaman, setKeperluanPeminjaman] = useState('');
  const [tanggalPengembalian, setTanggalPengembalian] = useState('');
  const [selectedOption, setSelectedOption] = useState(null); // Ubah selected item menjadi selectedOption
  const [itemQuantities, setItemQuantities] = useState({});
  const [inventories, setInventories] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCreateError, setIsCreateError] = useState(false);
  const [fetchedUser, setFetchedUser] = useState(false);
  const [fetchedInventory, setFetchedInventory] = useState(false);
  const [selectedItemsList, setSelectedItemsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('jwtToken');
      if (token) {
        try {
          const decodedToken = parseJwt(token);
          const user = await getUsersById(decodedToken.id);
          setIdPeminjam(decodedToken.id);
          setNamaPeminjam(user.firstname + " " + user.lastname);
          setDecodedToken(decodedToken);
          setId(decodedToken.id);
          setRole(decodedToken.role);
          setFetchedUser(true);
        } catch (error) {
          router.push(`/error/500`);
        }
      } else {
        router.push('/user/login');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role !== 'MURID') {
        router.push('/peminjaman');
      }
    }
  }, [decodedToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoriesData = await getAllInventory();
        setInventories(inventoriesData);
        setFetchedInventory(true);
      } catch (error) {
        router.push(`/error/500`);
      }
    };

    fetchData();
  }, []);

  const handleQuantityChange = (itemId, quantity) => {
    setItemQuantities(prevState => ({
      ...prevState,
      [itemId]: quantity
    }));
  };

  const handleAddOrUpdateSelectedItem = () => {
    if (selectedOption && itemQuantities[selectedOption.value]) {
      const existingItemIndex = selectedItemsList.findIndex(item => item.id === selectedOption.value);
      if (existingItemIndex !== -1) {
        const updatedSelectedItemsList = [...selectedItemsList];
        updatedSelectedItemsList[existingItemIndex].quantity += parseInt(itemQuantities[selectedOption.value]);
        setSelectedItemsList(updatedSelectedItemsList);
      } else {
        const newItem = {
          id: selectedOption.value,
          name: selectedOption.label,
          quantity: parseInt(itemQuantities[selectedOption.value])
        };
        setSelectedItemsList(prevList => [...prevList, newItem]);
      }
      setSelectedOption(null);
    }
  };

  const handleRemoveSelectedItem = (itemId) => {
    setSelectedItemsList(prevList => prevList.filter(item => item.id !== itemId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItemsList.length === 0) {
      setIsCreateError(true);
      return;
    }
    const listIdItem = selectedItemsList.map(item => item.id);
    const listQuantityItem = selectedItemsList.map(item => item.quantity);

    const formData = {
      idPeminjam,
      keperluanPeminjaman,
      returnDate: tanggalPengembalian,
      listIdItem,
      listQuantityItem
    };

    try {
      const response = await axios.post('https://myjisc-inventaris-146c107038ee.herokuapp.com/api/inventory/borrow', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setIsSuccess(true);
    } catch (error) {
      setIsCreateError(true);
    }
  };

  const handleSuccessPopup = () => {
    setIsSuccess(false);
    router.push('/peminjaman');
  };

  const handleErrorCreatePopup = () => {
    setIsCreateError(false);
  };

  if (!fetchedUser && !fetchedInventory) {
    return <SpinLoading />;
  }

  return (
    <div>
      <Navbar id={id} role={role}/>
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg mb-32">
        <h1 className="text-2xl font-semibold mb-4 text-center">Create Request</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="mb-4">
              <label htmlFor="namaPeminjam" className="block text-gray-700 font-bold mb-2">Applicant's name</label>
              <input disabled type="text" id="namaPeminjam" value={namaPeminjam} name="namaPeminjam" className="border disabled cursor-not-allowed border-[#6C80FF] rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500" required />
            </div>
            <div className="mb-4">
              <label htmlFor="keperluanPeminjaman" className="block text-gray-700 font-bold mb-2">Request Purpose</label>
              <input type="text" id="keperluanPeminjaman" value={keperluanPeminjaman} onChange={(e) => setKeperluanPeminjaman(e.target.value)} name="keperluanPeminjaman" className="border border-[#6C80FF] rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500" required />
            </div>
            <div className="mb-4">
              <label htmlFor="tanggalPengembalian" className="block text-gray-700 font-bold mb-2">Return Date</label>
              <input type="date" min={new Date().toISOString().split('T')[0]} id="tanggalPengembalian" value={tanggalPengembalian} onChange={(e) => setTanggalPengembalian(e.target.value)} name="tanggalPeminjaman" className="border border-[#6C80FF] rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500" required />
            </div>

            <div className="mb-4 flex flex-col md:flex-row items-center">
              <div className="flex-grow">
                <label htmlFor="itemsRequested" className="block text-gray-700 font-bold mb-2">Item Requested</label>
                <Select
                  id="itemsRequested"
                  value={selectedOption}
                  onChange={setSelectedOption}
                  options={inventories.map(inventory => ({ value: inventory.idItem, label: inventory.namaItem }))}
                  isSearchable={true}
                  placeholder="Select Item"
                />
              </div>

              <div className="flex-grow ml-4 mb-4 md:mb-0">
                <label htmlFor="quantity" className="block text-gray-700 font-bold mb-2">Quantity</label>
                <input
                  type="number"
                  min={0}
                  value={itemQuantities[selectedOption?.value] || ''}
                  onChange={(e) => handleQuantityChange(selectedOption?.value, e.target.value)}
                  className="border border-[#6C80FF] rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="ml-4">
                <label htmlFor="addItem" className="block text-gray-700 font-bold mb-2" style={{ opacity: 0 }}>Tambahkan item</label>
                <button type="button" onClick={handleAddOrUpdateSelectedItem} className="bg-[#6C80FF] text-white py-2 px-4 transition duration-300 rounded-xl">Add Item</button>
              </div>
            </div>

            {selectedItemsList.length > 0 && (
              <div className="max-w-md mx-auto">
                <table className="w-full mb-4 border border-gray-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="text-left py-3 px-2">Item Requested</th>
                      <th className="text-left py-3 px-2">Quantity</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-blue-50">
                    {selectedItemsList.map(item => (
                      <tr key={item.id} className="border-b border-gray-300">
                        <td className="py-2 px-2">{item.name}</td>
                        <td className="py-2 px-2">{item.quantity}</td>
                        <td className="p-2 flex items-center justify-end">
                          <button type="button" onClick={() => handleRemoveSelectedItem(item.id)} className="text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
            <p className="text-green-600 font-semibold">Request created successfully</p>
            <button onClick={handleSuccessPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}
      {isCreateError && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-red-600 font-semibold">Failed to create request</p>
            <button onClick={handleErrorCreatePopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CreatePeminjaman;
