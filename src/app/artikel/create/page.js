"use client";

import React, { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Link from 'next/link';
import Image from 'next/image';

const CreateArticle = () => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState('');
  const [judulArtikel, setJudulArtikel] = useState('');
  const [isiArtikel, setIsiArtikel] = useState('');
  const [gambar, setGambar] = useState(null);
  const [selectedKategori, setSelectedKategori] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // TODO: Uncomment this later
  // useEffect(() => {
  //   const token = sessionStorage.getItem('jwtToken');
  //   if (token) {
  //     setDecodedToken(parseJwt(token));
  //   } else {
  //     console.log("Need to login");
  //     redirect('/user/login');
  //   }
  // }, []);

  // useEffect(() => {
  //   if (decodedToken) {
  //     if (decodedToken.role === 'ADMIN') {
  //       console.log("Access granted");
  //     } else {
  //       console.log("Not authorized");
  //       redirect('/berita');
  //     }
  //   }
  // }, [decodedToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('judulArtikel', judulArtikel);
    formData.append('isiArtikel', isiArtikel);
    formData.append('image', gambar);
    selectedKategori.forEach((kat) => {
      formData.append('kategori[]', kat);
    });

    try {
      const response = await axios.post('https://myjisc-artikel-29c0ad65b512.herokuapp.com/api/artikel/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setIsSuccess(true);
      setJudulArtikel('');
      setIsiArtikel('');
      setGambar(null);
      setSelectedKategori([]);
      router.push("/artikel");
    } catch (error) {
      console.error('Error creating article:', error);
      setIsError(true);
    }
  };

  const handleSuccessPopup = () => {
    setIsSuccess(false);
    redirect('/artikel')
  };

  const handleErrorPopup = () => {
    setIsError(false);
  };

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    if (selectedKategori.includes(value)) {
      setSelectedKategori(selectedKategori.filter((kategori) => kategori !== value));
    } else {
      setSelectedKategori([...selectedKategori, value]);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">Buat Artikel</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="mb-4">
              <label htmlFor="judulArtikel" className="block text-gray-700 font-bold mb-2">Judul Artikel</label>
              <input type="text" id="judulArtikel" value={judulArtikel} onChange={(e) => setJudulArtikel(e.target.value)} name="judul" className="border border-[#6C80FF] rounded-xl py-2 px-4 w-full focus:outline-none focus:border-blue-500" required />
            </div>

            <div className="mb-4">
              <label htmlFor="isiArtikel" className="block text-gray-700 font-bold mb-2">Isi Artikel</label>
              <textarea name="isiArtikel" rows="5" className="border border-[#6C80FF] rounded-xl py-2 px-4 w-full resize-none focus:outline-none focus:border-blue-500" id="isiArtikel" value={isiArtikel} onChange={(e) => setIsiArtikel(e.target.value)} required />
            </div>

            <div className='block text-gray-700 font-bold mb-2'>Upload gambar</div>

            <div class="flex items-center justify-center w-full mb-4">
              <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-[#6C80FF] border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100">
                {gambar ? (
                  <div className='flex flex-col items-center'>
                    <div className='w-40 h-40'>
                      <div className='w-full h-full relative'>
                        <Image
                          src={URL.createObjectURL(gambar)}
                          layout='fill'
                          objectFit='contain'
                        />
                      </div>
                    </div>
                    <div className='text-[#6C80FF] font-semibold'>{gambar.name}</div>
                  </div>
                ) : (
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                )}
                <input id="dropzone-file" type="file" class="hidden" onChange={(e) => setGambar(e.target.files[0])} />
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Kategori:</label>
              <div className="flex flex-wrap">
                <label className="mr-4 mb-2"><input type="checkbox" value="Pendidikan" checked={selectedKategori.includes("Pendidikan")} onChange={handleCheckboxChange} /> Pendidikan</label>
                <label className="mr-4 mb-2"><input type="checkbox" value="Teknologi" checked={selectedKategori.includes("Teknologi")} onChange={handleCheckboxChange} /> Teknologi</label>
                <label className="mr-4 mb-2"><input type="checkbox" value="Olahraga" checked={selectedKategori.includes("Olahraga")} onChange={handleCheckboxChange} /> Olahraga</label>
                <label className="mr-4 mb-2"><input type="checkbox" value="Prestasi" checked={selectedKategori.includes("Prestasi")} onChange={handleCheckboxChange} /> Prestasi</label>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Link href="/artikel" className="bg-white border-[1px] border-[#6C80FF] text-[#6C80FF] py-2 px-4 transition duration-300 w-40 rounded-xl text-center">Cancel</Link>
              <button type="submit" className="bg-[#6C80FF] text-white py-2 px-4 transition duration-300 w-40 rounded-xl">Post</button>
            </div>
          </div>
        </form>
      </div>

      {isSuccess && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-green-600 font-semibold">Artikel berhasil dibuat!</p>
            <button onClick={handleSuccessPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Tutup</button>
          </div>
        </div>
      )}
      {isError && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-red-600 font-semibold">Gagal membuat artikel!</p>
            <button onClick={handleErrorPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Tutup</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CreateArticle;