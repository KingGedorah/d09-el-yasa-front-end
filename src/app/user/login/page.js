// ./src/app/user/login/page.js

"use client";

import Head from 'next/head';
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://myjisc-user-e270dbbfd631.herokuapp.com/api/v1/auth/authenticate', {
        email,
        password
      });
      const token = response.data.token;
      sessionStorage.setItem('jwtToken', token);
      console.log(token);
      // Redirect to dashboard or some other page on successful login
      window.location.href = '/';
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    // Clear session storage or remove the token
    sessionStorage.removeItem('jwtToken');
    // Redirect to login page or home page
    window.location.href = '/user/login';
  };

  return (
    <div className="bg-white">
      <Head>
        <title>Your Title</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
      </Head>

      <Navbar handleLogout={handleLogout} />

      <main className="py-16 md:py-24 lg:py-32 bg-[#F3F5FB]">
        <div className="container px-4 md:px-6 flex items-center justify-center mx-auto">
          <div className="w-full max-w-sm space-y-4 p-8 bg-white rounded-xl shadow-lg">
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
              {/* Submit */}
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
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;


