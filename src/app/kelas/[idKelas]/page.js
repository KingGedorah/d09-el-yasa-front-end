"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as KelasApi from '../../api/kelas';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';

const DetailKelas = ({ params }) => {
  const { idKelas } = params;
  const [mapelInfo, setMapelInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMapelInfo = async () => {
      try {
        const kelasData = await KelasApi.getKelasByIdKelas(idKelas);
        const mapelPromises = kelasData.data.listMataPelajaran.map(async (mapelId) => {
          const mapelData = await KelasApi.getMapelByIdMapel(mapelId);
          return mapelData.data;
        });
        const mapelData = await Promise.all(mapelPromises);
        setMapelInfo(mapelData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMapelInfo();
  }, [idKelas]);

  const [guruInfo, setGuruInfo] = useState([]);

  useEffect(() => {
    const fetchGuruInfo = async () => {
      try {
        const guruPromises = mapelInfo.map(async (mapel) => {
          const guruData = await KelasApi.getGuruByIdNuptk(mapel.nuptkGuruMengajar);
          return guruData.data;
        });
        const guruData = await Promise.all(guruPromises);
        setGuruInfo(guruData);
      } catch (error) {
        console.error('Error fetching guru info:', error);
      }
    };

    if (mapelInfo.length > 0) {
      fetchGuruInfo();
    }
  }, [mapelInfo]);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="container mx-auto mt-4">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {!loading && !error && (
          <div>
            {mapelInfo.map((mapel, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                <div className="p-4">
                  <h2 className="text-xl font-bold">{mapel.namaMapel}</h2>
                  <p className="text-gray-600 mt-2">Guru Pengajar: {mapel.nuptkGuruMengajar}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DetailKelas;


