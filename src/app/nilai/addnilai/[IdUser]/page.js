
"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/sidebar';

const InputNilaiForm = ({ params }) => {
  const { IdUser } = params;
  const [nilaiData, setNilaiData] = useState({
    tipeNilai: ["", "", "", "", "", ""], // Initialize with empty strings
    listNilai: ["", "", "", "", "", ""] // Initialize with empty strings
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "listNilai") {
      const updatedListNilai = [...nilaiData.listNilai];
      updatedListNilai[index] = value; // Directly set the value typed by the user
      setNilaiData({
        ...nilaiData,
        listNilai: updatedListNilai
      });
    } else if (name === "tipeNilai") {
      const updatedTipeNilai = [...nilaiData.tipeNilai];
      updatedTipeNilai[index] = value;
      setNilaiData({
        ...nilaiData,
        tipeNilai: updatedTipeNilai
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/score/input/${IdUser}`, nilaiData);
      // Handle success (e.g., show success message, redirect user, etc.)
      console.log('Nilai submitted successfully');
    } catch (error) {
      // Handle error (e.g., show error message to user)
      console.error('Failed to submit nilai:', error);
    }
  };

  return (
<div>
<div className="border-b border-gray-200 dark:border-gray-850">
        <div className="px-4 py-6 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a className="flex gap-4 items-center font-nunito-sans" href="#">
              <span className="font-semibold text-base sm:text-xl">MyJISc</span>
            </a>
            <nav className="hidden md:flex gap-4 text-sm font-nunito-sans">
              <a className="font-medium text-gray-900 dark:text-gray-100" href="#">
                Halaman Depan
              </a>
              <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
                Kelas
              </a>
              <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
                Materi
              </a>
            </nav>
            <div className="flex items-center gap-4 md:gap-6">
              {/* <button type="button" className="text-sm font-medium font-nunito-sans">
                Logout
              </button> */}
            </div>
          </div>
        </div>
      </div>
    
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
  <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
    
    <table style={{ width: '70%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>Tipe</th>
          <th style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>Nilai</th>
        </tr>
      </thead>
      <tbody>
        {nilaiData.tipeNilai.map((tipe, index) => (
          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
            <td style={{ padding: '12px', border: '1px solid #ddd' }}>
              <input
                type="text"
                name="tipeNilai"
                value={nilaiData.tipeNilai[index]}
                onChange={(e) => handleChange(e, index)}
                style={{ color: 'black', width: '90%', border: 'none', outline: 'none', textAlign: 'center' }}
              />
            </td>
            <td style={{ padding: '12px', border: '1px solid #ddd' }}>
              <input
                type="text"
                name="listNilai"
                value={nilaiData.listNilai[index]}
                onChange={(e) => handleChange(e, index)}
                style={{ color: 'black', width: '90%', border: 'none', outline: 'none', textAlign: 'center' }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button type="submit" style={{ marginTop: '20px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Submit Nilai</button>
  </form>
  <Sidebar />
</div>
<footer className="bg-gray-900 text-white text-center py-6 absolute bottom-0 w-full">
        <p>&copy; 2024 Jakarta Islamic School. All rights reserved.</p>
      </footer>
</div>

  );
};

export default InputNilaiForm;
