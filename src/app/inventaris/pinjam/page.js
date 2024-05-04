"use client";


import { useState } from 'react';
import Sidebar from '../../components/sidebar';

const BorrowForm = () => {
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerClass, setBorrowerClass] = useState('');
  const [items, setItems] = useState([{ itemName: '', quantity: 1 }]);
  const [purpose, setPurpose] = useState('');
  const [borrowDate, setBorrowDate] = useState('');

  const handleBorrowerNameChange = (event) => {
    setBorrowerName(event.target.value);
  };

  const handleBorrowerClassChange = (event) => {
    setBorrowerClass(event.target.value);
  };

  const handleAddItem = () => {
    setItems([...items, { itemName: '', quantity: 1 }]);
  };

  const handleItemNameChange = (index, event) => {
    const newItems = [...items];
    newItems[index].itemName = event.target.value;
    setItems(newItems);
  };

  const handleItemQuantityChange = (index, quantity) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  const handlePurposeChange = (event) => {
    setPurpose(event.target.value);
  };

  const handleBorrowDateChange = (event) => {
    setBorrowDate(event.target.value);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({
      borrowerName,
      borrowerClass,
      items,
      purpose,
      borrowDate
    });
  };

  return (

  <div className="border-b border-gray-200 dark:border-gray-850">
    <div className="border-b border-gray-200 dark:border-gray-850">
  <div className="px-4 py-6 md:px-6 lg:px-8">
    <div className="flex items-center justify-between">
      <a className="flex gap-4 items-center font-nunito-sans" href="#">
        <span className="font-semibold text-base sm:text-xl">MyJISc</span>
      </a>
      <nav className="hidden md:flex gap-4 text-sm font-nunito-sans">
        <a className="font-medium text-gray-900 dark:text-gray-100" href="#">
          Beranda
        </a>
        <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
          Akademik
        </a>
        <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
          Peminjaman Fasilitas
        </a>
        <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
          Nilai
        </a>
        <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
          Tentang Kami
        </a>
      </nav>
      <div className="flex items-center gap-4 md:gap-6">
        {/* <button type="button" className="text-sm font-medium font-nunito-sans">
          Logout
        </button> */}
      </div>
    </div>
  </div>
  <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between">
    <div className="max-w-md w-full md:w-auto mb-8 md:mb-0 md:mr-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Peminjaman Fasilitas</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="borrowerName" className="block text-sm font-medium text-gray-700">Nama Peminjaman:</label>
          <input
            type="text"
            id="borrowerName"
            value={borrowerName}
            onChange={handleBorrowerNameChange}
            className="mt-1 block w-full border-purple-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="borrowerClass" className="block text-sm font-medium text-gray-700">Kelas Dipinjam:</label>
          <select
            id="borrowerClass"
            value={borrowerClass}
            onChange={handleBorrowerClassChange}
            className="mt-1 block w-full border-purple-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Pilih Kelas --</option>
            <option value="A">Kelas A</option>
            <option value="B">Kelas B</option>
            <option value="C">Kelas C</option>
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
        <label htmlFor="purpose" style={{ display: 'block', marginBottom: '5px', marginTop: '20px' }}>Keperluan Peminjaman:</label>
        <input
          type="text"
          id="purpose"
          value={purpose}
          onChange={handlePurposeChange}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div>
      <div>
      <h2 style={{ marginBottom: '20px' }}>List Barang Dipinjam:</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Nama Barang</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Kuantitas</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <select
                      value={item.itemName}
                      onChange={(e) => handleItemNameChange(index, e)}
                      style={{ width: '100%', padding: '5px', fontSize: '14px' }}
                    >
                      <option value="">-- Pilih Barang --</option>
                      {/* Add options for available items */}
                    </select>
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemQuantityChange(index, parseInt(e.target.value))
                      }
                      style={{ width: '60px', padding: '5px', fontSize: '14px' }}
                    />
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm8.707 3.707a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 111.414-1.414L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">
                  <button
                    onClick={handleAddItem}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Tambah Barang
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
      </div>

      {/* <div style={{ marginBottom: '20px' }}>
        <label htmlFor="purpose" style={{ display: 'block', marginBottom: '5px', marginTop: '20px' }}>Keperluan Peminjaman:</label>
        <input
          type="text"
          id="purpose"
          value={purpose}
          onChange={handlePurposeChange}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div> */}
      {/* <div style={{ marginBottom: '20px' }}>
        <label htmlFor="borrowDate" style={{ display: 'block', marginBottom: '5px' }}>Tanggal Peminjaman:</label>
        <input
          type="date"
          id="borrowDate"
          value={borrowDate}
          onChange={handleBorrowDateChange}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div> */}
        <div className="mb-4">
          <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Submit
          </button>
        </div>
      </form>
    </div>
    <Sidebar className="md:ml-4" />
  </div>
</div>
<footer className="bg-gray-900 text-white text-center py-6 w-full">
  <p>&copy; 2024 Jakarta Islamic School. All rights reserved.</p>
</footer>

  </div>
  );
};

export default BorrowForm;
