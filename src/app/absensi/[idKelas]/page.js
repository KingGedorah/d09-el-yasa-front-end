"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllBeritas } from '../../api/absensi';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import Image from 'next/image';
import * as AbsensiApi from '../../api/absensi';
import { useRouter } from 'next/navigation';
import { parseJwt } from '@/app/utils/jwtUtils';
import SpinLoading from '@/app/components/spinloading';

const AbsensiList = ({ params }) => {
  const { idKelas } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [absensiList, setAbsensiList] = useState(null);
  const router = useRouter();
  const decodedToken = parseJwt(sessionStorage.getItem('jwtToken'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AbsensiApi.retrieveAbsensiKelas(idKelas);
        setAbsensiList(response)
      } catch (error) {
        router.push(`/error/500`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idKelas]);

  const formatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return <SpinLoading/>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {!loading && !error && absensiList?.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className='font-semibold text-xl text-black text-center my-4'>Daftar Absensi Kelas</div>
                {decodedToken && decodedToken.role === "GURU" && (
                  <Link href={`/absensi/create/${idKelas}`} className='mx-auto'>
                    <button className='px-14 py-3 rounded-xl text-xs border bg-[#6C80FF] text-white mx-auto'>
                      Buat Absensi
                    </button>
                  </Link>
                )}
                {absensiList.map(absensi => (
                  <div key={absensi.idAbsen} className="p-4 w-full flex justify-between text-black border border-[#6C80FF] rounded-2xl">
                    <div className='flex flex-col'>
                      <div className='font-medium text-lg'>
                        Absensi {formatter.format(new Date(absensi.tanggalAbsen))}
                      </div>
                      <div className='text-md'>
                        Id Absensi: {absensi.idAbsen}
                      </div>
                    </div>
                    <div className='flex gap-4 items-center'>
                      <Link href={`/absensi/${idKelas}/${absensi.idAbsen}`}>
                        <button className='px-14 py-3 rounded-xl text-xs border border-[#6C80FF] text-[#6C80FF]'>
                          Detail
                        </button>
                      </Link>
                      {decodedToken && decodedToken.role === "GURU" &&
                        <button className='px-14 py-3 rounded-xl text-xs bg-[#6C80FF] text-white' onClick={() => router.push(`/absensi/update/${absensi.idAbsen}`)}>Update</button>
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AbsensiList;