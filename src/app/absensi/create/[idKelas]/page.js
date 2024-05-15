"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as KelasApi from '../../../api/kelas';
import Layout from '@/app/components/layout';
import { useRouter } from 'next/navigation';
import SpinLoading from '@/app/components/spinloading';
import { parseJwt } from '@/app/utils/jwtUtils';
import Navbarguru from '@/app/components/navbarguru';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import Navbarmurid from '@/app/components/navbarmurid';

const CreateAbsensiForm = ({ params }) => {
    const [id, setId] = useState('');
    const { idKelas } = params;
    const [selectedNisn, setSelectedNisn] = useState([]);
    const [tanggalAbsen, setTanggalAbsen] = useState('');
    const [keteranganAbsen, setKeteranganAbsen] = useState('');
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const router = useRouter()
    const [decodedToken, setDecodedToken] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await KelasApi.getKelasByIdKelas(idKelas);
                const { data } = response;
                setSelectedNisn(data.nisnSiswa.map(nisn => ({ value: nisn, label: nisn })));
                setLoading(false);
            } catch (error) {
                router.push(`/error/500`);
            }
        };

        fetchData();
    }, [idKelas]);

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

                return `${status}`;
            })

        try {
            const response = await axios.post(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/absensi/create/${idKelas}`, {
                tanggalAbsen: new Date(tanggalAbsen),
                keteranganAbsen: updatedKeteranganAbsen,
            });
            console.log('Response:', response);
            setShowSuccess(true);
            router.push(`/absensi/${idKelas}`)
        } catch (error) {
            console.error('Error:', error);
            window.alert('Periksa kembali inputan anda');
        }
    };

    const handleCloseErrorPopup = () => {
        setErrorPopup(false);
    };

    if (loading) {
        return <SpinLoading />;
    }

    const handleAttendanceChange = (index, type) => {
        const updatedNisnList = [...selectedNisn];
        console.log(updatedNisnList);
        updatedNisnList[index].attendance = {
            hadir: type === 'hadir',
            izin: type === 'izin',
            sakit: type === 'sakit',
        };
        setSelectedNisn(updatedNisnList);
    };

    return (
        <div className="bg-[#F3F5FB]">
            {decodedToken && decodedToken.role === 'STAFF' && <Navbar role={id} />}
            {decodedToken && decodedToken.role === 'GURU' && <Navbarguru role={id} />}
            {decodedToken && decodedToken.role === 'MURID' && <Navbarmurid role={id} />}
                <div className="container px-4 md:px-6 mx-auto py-16 md:py-24 lg:py-32">
                    <div className="max-w-lg mx-auto">
                        <h1 className="text-3xl md:text-4xl font-extrabold font-nunito-sans text-center mb-4">Create Attendance</h1>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center mb-8">
                            Insert attendance information
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-4">
                                <label htmlFor="tanggalAbsen" className="block text-sm font-medium">Date</label>
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
                                        {selectedNisn.sort((a, b) => a.value - b.value).map((siswa, index) => (
                                            <tr key={siswa.value}>
                                                <td className="p-2 border border-gray-300">{index + 1}</td>
                                                <td className="p-2 border border-gray-300">{siswa.value}</td>
                                                <td className="p-2 border-t border-b border-gray-300">
                                                    <input
                                                        type="radio"
                                                        name={`attendance_${index}`}
                                                        checked={siswa.attendance?.hadir === true}
                                                        onChange={() => handleAttendanceChange(index, 'hadir')}
                                                    />
                                                </td>
                                                <td className="p-2 border border-gray-300">
                                                    <input
                                                        type="radio"
                                                        name={`attendance_${index}`}
                                                        checked={siswa.attendance?.izin === true}
                                                        onChange={() => handleAttendanceChange(index, 'izin')}
                                                    />
                                                </td>
                                                <td className="p-2 border border-gray-300">
                                                    <input
                                                        type="radio"
                                                        name={`attendance_${index}`}
                                                        checked={siswa.attendance?.sakit === true}
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
                                className="w-full py-2 px-4 bg-[#6C80FF]  hover:bg-indigo-600 text-white rounded-lg focus:outline-none"
                            >
                                Create Attendance
                            </button>
                            <button
                                type='button'
                                onClick={() => router.back()}
                                className="w-full py-2 px-4 bg-white hover:bg-gray-200 text-red-500 border-red-500 border-[1px] rounded-lg focus:outline-none"
                            >
                                Cancel
                            </button>
                            {showSuccess && (
                                <p className="text-green-500 dark:text-green-400 text-center mt-2">Attendance created succesfully</p>
                            )}
                        </form>
                    </div>
                </div>
                <Footer/>
        </div>
    );
};

export default CreateAbsensiForm;