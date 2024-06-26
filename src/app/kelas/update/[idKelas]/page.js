"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';
import * as KelasApi from '../../../api/kelas';
import { parseJwt } from '@/app/utils/jwtUtils';
import { getUsersById, getAllGuru, getAllMurid } from '@/app/api/user';
import { redirect } from 'next/navigation';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';

const UpdateKelasForm = ({ params }) => {
  const router = useRouter();
  const { idKelas } = params;
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
  const [decodedToken, setDecodedToken] = useState('');
  const [namaKelas, setNamaKelas] = useState('');
  const [deskripsiKelas, setDeskripsiKelas] = useState('');
  const [selectedNuptk, setSelectedNuptk] = useState('');
  const [errorPopup, setErrorPopup] = useState(false);
  const [selectedNisn, setSelectedNisn] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [nuptkOptions, setNuptkOptions] = useState(null);
  const [nisnOptions, setNisnOptions] = useState(null);
  const [loading, setLoading] = useState(true);
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
    } else {
      redirect('/user/login');
    }
  }, []);

  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role === 'ADMIN' || decodedToken.role === 'GURU') {
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
    const fetchNisnUsers = async () => {
      try {
        const response = await KelasApi.getKelasByIdKelas(idKelas);
        const { data } = response;
        const nisnUsers = [];
        for (const nisn of data.nisnSiswa) {
          const user = await getUsersById(nisn);
          nisnUsers.push({ value: nisn, label: `${user.firstname} ${user.lastname}` });
        }
        setSelectedNisn(nisnUsers);
      } catch (error) {
        router.push(`/error/500`);
      }
    };
    
    fetchNisnUsers();
  }, []); 
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await KelasApi.getKelasByIdKelas(idKelas);
        const { data } = response;

        setNamaKelas(data.namaKelas);
        setDeskripsiKelas(data.deskripsiKelas);
        const dataNuptk = await getUsersById(data.nuptkWaliKelas)
        setSelectedNuptk({ value: data.nuptkWaliKelas, label: `${dataNuptk.firstname} ${dataNuptk.lastname}` });
        setLoading(false);
      } catch (error) {
        router.push(`/error/500`);
      }
    }

    fetchData();
  }, [idKelas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNuptk) {
      console.error('NUPTK is required and must be valid');
      return;
    }
    if (selectedNisn.length === 0) {
      setErrorPopup(true);
      return;
    }

    const uniqueSelectedNisn = selectedNisn.filter((value, index, self) =>
        index === self.findIndex(v => String(v.value) === String(value.value)));

    try {
      const response = await axios.put(
        `${baseUrlKelas}/update/${idKelas}`,
        {
          namaKelas,
          deskripsiKelas,
          nuptkWaliKelas: selectedNuptk.value,
          nisnSiswa: uniqueSelectedNisn.map(nisn => nisn.value),
        }
      );
      setShowSuccess(true);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  const handleCloseErrorPopup = () => {
    setErrorPopup(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccess(false);
  };

  const filteredNisnOptions = nisnOptions ? 
  nisnOptions.filter(option =>
    !selectedNisn.some(selected => selected.value === option.value)
  ) : [];

  if (loading || !nisnFetched || !nuptkFetched) {
    return <SpinLoading/>;
  } 

  return (
    <div className="bg-[#F2F3FB] pb-20">
      <Navbar id={id} role={role}/>
      <div className="container px-4 md:px-6 flex items-center justify-center py-16 md:py-24 lg:py-32 mx-auto">
      <div className="w-full max-w-sm space-y-4 p-8 rounded-xl bg-white shadow-lg">
      <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito">Update Class</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito">
            Please fill in the information about the class.
            </p>
          </div>
      <form
        onSubmit={handleSubmit}
        className=""
      >
        <div className="mb-4">
          <label
            htmlFor="nama-kelas"
            className="inline-block text-sm font-medium"
          >
            Class Name
          </label>
          <input
            type="text"
            id="nama-kelas"
            value={namaKelas}
            onChange={(e) => setNamaKelas(e.target.value)}
            required
            className="h-10 w-full rounded-lg border border-[#6C80FF] bg-white px-3 py-1 text-sm placeholder-gray-400" 
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="deskripsi-kelas"
            className="inline-block text-sm font-medium"
          >
            Class Description
          </label>
          <textarea
            id="deskripsi-kelas"
            value={deskripsiKelas}
            onChange={(e) => setDeskripsiKelas(e.target.value)}
            required
            className="min-h-20 w-full rounded-lg border border-[#6C80FF] bg-white px-3 py-2 text-sm placeholder-gray-400" 
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="nuptk-wali-kelas"
            className="inline-block text-sm font-medium"
          >
            Teacher
          </label>
          <Select
            value={selectedNuptk}
            onChange={setSelectedNuptk}
            options={nuptkOptions}
            isSearchable={true}
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
        <div className="mb-4">
          <label
            htmlFor="nisn-siswa"
            className="inline-block text-sm font-medium"
          >
            Students
          </label>
          <Select
            value={selectedNisn}
            onChange={setSelectedNisn}
            options={filteredNisnOptions}
            isMulti
            isSearchable={true}
            className='border-[#6C80FF] border-0 rounded-lg !hover:border-[#6C80FF]'
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: '#6C80FF',
                borderRadius: '8px',
              }),
            }}
          />
        </div>
        <div className='w-full flex justify-end'>
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
        >
          Update
        </button>
        </div>
      </form>
      {errorPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-md">
            <p className="text-lg text-gray-800 mb-4">Cek kembali inputan anda</p>
            <button
              onClick={handleCloseErrorPopup}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Success!</h2>
              <span className="modal-close cursor-pointer text-gray-700" onClick={handleCloseSuccessModal}>×</span>
            </div>
            <p className="text-lg text-gray-800 mb-4">Class has been updated successfully.</p>
            <button
              onClick={handleCloseSuccessModal}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 flex items-center justify-center mx-auto"
            >
              <a href="/kelas/view-all">Close</a>
            </button>
          </div>
        </div>
      )}
      </div>
      
      </div>
     <Footer/>
    </div>
  );
};

export default UpdateKelasForm;
