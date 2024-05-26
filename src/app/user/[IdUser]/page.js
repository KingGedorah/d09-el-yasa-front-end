// src/app/user/[IdUser]/UserDetail.js

"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useRouter } from 'next/navigation';
import SpinLoading from '@/app/components/spinloading';

const UserDetail = ({ params }) => {
  const [role, setRole] = useState('')
  const router = useRouter();
  const { IdUser } = params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const baseUrlUser = process.env.NEXT_PUBLIC_BASE_USER_API

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${baseUrlUser}/user/${IdUser}`);
        setUser(response.data);
        setRole(response.data.role);
        setLoading(false);
      } catch (error) {
        router.push(`/error/500`);
      }
    };

    fetchUser();
  }, [IdUser]);

  if (loading) {
    return <SpinLoading />;
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar role={role} id={IdUser} />
      <div className="flex flex-grow items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">User Profile</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {user && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-3xl text-gray-500">{user.firstname[0]}{user.lastname[0]}</span>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{user.firstname} {user.lastname}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 transition duration-300 ease-in-out">
                  <p className="text-gray-900"><strong>Full Name:</strong> {user.firstname} {user.lastname}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 transition duration-300 ease-in-out">
                  <p className="text-gray-900"><strong>NISN:</strong> {user.id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 transition duration-300 ease-in-out">
                  <p className="text-gray-900"><strong>Username:</strong> {user.username}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 transition duration-300 ease-in-out">
                  <p className="text-gray-900"><strong>Email:</strong> {user.email}</p>
                </div>
              </div>
              <div className="mt-6">
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDetail;