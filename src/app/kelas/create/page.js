"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Footer from '../../components/footer';
import Navbar from '../../components/navbar';
import { redirect } from 'next/navigation';
import { getAllGuru, getAllMurid, getUsersById } from '@/app/api/user';
import { parseJwt } from '@/app/utils/jwtUtils';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';
import Navbarguru from '@/app/components/navbarguru';
import Navbaradmin from '@/app/components/navbaradmin';


const CreateKelasForm = () => {
  const router = useRouter();
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
  const [decodedToken, setDecodedToken] = useState('');
  const [namaKelas, setNamaKelas] = useState('');
  const [deskripsiKelas, setDeskripsiKelas] = useState('');
  const [selectedNuptk, setSelectedNuptk] = useState('');
  const [selectedNisn, setSelectedNisn] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [nuptkOptions, setNuptkOptions] = useState(null);
  const [nisnOptions, setNisnOptions] = useState(null);
  const [nisnFetched, setNisnFetched] = useState(false);
  const [nuptkFetched, setNuptkFetched] = useState(false);
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
    } 
    else {
      redirect('/user/login');
    }
  }, []);
  
  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role === 'ADMIN' || decodedToken.role === 'GURU') {
        //Authorized
      } else {
        redirect(`/kelas/myclass`);
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
        setNuptkFetched(true);
      } catch (error) {
        router.push(`/error/500`);
      }
    };

    fetchNuptkOptions();
  }, []);

  useEffect(() => {
    const fetchNisnOptions = async () => {
      try {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const data = await getAllMurid(jwtToken);
        const options = [];
        for (const id of data) {
          const user = await getUsersById(id);
          options.push({ label: `${user.firstname} ${user.lastname}`, value: user.id });
        }
        setNisnOptions(options);
        setNisnFetched(true);
      } catch (error) {
        router.push(`/error/500`);
      }
    };

    fetchNisnOptions();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      setTimeout(() => {
        redirect('/kelas/view-all');
      }, 2000);
    }
  }, [showSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNuptk || !selectedNuptk.value || selectedNisn.length === 0) {
      // Hanya menampilkan pesan pada modal, tidak menggunakan window.alert lagi
      return;
    }
    try {
      const response = await axios.post(`${baseUrlKelas}/create`, {
        namaKelas,
        deskripsiKelas,
        nuptkWaliKelas: selectedNuptk.value,
        nisnSiswa: selectedNisn.map(nisn => nisn.value),
      });
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/kelas/view-all');
      }, 2000);
    } catch (error) {
      console.error('Error:', error.response);
      // Menampilkan pesan error pada modal
      setShowSuccess(false);
    }
  };

  const handleOpenModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = "flex";
  };

  const handleCloseModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = "none";
  };

  if (!nisnFetched || !nuptkFetched) {
    return <SpinLoading/>;
  }  

  return (
    <div className="bg-[#F3F5FB]">
      <Navbar id={id} role={role} />     
      <div className="container mx-auto flex items-center justify-center py-16 ">
        <div className="w-full max-w-sm space-y-4 bg-white shadow-md rounded-xl px-8 py-4">
          <div className="space-y-2">
            <h1 className=" text-center text-3xl font-bold font-nunito">Create a Class</h1>
            <p className="text-gray-500 font-nunito">
              Insert class data
            </p>
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="mb-4">
              <label htmlFor="nama-kelas" className="inline-block text-sm font-medium">Class Name</label>
              <input placeholder='Class Name' type="text" id="nama-kelas" value={namaKelas} onChange={(e) => setNamaKelas(e.target.value)} required className="h-10 w-full rounded-lg border border-[#6C80FF] bg-white px-3 py-2 text-sm placeholder-gray-400" />
            </div>
            <div className="mb-4">
              <label htmlFor="deskripsi-kelas" className="inline-block text-sm font-medium">Class Description</label>
              <textarea placeholder='Class Description' id="deskripsi-kelas" value={deskripsiKelas} onChange={(e) => setDeskripsiKelas(e.target.value)} required className="h-18 w-full rounded-lg border-[#6C80FF] bg-white px-3 py-2 text-sm placeholder-gray-400" style={{ boxShadow: '0 0 0 1px #6C80FF' }}></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="nuptk-wali-kelas" className="inline-block text-sm font-medium">Primary Teacher</label>
              <Select
                value={selectedNuptk}
                onChange={setSelectedNuptk}
                options={nuptkOptions}
                isSearchable={true}
                className='border-[#6C80FF] border-0 rounded-lg !hover:border-[#6C80FF]'
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: '#6C80FF',
                    borderRadius: '8px'
                  }),
                }}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nisn-siswa" className="inline-block text-sm font-medium overflow-hidden">Students List</label>
              <Select
                value={selectedNisn}
                onChange={(selectedOption) => setSelectedNisn(selectedOption)}
                options={nisnOptions}
                isMulti
                isSearchable={true}
                closeMenuOnSelect={false}
                className='border-[#6C80FF] border-0 rounded-lg !hover:border-[#6C80FF]'
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: '#6C80FF',
                    borderRadius: '8px'
                  }),
                }}
              />
            </div>
            <div className='w-full flex justify-end'>
              <button type="submit" className=" bg-[#6C80FF] text-white px-4 py-2 rounded-md ">Create</button>
            </div>
          </form>
        </div>

        {showSuccess && (
          <div id="modal" className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white max-w-xl w-full rounded-md">
              <div className="p-3 flex items-center justify-between border-b border-b-gray-300">
                <h3 className="font-semibold text-xl">
                  Success!
                </h3>
                <span className="modal-close cursor-pointer" onClick={handleCloseModal}>×</span>
              </div>
              <div className="p-3 border-b border-b-gray-300">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded relative mt-4" role="alert">
                  <p className="block sm:inline">Class created successfully! You will be redirected soon.</p>
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

export default CreateKelasForm;
