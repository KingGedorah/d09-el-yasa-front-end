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
      const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', {
        email,
        password
      });
      const token = response.data.token;
      sessionStorage.setItem('jwtToken', token);
      console.log(token);
      // Redirect to dashboard or some other page on successful login
      window.location.href = '/dashboard';
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Head>
        <title>Your Title</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
      </Head>

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
                Siswa
              </a>
              <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
                Guru
              </a>
            </nav>
            <div className="flex items-center gap-4 md:gap-6">
              <button type="button" className="text-sm font-medium font-nunito-sans">
                Masuk
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold font-nunito-sans">Masuk</h1>
              <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
                Masukkan informasi akun Anda di bawah ini.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div className="space-y-1">
                  <label htmlFor="email" className="inline-block text-sm font-medium font-nunito-sans">
                    Email
                  </label>
                  <input
                    className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                    id="email"
                    placeholder="afiq.ilyasa@ui.ac.id"
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
                    className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
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
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 font-nunito-sans"
                >
                  Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 absolute bottom-0 w-full">
        <p>&copy; 2024 Jakarta Islamic School. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
