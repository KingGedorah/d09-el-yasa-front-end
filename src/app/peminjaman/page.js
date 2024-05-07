"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPeminjaman } from '../api/peminjaman';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import { parseJwt } from '../utils/jwtUtils';
import { getUsersById } from '@/app/api/user';
import { getInventoryById } from '../api/peminjaman';
import { getNotifMessageByIdPeminjam } from '../api/peminjaman';

const addIdRequestToDataB = (dataA, dataB) => {
  const confirmedRequests = dataA.filter(item => item.status === 'CONFIRMED');
  const declinedRequests = dataA.filter(item => item.status === 'DECLINED');

  // console.log("HAHAH", confirmedRequests, declinedRequests)
  // console.log("DATAB", dataB)

  let confirmedIndex = 0;
  let declinedIndex = 0;

  dataB.forEach(notif => {
    if (notif.message.includes("disetujui")) {
      notif.idRequest = confirmedRequests[confirmedIndex].idRequest;
      confirmedIndex++;
    } else if (notif.message.includes("ditolak")) {
      notif.idRequest = declinedRequests[declinedIndex].idRequest;
      declinedIndex++;
    }
  });

  // console.log("DATAB2", dataB)
};

const PeminjamanList = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [peminjaman, setPeminjaman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setDecodedToken(parseJwt(token));
    }
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let peminjamanData = await getAllPeminjaman();
        peminjamanData = peminjamanData.filter(p => p.idPeminjam === decodedToken.id)

        const usersPromises = peminjamanData.map(p => getUsersById(p.idPeminjam));
        const users = await Promise.all(usersPromises);

        let peminjamanWithUser = peminjamanData.map((p, index) => ({
          ...p,
          nama: users[index].firstname + " " + users[index].lastname
        }));


        const inventoryPromises = peminjamanWithUser.map(p =>
          Promise.all(p.listIdItem.map(itemId => getInventoryById(itemId)))
        );
        const inventories = await Promise.all(inventoryPromises);

        const finalData = peminjamanWithUser.map((p, index) => ({
          ...p,
          listItems: inventories[index].map(inventory => inventory.namaItem)
        }));

        setPeminjaman(finalData);
        setLoading(false);
      } catch (error) {
        console.log(error)
        setError(error);
        setLoading(false);
      }
    };

    if (decodedToken) {
      fetchData()
    }
  }, [decodedToken]);

  useEffect(() => {
    const fetchNotifMessage = async (id) => {
      try {
        const msg = await getNotifMessageByIdPeminjam(id);
        console.log("HEHEHE", msg)

        addIdRequestToDataB(peminjaman, msg);

        console.log(JSON.stringify(msg, null, 2));
        setMsg(msg);
      } catch (error) {
        console.error('Error fetching notification message:', error);
      }
    };
  
    if (decodedToken && peminjaman) {
      fetchNotifMessage(decodedToken.id)
    }
  }, [decodedToken, peminjaman]);
  

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-8 px-12 rounded-lg">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-2/3">
            {error && <div>Error: {error.message}</div>}

            {loading && <div>Loading...</div>}
            {!loading && !error && peminjaman.length > 0 && (
              <div className="flex flex-col gap-4 w-full">
                {peminjaman.map(p => (
                  <div key={p.idRequest} className="relative flex flex-col gap-2 p-4 border-[1px] border-[#6C80FF] w-full rounded-xl">
                    <strong className='text-lg'>Peminjaman {p.idRequest.slice(0, 5)}</strong>
                    <p>Tanggal Pengembalian: {new Date(p.returnDate).toLocaleDateString()}</p>
                    <p>Keperluan Peminjaman: {p.keperluanPeminjaman}</p>
                    <p>Barang yang Dipinjam: {p.listItems.join(", ")}</p>
                    <Link href={`/peminjaman/${p.idRequest}`} passHref className='absolute top-4 right-4'>
                      <button className="mt-2 bg-white border-[1px] border-[#6C80FF] text-[#6C80FF] px-4 py-2 rounded-md cursor-pointer">Detail</button>
                    </Link>
                    {
                      p.status === "PENDING" && <strong className='text-[#6C80FF] absolute bottom-4 right-8'>{p.status}</strong>
                    }
                    {
                      p.status === "CONFIRMED" && <strong className='text-[#1BC590] absolute bottom-4 right-8'>{p.status}</strong>
                    }
                    {
                      p.status === "DECLINED" && <strong className='text-[#E16B6B] absolute bottom-4 right-8'>{p.status}</strong>
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-4'>
            <Link href="/peminjaman/create" className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'><svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12.5 8V16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.5 12H16.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
              Buat Peminjaman
            </Link>
            <aside class="w-[300px] p-4 border-[#8D6B94] rounded-xl border-[1px] max-h-36 overflow-y-auto">
              <div className='flex gap-2 items-center mb-2'>
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.26351 6.15421C0.09083 6.43864 0 6.76056 0 7.08809V14.1176C0 15.1573 0.89543 16 2 16H18C19.1046 16 20 15.1573 20 14.1176V7.08809C20 6.76056 19.9092 6.43864 19.7365 6.15421L16.5758 0.948442C16.2198 0.361948 15.5571 0 14.8394 0H5.16065C4.44293 0 3.78025 0.361948 3.42416 0.948442L0.26351 6.15421ZM15.2735 1.64888C15.1845 1.50225 15.0188 1.41176 14.8394 1.41176H5.16065C4.98122 1.41176 4.81555 1.50225 4.72652 1.64888L1.72763 6.58824H5.5C6.05229 6.58824 6.4856 7.01816 6.64104 7.51699C7.06707 8.88405 8.4097 9.88235 10 9.88235C11.5903 9.88235 12.9329 8.88405 13.359 7.51699C13.5144 7.01816 13.9477 6.58824 14.5 6.58824H18.2724L15.2735 1.64888ZM18.5 8H14.7707C14.1336 9.90805 12.2407 11.2941 10 11.2941C7.7593 11.2941 5.86636 9.90805 5.22932 8H1.5V14.1176C1.5 14.3775 1.72386 14.5882 2 14.5882H18C18.2761 14.5882 18.5 14.3775 18.5 14.1176V8Z" fill="black"/>
              </svg>
              <h3 class="text-lg font-semibold">Inbox</h3>
              </div>
              {
                msg && msg.map(m => (
                  <h3 className="text-base font-normal mb-2">{m.message.slice(0,11)}{m.idRequest.slice(0, 5)}{m.message.slice(10)}</h3> 
                ))
              }
              <p class="text-gray-600 dark:text-gray-300"></p>
            </aside>
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PeminjamanList;