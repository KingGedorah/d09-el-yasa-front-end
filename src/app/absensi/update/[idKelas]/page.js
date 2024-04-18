"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as KelasApi from '../../../api/kelas';
import Layout from '@/app/components/layout';

const UpdateAbsensiForm = ({ params }) => {
    const { idKelas } = params;
    const [selectedNisn, setSelectedNisn] = useState([]);
    const [tanggalAbsen, setTanggalAbsen] = useState('2024-01-02');
    const [keteranganAbsen, setKeteranganAbsen] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    console.log(idKelas);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await KelasApi.getKelasByIdKelas(idKelas);
                const { data } = response;
                setSelectedNisn(data.nisnSiswa.map(nisn => ({ value: nisn, label: nisn })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [idKelas]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct keteranganAbsen based on attendance data
        const updatedKeteranganAbsen = selectedNisn
            .map(student => {
                const { value, attendance } = student;
                const { hadir, izin, sakit } = attendance;

                let status = '';
                if (hadir) {
                    status = 'Hadir';
                } else if (izin) {
                    status = 'Izin';
                } else if (sakit) {
                    status = 'Sakit';
                }

                return `${value}: ${status}`;
            })
            .join('\n');

        try {
            const response = await axios.post(`http://localhost:8083/api/absensi/create/${idKelas}`, {
                tanggalAbsen,
                keteranganAbsen: updatedKeteranganAbsen,
            });
            console.log('Response:', response);
            setShowSuccess(true);
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
        updatedNisnList[index].attendance = {
            hadir: type === 'hadir',
            izin: type === 'izin',
            sakit: type === 'sakit',
            absen: type === 'absen',
        };
        setSelectedNisn(updatedNisnList);
    };

    return (
        <div className="bg-white dark:bg-gray-950">
            <Layout>
                <div className="container px-4 md:px-6 mx-auto py-16 md:py-24 lg:py-32">
                    <div className="max-w-lg mx-auto">
                        <h1 className="text-3xl md:text-4xl font-extrabold font-nunito-sans text-center mb-4">Tambahkan absensi baru</h1>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center mb-8">
                            Masukkan informasi absensi di sini.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-4">
                                <label htmlFor="tanggalAbsen" className="block text-sm font-medium">Tanggal absen:</label>
                                <input
                                    type="date"
                                    id="tanggalAbsen"
                                    name="tanggalAbsen"
                                    value={tanggalAbsen}
                                    onChange={(e) => setTanggalAbsen(e.target.value)}
                                    className="block w-full px-3 py-2 mt-1 text-sm md:text-base text-gray-700 border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="keteranganAbsen" className="block text-sm font-medium">Keterangan Absen:</label>
                                <textarea
                                    id="keteranganAbsen"
                                    name="keteranganAbsen"
                                    value={keteranganAbsen}
                                    onChange={(e) => setKeteranganAbsen(e.target.value)}
                                    className="block w-full px-3 py-2 mt-1 text-sm md:text-base text-gray-700 border rounded-lg focus:outline-none"
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
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none"
                            >
                                Tambahkan absensi
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