"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as KelasApi from '../../../api/kelas';
import Layout from '@/app/components/layout';
import { retrieveAbsensiKelas, retrieveDetailAbsensi, updateAbsensi } from '@/app/api/absensi';
import { useRouter } from 'next/navigation';
import { parseJwt } from '@/app/utils/jwtUtils';

const UpdateAbsensiForm = ({ params }) => {
    const { idAbsen } = params;
    const [selectedNisn, setSelectedNisn] = useState([]);
    const [tanggalAbsen, setTanggalAbsen] = useState('2024-01-02');
    const [keteranganAbsen, setKeteranganAbsen] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [dataAbsensi, setDataAbsensi] = useState(undefined);
    const router = useRouter();
    const decodedToken = parseJwt(sessionStorage.getItem('jwtToken'));


    useEffect(() => {
        if (!dataAbsensi?.kelas) return;
        const fetchData = async () => {
            try {
                const response = await KelasApi.getKelasByIdKelas(dataAbsensi.kelas);
                const { data } = response;
                setSelectedNisn(data.nisnSiswa.map((nisn, index) => ({
                    value: nisn,
                    label: nisn,
                    attendance: dataAbsensi.keteranganAbsen[index].toLowerCase()
                })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [dataAbsensi?.kelas]);

    useEffect(() => {
        if (!idAbsen) return;
        const fetchData = async () => {
            try {
                const { data } = await retrieveDetailAbsensi(idAbsen);
                setDataAbsensi(data);
                setTanggalAbsen(data.tanggalAbsen.slice(0, 10));
            } catch (error) {
                console.error("Error fetching data: ", error)
            }
        }
        fetchData();
    }, [idAbsen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct keteranganAbsen based on attendance data
        const updatedKeteranganAbsen = selectedNisn
            .map(student => {
                return student.attendance.charAt(0).toUpperCase() + student.attendance.slice(1);
            });

        try {
            const response = updateAbsensi(idAbsen, JSON.stringify({
                ...dataAbsensi,
                keteranganAbsen: updatedKeteranganAbsen,
            }))
            console.log('Response:', response);
            setShowSuccess(true);
            router.push(`/absensi/${dataAbsensi.kelas}/${idAbsen}`);
        } catch (error) {
            console.error('Error:', error);
            window.alert('Periksa kembali inputan anda');
        }
    };

    const handleCloseErrorPopup = () => {
        setErrorPopup(false);
    };



    const handleAttendanceChange = (index, type) => {
        const updatedNisnList = [...selectedNisn];
        updatedNisnList[index].attendance = type;
        setSelectedNisn(updatedNisnList);
    };

    return (
        <div className="bg-white dark:bg-gray-950">
            <Layout>
                <div className="container px-4 md:px-6 mx-auto py-16 md:py-24 lg:py-32">
                    <div className="max-w-lg mx-auto">
                        <h1 className="text-3xl md:text-4xl font-extrabold font-nunito-sans text-center mb-4">Update Absensi</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-4">
                                <label htmlFor="tanggalAbsen" className="block text-sm font-medium">Tanggal absen:</label>
                                <input
                                    disabled
                                    type="date"
                                    id="tanggalAbsen"
                                    name="tanggalAbsen"
                                    value={tanggalAbsen}
                                    onChange={(e) => setTanggalAbsen(e.target.value)}
                                    className="block w-full px-3 py-2 mt-1 text-sm md:text-base disabled:bg-gray-200 text-gray-700 border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-2 border border-gray-300">No.</th>
                                            <th className="p-2 border border-gray-300">NISN</th>
                                            <th className="p-2 border border-gray-300">Hadir</th>
                                            <th className="p-2 border border-gray-300">Izin</th>
                                            <th className="p-2 border border-gray-300">Sakit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedNisn.map((siswa, index) => (
                                            <tr key={siswa.value}>
                                                <td className="p-2 border border-gray-300">{index + 1}</td>
                                                <td className="p-2 border border-gray-300">{siswa.value}</td>
                                                <td className="p-2 border border-gray-300">
                                                    <input
                                                        type="radio"
                                                        name={`attendance_${index}`}
                                                        checked={siswa.attendance === 'hadir'}
                                                        onChange={() => handleAttendanceChange(index, 'hadir')}
                                                    />
                                                </td>
                                                <td className="p-2 border border-gray-300">
                                                    <input
                                                        type="radio"
                                                        name={`attendance_${index}`}
                                                        checked={siswa.attendance === 'izin'}
                                                        onChange={() => handleAttendanceChange(index, 'izin')}
                                                    />
                                                </td>
                                                <td className="p-2 border border-gray-300">
                                                    <input
                                                        type="radio"
                                                        name={`attendance_${index}`}
                                                        checked={siswa.attendance === 'sakit'}
                                                        onChange={() => handleAttendanceChange(index, 'sakit')}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {decodedToken && decodedToken.role === "GURU" && (
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-[#6C80FF] hover:bg-blue-600 text-white rounded-lg focus:outline-none"
                                >
                                    Perbaharui absensi
                                </button>
                            )}
                            <button
                                type='button'
                                onClick={() => router.back()}
                                className="w-full py-2 px-4 bg-white hover:bg-gray-200 text-red-500 border-red-500 border-[1px] rounded-lg focus:outline-none"
                            >
                                Batal
                            </button>
                            {showSuccess && (
                                <p className="text-green-500 dark:text-green-400 text-center mt-2">Absensi berhasil ditambahkan!</p>
                            )}
                        </form>
                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default UpdateAbsensiForm;