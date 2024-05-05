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

const BeritaList = () => {
  const [decodedToken, setDecodedToken] = useState('');
  const [beritas, setBeritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("")

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setDecodedToken(parseJwt(token));
    }
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const beritasData = await getAllBeritas();
        setBeritas(beritasData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangeSearchBar = (e) => {
    setQuery(e.target.value)
  }

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-8 px-12 rounded-lg">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-2/3">
            {error && <div>Error: {error.message}</div>}
            <div className='relative'>
            <input onChange={handleChangeSearchBar} type='text' className="border border-[#6C80FF] mb-4 rounded-xl py-3 bg-transparent px-4 w-full focus:outline-none focus:border-blue-500" />
            <div className='absolute top-[14px] right-4'>
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 0C13.968 0 18 4.032 18 9C18 13.968 13.968 18 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0ZM9 16C12.867 16 16 12.867 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16ZM17.485 16.071L20.314 18.899L18.899 20.314L16.071 17.485L17.485 16.071Z" fill="#6C80FF"/>
              </svg>
            </div>
            </div>
            {loading && <div>Loading...</div>}
            {!loading && !error && beritas.length > 0 && (
              <div className="flex flex-col gap-4 w-full">
                {beritas.filter(berita => berita.judulBerita.toLowerCase().includes(query.toLowerCase())).map(berita => (
                  <div key={berita.idBerita} className="p-4 border-[1px] border-[#8D6B94] w-full rounded-xl">
                  <div className='flex justify-center'>

                    {berita.imageBerita ? (
                      <BeritaImage idBerita={berita.idBerita} className="w-full h-48 object-cover" />
                    ) : (
                      <Image src="https://via.placeholder.com/600x400" width="600" height="400" objectFit="cover" alt="Placeholder" />
                    )}
                  </div>
                  <Link href={`/berita/${berita.idBerita}`} passHref>
                    <h2 className='text-lg text-bold mb-4 mt-4'>{berita.judulBerita}</h2>
                  </Link>
                  <p className="text-gray-700">{berita.isiBerita.slice(0, 150)}...</p>
                  <div className='flex justify-between'> 

                  <Link href={`/berita/${berita.idBerita}`} passHref>
                    <button className="mt-2 bg-white border-[1px] border-[#6C80FF] text-[#6C80FF] px-4 py-2 rounded-md cursor-pointer">Baca Selengkapnya</button>
                  </Link>
                  {decodedToken && decodedToken.role === "ADMIN" &&
                  
                    <Link href={`/berita/update/${berita.idBerita}`} className='flex px-8 py-2 rounded-md bg-[#6C80FF] text-white justify-center items-center gap-2'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.06107 20.2164L4.50191 19.6096H4.50191L4.06107 20.2164ZM2.95491 19.1102L2.34815 19.5511L2.34815 19.5511L2.95491 19.1102ZM17.9389 20.2164L17.4981 19.6096H17.4981L17.9389 20.2164ZM19.0451 19.1102L18.4383 18.6694L19.0451 19.1102ZM2.95491 5.23238L2.34815 4.79155L2.34815 4.79155L2.95491 5.23238ZM4.06107 4.12623L4.50191 4.73299V4.73299L4.06107 4.12623ZM9.00899 3.92846C9.42317 3.9235 9.75491 3.58371 9.74995 3.16953C9.74498 2.75534 9.40519 2.42361 8.99101 2.42857L9.00899 3.92846ZM20.7427 14.1803C20.7477 13.7661 20.416 13.4263 20.0018 13.4214C19.5876 13.4164 19.2478 13.7481 19.2428 14.1623L20.7427 14.1803ZM11.7976 16.1758L11.7147 15.4303L11.7976 16.1758ZM7.67777 15.8783L7.14744 16.4086L7.14744 16.4086L7.67777 15.8783ZM7.3803 11.7585L8.12571 11.8413L7.3803 11.7585ZM8.5274 9.3718L7.99707 8.84147L8.5274 9.3718ZM7.64293 10.4157L6.96696 10.0908L6.96695 10.0908L7.64293 10.4157ZM14.1843 15.0287L14.7146 15.559L14.1843 15.0287ZM13.1403 15.9131L13.4652 16.5891H13.4652L13.1403 15.9131ZM11 20.4213C9.10843 20.4213 7.74999 20.4203 6.69804 20.3063C5.66013 20.1939 5.00992 19.9787 4.50191 19.6096L3.62024 20.8232C4.42656 21.409 5.37094 21.6713 6.53648 21.7976C7.68798 21.9223 9.14184 21.9213 11 21.9213V20.4213ZM1.25 12.1713C1.25 14.0295 1.24897 15.4833 1.37373 16.6348C1.50001 17.8004 1.76232 18.7448 2.34815 19.5511L3.56168 18.6694C3.19259 18.1614 2.97745 17.5112 2.865 16.4733C2.75103 15.4213 2.75 14.0629 2.75 12.1713H1.25ZM4.50191 19.6096C4.14111 19.3475 3.82382 19.0302 3.56168 18.6694L2.34815 19.5511C2.70281 20.0392 3.13209 20.4685 3.62024 20.8232L4.50191 19.6096ZM11 21.9213C12.8582 21.9213 14.312 21.9223 15.4635 21.7976C16.6291 21.6713 17.5734 21.409 18.3798 20.8232L17.4981 19.6096C16.9901 19.9787 16.3399 20.1939 15.302 20.3063C14.25 20.4203 12.8916 20.4213 11 20.4213V21.9213ZM18.4383 18.6694C18.1762 19.0302 17.8589 19.3475 17.4981 19.6096L18.3798 20.8232C18.8679 20.4685 19.2972 20.0392 19.6518 19.5511L18.4383 18.6694ZM2.75 12.1713C2.75 10.2797 2.75103 8.9213 2.865 7.86936C2.97745 6.83144 3.19259 6.18123 3.56168 5.67322L2.34815 4.79155C1.76232 5.59787 1.50001 6.54225 1.37373 7.70779C1.24897 8.85929 1.25 10.3132 1.25 12.1713H2.75ZM3.62023 3.51946C3.13209 3.87412 2.70281 4.3034 2.34815 4.79155L3.56168 5.67322C3.82382 5.31242 4.14111 4.99513 4.50191 4.73299L3.62023 3.51946ZM8.99101 2.42857C6.56449 2.45766 4.89894 2.59043 3.62023 3.51946L4.50191 4.73299C5.33627 4.1268 6.50819 3.95844 9.00899 3.92846L8.99101 2.42857ZM19.2428 14.1623C19.2129 16.6631 19.0445 17.835 18.4383 18.6694L19.6518 19.5511C20.5809 18.2724 20.7137 16.6068 20.7427 14.1803L19.2428 14.1623ZM19.0257 9.12652L13.6539 14.4983L14.7146 15.559L20.0864 10.1872L19.0257 9.12652ZM9.05773 9.90213L14.4295 4.53033L13.3689 3.46967L7.99707 8.84147L9.05773 9.90213ZM11.7147 15.4303C10.5448 15.5603 9.74843 15.647 9.15674 15.6279C8.58517 15.6094 8.35441 15.4943 8.2081 15.348L7.14744 16.4086C7.68084 16.942 8.36328 17.103 9.10833 17.1271C9.83326 17.1505 10.757 17.046 11.8804 16.9212L11.7147 15.4303ZM6.63488 11.6757C6.51006 12.7991 6.40557 13.7228 6.42898 14.4477C6.45304 15.1928 6.61405 15.8752 7.14744 16.4086L8.2081 15.348C8.06179 15.2016 7.94665 14.9709 7.9282 14.3993C7.90909 13.8076 7.99571 13.0113 8.12571 11.8413L6.63488 11.6757ZM7.99707 8.84147C7.54195 9.2966 7.18261 9.64213 6.96696 10.0908L8.31891 10.7406C8.39835 10.5753 8.53029 10.4296 9.05773 9.90213L7.99707 8.84147ZM8.12571 11.8413C8.20808 11.1 8.23947 10.9059 8.31891 10.7406L6.96695 10.0908C6.7513 10.5395 6.70596 11.036 6.63488 11.6757L8.12571 11.8413ZM13.6539 14.4983C13.1265 15.0258 12.9807 15.1577 12.8155 15.2372L13.4652 16.5891C13.9139 16.3734 14.2595 16.0141 14.7146 15.559L13.6539 14.4983ZM11.8804 16.9212C12.5201 16.8501 13.0165 16.8048 13.4652 16.5891L12.8155 15.2372C12.6502 15.3166 12.4561 15.348 11.7147 15.4303L11.8804 16.9212ZM19.0257 4.53033C19.7074 5.21199 20.1642 5.67101 20.4598 6.05849C20.7422 6.42866 20.8061 6.64413 20.8061 6.82843H22.3061C22.3061 6.1843 22.0366 5.65222 21.6523 5.14862C21.2813 4.66232 20.7381 4.12134 20.0864 3.46967L19.0257 4.53033ZM20.0864 10.1872C20.7381 9.53551 21.2813 8.99453 21.6523 8.50824C22.0366 8.00463 22.3061 7.47256 22.3061 6.82843H20.8061C20.8061 7.01272 20.7422 7.22819 20.4598 7.59836C20.1642 7.98584 19.7074 8.44486 19.0257 9.12652L20.0864 10.1872ZM20.0864 3.46967C19.4347 2.818 18.8937 2.27476 18.4074 1.90373C17.9038 1.5195 17.3718 1.25 16.7276 1.25V2.75C16.9119 2.75 17.1274 2.81383 17.4976 3.09627C17.8851 3.3919 18.3441 3.84867 19.0257 4.53033L20.0864 3.46967ZM14.4295 4.53033C15.1112 3.84867 15.5702 3.3919 15.9577 3.09627C16.3279 2.81383 16.5433 2.75 16.7276 2.75V1.25C16.0835 1.25 15.5514 1.5195 15.0478 1.90373C14.5615 2.27476 14.0206 2.818 13.3689 3.46967L14.4295 4.53033ZM20.0864 9.12652L14.4295 3.46967L13.3689 4.53033L19.0257 10.1872L20.0864 9.12652Z" fill="white"/>
                    </svg>
                      Update
                    </Link>

                  }

                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-4'>
          {
              decodedToken && decodedToken.role === "ADMIN" && (
                <Link href="/berita/create" className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'><svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12.5 8V16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.5 12H16.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
                Post Berita
              </Link>
              )
            }
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BeritaList;