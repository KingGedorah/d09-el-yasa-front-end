"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as KelasApi from '../../../api/kelas';
import * as AbsensiApi from '../../../api/absensi';
import Layout from '@/app/components/layout';
import { useRouter } from 'next/navigation';
import { parseJwt } from '@/app/utils/jwtUtils';
import SpinLoading from '@/app/components/spinloading';

const CreateAbsensiForm = ({ params }) => {
    const decodedToken = parseJwt(sessionStorage.getItem('jwtToken'));
    const { idKelas, idAbsensi } = params;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [detailAbsen, setDetailAbsen] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AbsensiApi.retrieveDetailAbsensi(idAbsensi);
                const { data } = response;
                setDetailAbsen(data)
            } catch (error) {
                router.push(`/error/500`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <SpinLoading />;
    }

    return (
        <div className="bg-white dark:bg-gray-950">
            <Layout>
                <div className="container px-4 md:px-6 mx-auto py-16 md:py-24 lg:py-32">
                    {loading && <div>Loading...</div>}
                    {error && <div>Error: {error.message}</div>}
                    <div className="max-w-lg mx-auto">
                        <h1 className="text-3xl md:text-4xl font-extrabold font-nunito-sans text-center mb-8">Detail Absensi</h1>
                        <div className="space-y-4">
                            <div className="mb-4">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-2 border border-gray-300">No.</th>
                                            <th className="p-2 border border-gray-300">NISN</th>
                                            <th className="p-2 border border-gray-300">Kehadiran</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailAbsen?.nisnSiswa.map((nisn, index) => (
                                            <tr key={nisn}>
                                                <td className="p-2 border border-gray-300">{index + 1}</td>
                                                <td className="p-2 border border-gray-300">{nisn}</td>
                                                <td className="p-2 border border-gray-300">{detailAbsen.keteranganAbsen[index]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {decodedToken && decodedToken.role === "GURU" && (
                                <button
                                    onClick={() => router.push(`/absensi/update/${detailAbsen.idAbsen}`)}
                                    className="w-full py-2 px-4 bg-[#6C80FF] hover:bg-blue-600 text-white rounded-lg focus:outline-none"
                                >
                                    Update
                                </button>
                            )}
                            <button
                                onClick={() => router.push(`/absensi/${idKelas}`)}
                                className="w-full py-2 px-4 border-[#6C80FF] border text-[#6C80FF] rounded-lg focus:outline-none"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default CreateAbsensiForm;