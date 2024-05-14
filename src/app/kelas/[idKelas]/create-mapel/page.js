"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import Select from 'react-select';
import { getAllGuru, getUsersById } from '@/app/api/user';
import { parseJwt } from '@/app/utils/jwtUtils';
import { redirect } from 'next/navigation';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';

const FormCreateMapel = ({ params }) => {
  const router = useRouter();
  const { idKelas } = params;
  const [namaMapel, setNamaMapel] = useState('');
  const [decodedToken, setDecodedToken] = useState('');
  const [selectedNuptk, setSelectedNuptk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nuptkOptions, setNuptkOptions] = useState();

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setDecodedToken(parseJwt(token));
    } else {
      redirect('/user/login');
    }
  }, []);
  
  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role === 'GURU') {
        //Authorized
      } else {
        redirect(`/kelas/${idKelas}`);
      }
    }
  }, [decodedToken]);

  useEffect(() => {
    const fetchNuptkOptions = async () => {
      try {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const data = await getAllGuru(jwtToken);
        const options = [];
        for (const id of data) {
          const user = await getUsersById(id);
          options.push({ label: `${user.firstname} ${user.lastname}`, value: user.id });
        }
        setNuptkOptions(options);
        setLoading(false);
      } catch (error) {
        router.push(`/error/500`);
      }
    };

    fetchNuptkOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/${idKelas}/create-mapel`, {
        namaMapel,
        nuptkGuruMengajar: selectedNuptk.value,
      });
      setShowSuccess(true);
      setShowModal(true);
      setTimeout(() => {
        router.push(`/kelas/${idKelas}`);
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      window.alert('Periksa kembali inputan anda');
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <SpinLoading/>;
  }

  return (
    <div className="bg-[#F3F5FB]">
      <Navbar />
      <div className="container px-4 md:px-6 flex items-center justify-center py-16 md:py-24 lg:py-32 mx-auto">
        <div className="w-full max-w-sm space-y-4 p-8 bg-white rounded-xl shadow-lg">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito">Add Subject</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito">
              Please fill in the information about the subject.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="inline-block text-sm font-medium" htmlFor="namaMapel">Subject Name</label>
              <input
                type="text"
                className="h-10 w-full rounded-lg border border-[#6C80FF] bg-white px-3 py-1 text-sm placeholder-gray-400" 
                id="namaMapel"
                value={namaMapel}
                onChange={(e) => setNamaMapel(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="inline-block text-sm font-medium" htmlFor="nuptkGuruMengajar">Teacher</label>
              <Select
                options={nuptkOptions}
                value={selectedNuptk}
                onChange={setSelectedNuptk}
                placeholder="Select Teacher..."
                className='border-[#6C80FF] border-0 rounded-lg !hover:border-[#6C80FF] h-10'
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: '#6C80FF',
                    borderRadius: '8px',
                    height: '40px'
                  }),
                }}
              />
            </div>
            <div className='grid place-items-end'>
              <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 items-center">
                Submit
              </button>
            </div>
          </form>
        </div>
        {showModal && (
          <div id="modal" className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white max-w-xl w-full rounded-md">
              <div className="p-3 flex items-center justify-between border-b border-b-gray-300">
                <h3 className="font-semibold text-xl">
                  Success!
                </h3>
                <span className="modal-close cursor-pointer" onClick={closeModal}>×</span>
              </div>
              <div className="p-3 border-b border-b-gray-300">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded relative mt-4" role="alert">
                  <p className="block sm:inline">Subject created successfully! You will be redirected soon.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FormCreateMapel;
