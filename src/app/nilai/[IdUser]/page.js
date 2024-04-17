"use client";


// pages/nilai/[userId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const fetchUserScores = async (IdUser) => {
  try {
    const response = await axios.get(`http://localhost:8080/scores/${IdUser}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user scores');
  }
};

const UserIdPage = (params) => {
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
      <h1>User Scores</h1>
      {error && <p>{error}</p>}
      <ul>
        {scores.map((score) => (
          <li key={score.id}>
            <p>Tipe: {score.tipeNilai}</p>
            <p>Nilai: {score.listNilai}</p>
          </li>
        ))}
      </ul>
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