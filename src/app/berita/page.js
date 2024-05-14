"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllBeritas } from '../api/berita';
import BeritaImage from '../beritaimage/page';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import Image from 'next/image';
import { parseJwt } from '../utils/jwtUtils';
import DOMPurify from 'dompurify';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import SpinLoading from '@/app/components/spinloading';
import { FaRegSadCry } from 'react-icons/fa';
import FadeIn from '../components/fadein-div';

const BeritaList = () => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState('');
  const [beritas, setBeritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const beritasPerPage = 6;
  let totalBeritas;
  let totalPages;
  let paginatedBeritas;

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
      //Authorized
    }
  }, [decodedToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const beritasData = await getAllBeritas();
        if (beritasData == null) {
          setLoading(false);
        } else {
          beritasData.sort((a, b) => new Date(b.dateUpdated) - new Date(a.dateUpdated));
          beritasData.forEach(berita => {
            berita.isiBerita = DOMPurify.sanitize(berita.isiBerita);
          });
          setBeritas(beritasData);
          setLoading(false);
        }
      } catch (error) {
        router.push(`/error/500`);
      }
    };

    fetchData();
  }, [router]);

  const handleChangeSearchBar = (e) => {
    setQuery(e.target.value)
  }

  const handleFilterByCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (beritas.length === 0) {
    //No data found
  } else {
    let indexOfLastBerita = currentPage * beritasPerPage;
    let indexOfFirstBerita = indexOfLastBerita - beritasPerPage;
    let currentBeritas = beritas.filter(berita => {
      let containsCategory = selectedCategory ? (Array.isArray(berita.kategori) && berita.kategori.includes(selectedCategory)) : true;
      let containsQuery = query ? berita.judulBerita.toLowerCase().includes(query.toLowerCase()) : true;
      return containsCategory && containsQuery;
    });

    totalBeritas = currentBeritas.length;
    totalPages = Math.ceil(totalBeritas / beritasPerPage);
    paginatedBeritas = currentBeritas.slice(indexOfFirstBerita, indexOfLastBerita);
  }


  if (loading) {
    return <SpinLoading />;
  }

  return (
    <FadeIn>
      <Navbar />
      <div className="mx-auto mt-8 px-12 rounded-lg" style={{ marginBottom: '100px' }}>
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-2/3">
            <div className='relative'>
              <input onChange={handleChangeSearchBar} type='text' className="border border-[#6C80FF] mb-4 rounded-xl py-3 bg-transparent px-4 w-full focus:outline-none focus:border-blue-500" />
              <div className='absolute top-[14px] right-4'>
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 0C13.968 0 18 4.032 18 9C18 13.968 13.968 18 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0ZM9 16C12.867 16 16 12.867 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16ZM17.485 16.071L20.314 18.899L18.899 20.314L16.071 17.485L17.485 16.071Z" fill="#6C80FF" />
                </svg>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <button onClick={() => handleFilterByCategory(null)} className={`bg-[#6C80FF] text-white px-4 py-2 rounded-md ${selectedCategory === null ? 'bg-opacity-100' : 'bg-opacity-50'}`}>All</button>
              <button onClick={() => handleFilterByCategory("Pendidikan")} className={`bg-[#6C80FF] text-white px-4 py-2 rounded-md ${selectedCategory === "Pendidikan" ? 'bg-opacity-100' : 'bg-opacity-50'}`}>Pendidikan</button>
              <button onClick={() => handleFilterByCategory("Teknologi")} className={`bg-[#6C80FF] text-white px-4 py-2 rounded-md ${selectedCategory === "Teknologi" ? 'bg-opacity-100' : 'bg-opacity-50'}`}>Teknologi</button>
              <button onClick={() => handleFilterByCategory("Olahraga")} className={`bg-[#6C80FF] text-white px-4 py-2 rounded-md ${selectedCategory === "Olahraga" ? 'bg-opacity-100' : 'bg-opacity-50'}`}>Olahraga</button>
              <button onClick={() => handleFilterByCategory("Prestasi")} className={`bg-[#6C80FF] text-white px-4 py-2 rounded-md ${selectedCategory === "Prestasi" ? 'bg-opacity-100' : 'bg-opacity-50'}`}>Prestasi</button>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {!loading && !error && (
              <div className="flex flex-col gap-4 w-full">
                {beritas.length === 0 ? (
                  <div className="text-center">
                    <FaRegSadCry size={64} className="text-gray-400 mx-auto" />
                    <p className="text-lg font-semibold mt-4">There's no berita has been posted</p>
                    <p className="text-sm text-gray-600">Make one now !</p>
                  </div>
                ) : (
                  <>
                    {paginatedBeritas.map(berita => (
                      <div
                        key={berita.idBerita}
                        className="p-4 border-[1px] border-[#8D6B94] w-full rounded-xl berita-item"
                        style={{
                          transition: 'transform 0.3s',
                          transform: 'scale(1)',
                          ':hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                        onMouseEnter={(event) => event.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(event) => event.target.style.transform = 'scale(1)'}
                      >
                        <div className='flex justify-center'>
                          {berita.imageBerita ? (
                            <BeritaImage idBerita={berita.idBerita} className="w-full h-48 object-cover" />
                          ) : (
                            <Image src="https://via.placeholder.com/600x400" width="600" height="400" objectFit="cover" alt="Placeholder" loading="lazy" />
                          )}
                        </div>
                        <Link href={`/berita/${berita.idBerita}`} passHref>
                          <h2 className='text-lg text-bold mb-4 mt-4'>{berita.judulBerita}</h2>
                        </Link>
                        <div dangerouslySetInnerHTML={{ __html: berita.isiBerita.slice(0, 150) }} />
                        <Link href={`/berita/${berita.idBerita}`} passHref>
                          <button className="mt-2 bg-white border-[1px] border-[#6C80FF] text-[#6C80FF] px-4 py-2 rounded-md cursor-pointer">Baca Selengkapnya</button>
                        </Link>
                      </div>
                    ))}
                  </>
                )}
                {totalBeritas === 0 && <div>Tidak ada hasil pencarian.</div>}
                <ul className="flex justify-center mb-8" style={{ marginBottom: '30px' }}> {/* Updated with margin-bottom */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <li key={number}>
                      <button
                        onClick={() => handlePageChange(number)}
                        className={`mx-1 px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300'
                          }`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className='flex flex-col gap-4'>
            {decodedToken.role !== "MURID" && (
              <Link href="/berita/create" className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'
              onMouseEnter={(event) => event.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(event) => event.target.style.transform = 'scale(1)'}
            >
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.5 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 12H16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Post Berita
            </Link>            
            )}
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </FadeIn>
  );
};

export default BeritaList;