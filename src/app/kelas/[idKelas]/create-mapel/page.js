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
import Navbarguru from '@/app/components/navbarguru';
import Link from 'next/link';

const FormCreateMapel = ({ params }) => {
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
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
  const baseUrlKelas = process.env.NEXT_PUBLIC_BASE_KELAS_API

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const decoded = parseJwt(token);
      setDecodedToken(decoded);
      setId(decoded.id);
      setRole(decoded.role);
      console.log("id: " + decoded.id);
      console.log("role: " + decoded.role)
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
      const response = await axios.post(`${baseUrlKelas}/${idKelas}/create-mapel`, {
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
      <Navbar role={role} id={id}/>
      <div className="container px-4 md:px-6 flex items-center justify-center py-16 md:py-24 lg:py-32 mx-auto">
        <div className="w-full max-w-sm space-y-4 p-8 bg-white rounded-xl shadow-lg">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito">Add Subject</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito">
              Please fill in the information of the subject.
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
            <div className='flex gap-2 justify-end'>
              <Link href={`/kelas/${idKelas}`} className="bg-white border-[1px] border-[#6C80FF] text-[#6C80FF] py-2 px-4 transition duration-300 w-20 rounded-md text-center">Cancel</Link>
              <button type="submit" className="bg-[#6C80FF] text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 items-center">
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
