"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as KelasApi from '../../../api/kelas';
import Layout from '@/app/components/layout';
import { retrieveAbsensiKelas, retrieveDetailAbsensi, updateAbsensi } from '@/app/api/absensi';
import { useRouter } from 'next/navigation';
import { parseJwt } from '@/app/utils/jwtUtils';
import SpinLoading from '@/app/components/spinloading';
import Footer from '@/app/components/footer';
import Navbarguru from '@/app/components/navbarguru';
import Navbar from '@/app/components/navbar';

const UpdateAbsensiForm = ({ params }) => {
    const [id, setId] = useState('');
    const { idAbsen } = params;
    const [selectedNisn, setSelectedNisn] = useState([]);
    const [tanggalAbsen, setTanggalAbsen] = useState('2024-01-02');
    const [keteranganAbsen, setKeteranganAbsen] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [dataAbsensi, setDataAbsensi] = useState(undefined);
    const router = useRouter();
    // const decodedToken = parseJwt(sessionStorage.getItem('jwtToken'));
    const [decodedToken, setDecodedToken] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
            const decoded = parseJwt(token);
            setDecodedToken(decoded);
            setId(decoded.id);
            console.log(decoded.role)
        } else {
            redirect('/user/login');
        }
    }, []);

    useEffect(() => {
        if (decodedToken) {
            if (decodedToken.role === 'GURU' || decodedToken.role === 'STAFF') {
                // Authorized
            } else {
                console.log("Not authorized");
                redirect(`/absensi/${idKelas}`);
            }
        }
    }, [decodedToken]);

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
                setLoading(false);
            } catch (error) {
                router.push(`/error/500`);
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

    if (loading) {
        return <SpinLoading />;
    }

    return (
        <div className="bg-[#F3F5FB]">
            {decodedToken && decodedToken.role === 'STAFF' && <Navbar role={id} />}
            {decodedToken && decodedToken.role === 'GURU' && <Navbarguru role={id} />}
                <div className="container px-4 md:px-6 mx-auto py-16 md:py-24 lg:py-32">
                    <div className="max-w-lg mx-auto">
                        <h1 className="text-3xl md:text-4xl font-extrabold font-nunito-sans text-center mb-4">Update Attendance</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-4">
                                <label htmlFor="tanggalAbsen" className="block text-sm font-medium">Date</label>
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
                                <table className="w-full border-collapse border border-gray-300 text-center">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-2 border border-gray-300">No.</th>
                                            <th className="p-2 border border-gray-300">NISN</th>
                                            <th className="p-2 border border-gray-300">Present</th>
                                            <th className="p-2 border border-gray-300">Permitted</th>
                                            <th className="p-2 border border-gray-300">Sick</th>
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
                                    className="w-full py-2 px-4 bg-[#6C80FF] hover:bg-indigo-600 text-white rounded-lg focus:outline-none"
                                >
                                    Update attendance
                                </button>
                            )}
                            <button
                                type='button'
                                onClick={() => router.back()}
                                className="w-full py-2 px-4 bg-white hover:bg-gray-200 text-red-500 border-red-500 border-[1px] rounded-lg focus:outline-none"
                            >
                                Cancel
                            </button>
                            {showSuccess && (
                                <p className="text-green-500 dark:text-green-400 text-center mt-2">Attendance updated succesfully</p>
                            )}
                        </form>
                    </div>
                </div>
            <Footer/>
        </div>
    );
};

export default UpdateAbsensiForm;