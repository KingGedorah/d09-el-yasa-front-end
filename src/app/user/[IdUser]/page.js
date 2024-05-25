// src/app/user/[IdUser]/UserDetail.js

"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useRouter } from 'next/navigation';
import SpinLoading from '@/app/components/spinloading';

const UserDetail = ({ params }) => {
  const router = useRouter();
  const { IdUser } = params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://myjisc-user-c9e48ced667a.herokuapp.com/api/user/${IdUser}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        router.push(`/error/500`);
      }
    };
    console.log(IdUser);

    fetchUser();
  }, [IdUser]);

  if (loading) {
    return <SpinLoading/>;
  }

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
