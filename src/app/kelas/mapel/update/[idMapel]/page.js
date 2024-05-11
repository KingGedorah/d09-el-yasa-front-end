"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import Select from 'react-select';
import { getUsersById, getAllGuru } from '@/app/api/user';
import { getMapelByIdMapel} from '@/app/api/kelas';
import { parseJwt } from '@/app/utils/jwtUtils';
import { redirect } from 'next/navigation';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';

const UpdateMapelForm = ({ params }) => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState('');
  const { idMapel } = params;
  const [namaMapel, setNamaMapel] = useState('');
  const [selectedNuptk, setSelectedNuptk] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nuptkOptions, setNuptkOptions] = useState(null);
  const [fetchedNuptk, setFetchedNuptk] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setDecodedToken(parseJwt(token));
    } else {
      console.log("Need to login");
      redirect('/user/login');
    }
  }, []);

  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role === 'ADMIN' || decodedToken.role === 'GURU') {
        console.log("Access granted");
      } else {
        console.log("Not authorized");
        redirect(`/kelas/mapel/${idMapel}`);
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
        setFetchedNuptk(true);
      } catch (error) {
        router.push(`/error/500`);
      }
    };
  
    fetchNuptkOptions();
  }, []);
  


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getMapelByIdMapel(idMapel);
        const { data } = response;

        setNamaMapel(data.namaMapel);
        const dataNuptk = await getUsersById(data.nuptkGuruMengajar)
        setSelectedNuptk({ value: data.nuptkGuruMengajar, label: `${dataNuptk.firstname} ${dataNuptk.lastname}` });
        setLoading(false);
      } catch (error) {
        router.push(`/error/500`);
      }
    }
    fetchData();

  }, [idMapel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNuptk) {
      console.error('NUPTK is required and must be valid');
      return;
    }
    try {
      const response = await axios.put(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/mapel/update/${idMapel}`, {
        namaMapel,
        nuptkGuruMengajar: selectedNuptk.value,
      });
      console.log('Response:', response);
      setShowSuccess(true);
      setShowModal(true); // Menampilkan modal setelah sukses
    } catch (error) {
      console.error('Error:', error);
      window.alert('Periksa kembali inputan anda');
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading || !fetchedNuptk) {
    return <SpinLoading/>;
  }

  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar />
      <div className="container px-4 md:px-6 flex items-center justify-center py-16 md:py-24 lg:py-32">
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito-sans">Perbarui mata pelajaran</h1>
            <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
              Masukkan informasi mata pelajaran di sini.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="inline-block text-sm font-medium" htmlFor="namaMapel">Nama Mapel:</label>
              <input
                type="text"
                className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="namaMapel"
                value={namaMapel}
                onChange={(e) => setNamaMapel(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="inline-block text-sm font-medium" htmlFor="nuptkGuruMengajar">NUPTK Guru Mengajar:</label>
              <Select
                options={nuptkOptions}
                value={selectedNuptk}
                onChange={setSelectedNuptk}
                placeholder="Pilih NUPTK Guru Mengajar"
              />
            </div>
            <div className='grid place-items-center'>
              <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 items-center">
                Perbarui mata pelajaran
              </button>
            </div>
            {error && <p className="text-danger mt-2">{error}</p>}
            {showSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
                <strong className="font-bold">Berhasil!</strong>
                <span className="block sm:inline"> Mata pelajaran berhasil diperbarui.</span>
              </div>
            )}
          </form>
        </div>
        {showModal && (
          <div id="modal" className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white max-w-xl w-full rounded-md">
              <div className="p-3 flex items-center justify-between border-b border-b-gray-300">
                <h3 className="font-semibold text-xl">
                  Berhasil :)
                </h3>
                <span className="modal-close cursor-pointer" onClick={closeModal}>×</span>
              </div>
              <div className="p-3 border-b border-b-gray-300">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded relative mt-4" role="alert">
                  <p className="block sm:inline">Mata pelajaran berhasil diperbarui!</p>
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

export default UpdateMapelForm;
