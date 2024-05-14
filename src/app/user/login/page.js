// ./src/app/user/login/page.js

"use client";

import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showHomePage, setShowHomePage] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://myjisc-user-e270dbbfd631.herokuapp.com/api/v1/auth/authenticate', {
        email,
        password
      });
      const token = response.data.token;
      sessionStorage.setItem('jwtToken', token);
      setTimeout(() => {
        setLoading(false);
        setShowHomePage(true);
      }, 2000); // Reduced timeout for better UX
    } catch (error) {
      setLoading(false);
      setIsError(true);
    }
  };

  const handleErrorPopup = () => {
    setIsError(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken');
    window.location.href = '/user/login';
  };

  useEffect(() => {
    if (showHomePage) {
      router.push('/');
    }
  }, [showHomePage]);

  return (
    <div className="bg-white">
      <Head>
        <title>Login</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
        <style>
          {`
            .login-form, .loading-overlay {
              opacity: ${showLoginForm ? '1' : '0'};
              transition: opacity 0.5s ease-in-out;
            }
            .fade-in {
              animation: fadeIn 1s ease-in-out forwards;
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}
        </style>
      </Head>

      <Navbar handleLogout={handleLogout} />

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 loading-overlay">
          <SpinLoading />
        </div>
      )}
      
      <main className={`py-16 md:py-24 lg:py-32 bg-[#F3F5FB] ${showLoginForm ? 'fade-in' : ''}`}>
        <div className="container px-4 md:px-6 flex items-center justify-center mx-auto">
          <div className="w-full max-w-sm space-y-4 p-8 bg-white rounded-xl shadow-lg login-form">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold font-nunito-sans">Welcome Back!</h1>
              <p className="text-gray-400 font-nunito">
                Please enter your account information
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div className="space-y-1">
                  <label htmlFor="email" className="inline-block text-sm font-medium font-nunito-sans">
                    Email
                  </label>
                  <input
                    required
                    className="h-10 w-full rounded-md border border-[#6C80FF] px-3 py-2 text-sm placeholder-gray-400 font-nunito"
                    id="email"
                    placeholder="john.doe@jisc.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ color: 'black' }}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="inline-block text-sm font-medium font-nunito-sans">
                    Password
                  </label>
                  <input
                    required 
                    className="h-10 w-full rounded-md border border-[#6C80FF] px-3 py-2 text-sm placeholder-gray-400 font-nunito-sans"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ color: 'black' }}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-[#6C80FF] hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 font-nunito"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {isError && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-red-600 font-semibold">Check your email and password again!</p>
            <button onClick={handleErrorPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LoginPage;
