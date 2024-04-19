// ./src/app/user/register/page.js

"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [role, setRole] = useState('guru'); // Default role
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://myjisc-user-e270dbbfd631.herokuapp.com/api/v1/auth/Register', {
        username,
        firstname: firstName,
        lastname: lastName,
        email,
        password
      });
      const token = response.data.token;
      sessionStorage.setItem('jwtToken', token);
      console.log(token);
      // Redirect to dashboard or some other page on successful registration
      // window.location.href = '/dashboard';
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar />
      <div className="container px-4 md:px-6 flex items-center justify-center">
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito-sans">Daftar</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
              Masukkan informasi di bawah ini.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="space-y-1">
                <label htmlFor="username" className="inline-block text-sm font-medium font-nunito-sans">
                  Username
                </label>
                <input
                  className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ color: 'black' }}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="firstname" className="inline-block text-sm font-medium font-nunito-sans">
                  Firstname
                </label>
                <input
                  className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                  id="firstname"
                  placeholder="Firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ color: 'black' }}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="lastname" className="inline-block text-sm font-medium font-nunito-sans">
                  Lastname
                </label>
                <input
                  className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                  id="lastname"
                  placeholder="Lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ color: 'black' }}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="inline-block text-sm font-medium font-nunito-sans">
                  Email
                </label>
                <input
                  className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                  id="email"
                  placeholder="afiq.ilyasa@ui.ac.id"
                  type="email"
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

              {/* <div className="space-y-1">
                <label htmlFor="role" className="inline-block text-sm font-medium font-nunito-sans">
                  Role
                </label>
                <select
                  className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ color: 'black' }}
                >
                  <option value="guru">Guru</option>
                  <option value="siswa">Siswa</option>
                  <option value="admin">ADMIN</option>
                </select>
              </div> */}
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 font-nunito-sans"
              >
                Daftar!
              </button>
            </div>
          </form>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
