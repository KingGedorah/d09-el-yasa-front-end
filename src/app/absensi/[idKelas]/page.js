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
import Navbarmurid from '@/app/components/navbarmurid';
import Navbarguru from '@/app/components/navbarguru';

const AbsensiList = ({ params }) => {
  const { idKelas } = params;
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [absensiList, setAbsensiList] = useState(null);
  const router = useRouter();
  // const decodedToken = parseJwt(sessionStorage.getItem('jwtToken'));
  const [decodedToken, setDecodedToken] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = parseJwt(token);
        setDecodedToken(decoded);
        setId(decoded.id);
        console.log(decoded.role)
      } catch (error) {
        console.error('Failed to parse token', error);
      }
    } else {
      router.push('/user/login');
    }
  }, [router]);

  useEffect(() => {
    if (decodedToken) {
      //Authorized
    }
  }, [decodedToken]);

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

  const formatter = new Intl.DateTimeFormat('en-EN', {
    day: 'numeric',
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return <SpinLoading />;
  }

  return (
    <div>
      {decodedToken && decodedToken.role === 'MURID' && <Navbarmurid role={id} />}
      {decodedToken && decodedToken.role === 'GURU' && <Navbarguru role={id} />}
      {decodedToken && decodedToken.role === 'STAFF' && <Navbar role={id} />}
      <div className="container mx-auto mt-8 p-8 bg-[#F3F5FB] rounded-lg shadow-md max-w-screen-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}
            {absensiList?.length === 0 && (<div className='text-center text-black'>No Attendance Recorded</div>)}
            </div>}
            {!loading && !error && (
            <div className="flex flex-col gap-4">
              <div className='font-semibold text-xl text-black text-center my-4'>Class Attendance</div>
              {absensiList && absensiList.length > 0 ? absensiList.map(absensi => (
                <div key={absensi.idAbsen} className="p-4 w-full flex justify-between text-black border border-[#6C80FF] rounded-2xl">
                  <div className='flex flex-col my-auto'>
                    <div className='font-medium text-lg'>
                      {formatter.format(new Date(absensi.tanggalAbsen))} Attendance
                    </div>
                  </div>
                  <div className='flex gap-4 items-center'>
                    <Link href={`/absensi/${idKelas}/${absensi.idAbsen}`}>
                      <button className='px-14 py-3 rounded-xl text-xs border  border-[#6C80FF] text-[#6C80FF]'>
                        Detail
                      </button>
                    </Link>
                    {decodedToken && decodedToken.role === "GURU" &&
                      <button className='px-14 py-3 rounded-xl text-xs bg-[#6C80FF] text-white' onClick={() => router.push(`/absensi/update/${absensi.idAbsen}`)}>Update</button>
                    }
                  </div>
                </div>
              )) : (
                <div className='text-center text-black'>Tidak ada absensi</div>
              )}
            </div>
          )}
          </div>
          <div className='flex flex-col gap-4'>
          {decodedToken && decodedToken.role === "GURU" && (
            <Link href={`/absensi/create/${idKelas}`} className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'>
              <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg"> 
              <path d="M7.7 10.1C7.47333 10.1 7.28347 10.0232 7.1304 9.8696C6.9768 9.71653 6.9 9.52667 6.9 9.3C6.9 9.07333 6.9768 8.8832 7.1304 8.7296C7.28347 8.57653 7.47333 8.5 7.7 8.5C7.92667 8.5 8.1168 8.57653 8.2704 8.7296C8.42347 8.8832 8.5 9.07333 8.5 9.3C8.5 9.52667 8.42347 9.71653 8.2704 9.8696C8.1168 10.0232 7.92667 10.1 7.7 10.1ZM4.5 10.1C4.27333 10.1 4.0832 10.0232 3.9296 9.8696C3.77653 9.71653 3.7 9.52667 3.7 9.3C3.7 9.07333 3.77653 8.8832 3.9296 8.7296C4.0832 8.57653 4.27333 8.5 4.5 8.5C4.72667 8.5 4.9168 8.57653 5.0704 8.7296C5.22347 8.8832 5.3 9.07333 5.3 9.3C5.3 9.52667 5.22347 9.71653 5.0704 9.8696C4.9168 10.0232 4.72667 10.1 4.5 10.1ZM10.9 10.1C10.6733 10.1 10.4835 10.0232 10.3304 9.8696C10.1768 9.71653 10.1 9.52667 10.1 9.3C10.1 9.07333 10.1768 8.8832 10.3304 8.7296C10.4835 8.57653 10.6733 8.5 10.9 8.5C11.1267 8.5 11.3165 8.57653 11.4696 8.7296C11.6232 8.8832 11.7 9.07333 11.7 9.3C11.7 9.52667 11.6232 9.71653 11.4696 9.8696C11.3165 10.0232 11.1267 10.1 10.9 10.1ZM7.7 13.3C7.47333 13.3 7.28347 13.2232 7.1304 13.0696C6.9768 12.9165 6.9 12.7267 6.9 12.5C6.9 12.2733 6.9768 12.0835 7.1304 11.9304C7.28347 11.7768 7.47333 11.7 7.7 11.7C7.92667 11.7 8.1168 11.7768 8.2704 11.9304C8.42347 12.0835 8.5 12.2733 8.5 12.5C8.5 12.7267 8.42347 12.9165 8.2704 13.0696C8.1168 13.2232 7.92667 13.3 7.7 13.3ZM4.5 13.3C4.27333 13.3 4.0832 13.2232 3.9296 13.0696C3.77653 12.9165 3.7 12.7267 3.7 12.5C3.7 12.2733 3.77653 12.0835 3.9296 11.9304C4.0832 11.7768 4.27333 11.7 4.5 11.7C4.72667 11.7 4.9168 11.7768 5.0704 11.9304C5.22347 12.0835 5.3 12.2733 5.3 12.5C5.3 12.7267 5.22347 12.9165 5.0704 13.0696C4.9168 13.2232 4.72667 13.3 4.5 13.3ZM10.9 13.3C10.6733 13.3 10.4835 13.2232 10.3304 13.0696C10.1768 12.9165 10.1 12.7267 10.1 12.5C10.1 12.2733 10.1768 12.0835 10.3304 11.9304C10.4835 11.7768 10.6733 11.7 10.9 11.7C11.1267 11.7 11.3165 11.7768 11.4696 11.9304C11.6232 12.0835 11.7 12.2733 11.7 12.5C11.7 12.7267 11.6232 12.9165 11.4696 13.0696C11.3165 13.2232 11.1267 13.3 10.9 13.3ZM2.1 16.5C1.66 16.5 1.2832 16.3435 0.9696 16.0304C0.656533 15.7168 0.5 15.34 0.5 14.9V3.7C0.5 3.26 0.656533 2.88347 0.9696 2.5704C1.2832 2.2568 1.66 2.1 2.1 2.1H2.9V0.5H4.5V2.1H10.9V0.5H12.5V2.1H13.3C13.74 2.1 14.1168 2.2568 14.4304 2.5704C14.7435 2.88347 14.9 3.26 14.9 3.7V14.9C14.9 15.34 14.7435 15.7168 14.4304 16.0304C14.1168 16.3435 13.74 16.5 13.3 16.5H2.1ZM2.1 14.9H13.3V6.9H2.1V14.9Z" fill="white"/>
              </svg>
              Create Attendance
            </Link>
          )}
          <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AbsensiList;