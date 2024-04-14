// src/app/user/[IdUser]/UserDetail.js

"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

const UserDetail = ({ params }) => {
  const { IdUser } = params;
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/${IdUser}`);
        setUser(response.data);
      } catch (error) {
        setError('User not found');
      }
    };
    console.log(IdUser);

    fetchUser();
  }, [IdUser]);

  return (
    <div className="bg-white dark:bg-gray-950">
            <Navbar />
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
  <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '5px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
    <h2 style={{ marginBottom: '20px', color: 'white' }}>User Detail</h2>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {user && (
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
        <p style={{ marginBottom: '10px', color: 'black' }}><strong>Username:</strong> {user.username}</p>
        <p style={{ marginBottom: '10px', color: 'black' }}><strong>First Name:</strong> {user.firstname}</p>
        <p style={{ marginBottom: '10px', color: 'black' }}><strong>Last Name:</strong> {user.lastname}</p>
        <p style={{ marginBottom: '10px', color: 'black' }}><strong>Email:</strong> {user.email}</p>
        <p style={{ marginBottom: '10px', color: 'black' }}><strong>Role:</strong> {user.role}</p>
      </div>
    )}
  </div>
</div>
<Footer />
</div>


  );
};

export default UserDetail;
