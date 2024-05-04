"use client";


import { useEffect, useState } from 'react';
import axios from 'axios';

const fetchUserScores = async (IdUser) => {
  try {
    const response = await axios.get(`http://localhost:8080/score/scores/${IdUser}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user scores');
  }
};

const UserIdPage = ({ params }) => {
  const { IdUser } = params;
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userScores = await fetchUserScores(IdUser);
        setScores(userScores);
      } catch (error) {
        setError(error.message);
      }
    };

    if (IdUser) {
      fetchData();
    }
  }, [IdUser]);

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
      <table style={{ borderCollapse: 'collapse', width: '80%', textAlign: 'center' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd', color: 'black' }}>Tipe</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', color: 'black' }}>Nilai</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <ul style={{ margin: '0', padding: '0', listStyleType: 'none', color: 'black' }}>
                  {score.tipeNilai.map((tipe, index) => (
                    <li key={index}>{tipe}</li>
                  ))}
                </ul>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <ul style={{ margin: '0', padding: '0', listStyleType: 'none', color: 'black' }}>
                  {score.listNilai.map((nilai, index) => (
                    <li key={index}>{nilai}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p>{error}</p>}
    </div>
    <footer className="bg-gray-900 text-white text-center py-6 absolute bottom-0 w-full">
        <p>&copy; 2024 Jakarta Islamic School. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default UserIdPage;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const viewNilai = ({ params }) => {
//     const { IdUser } = params;
//     const [nilai, setNilai] = useState(null);
//     const [error, setError] = useState('');
    
//     useEffect(() => {
//         const fetchNilai = async () => {
//         try {
//             const response = await axios.get(`http://localhost:8080/score/scores/${IdUser}`);
//             setNilai(response.data);
//             console.log('Nilai data:', response.data); 
//         } catch (error) {
//             setError('Nilai not found');
//         }
//         };
//         console.log(IdUser);
    
//         fetchNilai();
//     }, [IdUser]);
    
//     console.log('Nilai state:', nilai); 

//     return (
//         <div className="bg-white dark:bg-gray-950">
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//             <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '5px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
//             <h2 style={{ marginBottom: '20px', color: 'white' }}>Nilai Detail</h2>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             {nilai && (
//                 <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
//                 <p style={{ marginBottom: '10px', color: 'black' }}><strong>Nilai:</strong> {nilai.listNilai}</p>
//                 <p style={{ marginBottom: '10px', color: 'black' }}><strong>Tipe:</strong> {nilai.tipeNilai}</p>
//                 </div>
//             )}
//             </div>
//         </div>
//         </div>
        
//     );
//     }

// export default viewNilai;