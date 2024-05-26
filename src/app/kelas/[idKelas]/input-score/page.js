"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Footer from '@/app/components/footer';
import Navbar from '@/app/components/navbar';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUsersById } from '@/app/api/user';
import { getKelasByIdKelas, getMapelByIdMapel } from '@/app/api/kelas';
import { parseJwt } from '@/app/utils/jwtUtils';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';


const FormInputScore = ({ params }) => {
    const router = useRouter();
    const { idKelas } = params;
    const [id, setId] = useState('');
    const [role, setRole] = useState('');
    const [decodedToken, setDecodedToken] = useState('');
    const [tipeNilai, setTipeNilai] = useState([]);
    const [listNilai, setListNilai] = useState([]);
    const [kelasInfo, setKelasInfo] = useState([]);
    const [nisnOptions, setNisnOptions] = useState(null);
    const [nisnFetched, setNisnFetched] = useState(null);
    const [selectedNisn, setSelectedNisn] = useState(null);
    const [mapelOptions, setMapelOptions] = useState(null);
    const [mapelFetched, setMapelFetched] = useState(null);
    const [selectedMapel, setSelectedMapel] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const baseUrlUser = process.env.NEXT_PUBLIC_BASE_USER_API


    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
            decoded = parseJwt(token);
            setDecodedToken(decoded);
            setId(decoded.id);
            setRole(decoded.role);
        } else {
            redirect('/user/login');
        }
    }, []);

    useEffect(() => {
        if (decodedToken) {
            if (decodedToken.role === 'GURU') {
                //Authorized
            } else {
                redirect(`/kelas/${idKelas}`);
            }
        }
    }, [decodedToken]);

    useEffect(() => {
        const fetcKelasInfo = async () => {
            try {
                const response = await getKelasByIdKelas(idKelas);
                setKelasInfo(response.data);
            } catch (error) {
                // router.push(`/error/500`);
            }
        };

        fetcKelasInfo();
    }, []);

    useEffect(() => {
        const fetchNisnOptions = async () => {
            try {
                const options = [];
                for (const id of kelasInfo.nisnSiswa) {
                    const user = await getUsersById(id);
                    options.push({ label: `${user.firstname} ${user.lastname}`, value: user.id });
                }
                setNisnOptions(options);
                setNisnFetched(true);
            } catch (error) {
                // router.push(`/error/500`);
                console.log(error);
            }
        };

        fetchNisnOptions();
    }, [kelasInfo]);

    useEffect(() => {
        const fetchMapelOptions = async () => {
            try {
                const options = [];
                for (const id of kelasInfo.listMataPelajaran) {
                    const response = await getMapelByIdMapel(id);
                    const mapel = response.data;
                    options.push({ label: mapel.namaMapel, value: mapel.idMapel });
                }
                setMapelOptions(options);
                setMapelFetched(true);
            } catch (error) {
                // router.push(`/error/500`);
                console.log(error);
            }
        };

        fetchMapelOptions();
    }, [kelasInfo]);

    const handleAddRow = () => {
        setTipeNilai([...tipeNilai, '']);
        setListNilai([...listNilai, '']);
    };

    const handleRemoveRow = (index) => {
        const newTipeNilai = [...tipeNilai];
        const newListNilai = [...listNilai];

        newTipeNilai.splice(index, 1);
        newListNilai.splice(index, 1);

        setTipeNilai(newTipeNilai);
        setListNilai(newListNilai);
    };

    const handleTipeNilaiChange = (index, value) => {
        const newTipeNilai = [...tipeNilai];
        newTipeNilai[index] = value;
        setTipeNilai(newTipeNilai);
    };

    const handleListNilaiChange = (index, value) => {
        const newListNilai = [...listNilai];
        newListNilai[index] = value;
        setListNilai(newListNilai);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi bahwa tidak ada nilai yang kosong
        for (let i = 0; i < tipeNilai.length; i++) {
            if (tipeNilai[i].trim() === '' || listNilai[i] === '') {
                setIsError(true);
                return;
            }
        }

        if (!selectedMapel || !selectedNisn) {
            setIsError(true);
            setErrorMessage('Please select student and subject');
            return;
        }

        try {
            const response = await axios.post(`${baseUrlUser}/score/input`, {
                idSiswa: selectedNisn.value,
                idMapel: selectedMapel.value,
                tipeNilai: tipeNilai,
                listNilai: listNilai
            });

            console.log(response);
            setIsSuccess(true);
        } catch (error) {
            setIsError(true);
            setErrorMessage('Failed to submit scores');
        }
    };

    const handleSuccessPopup = () => {
        setIsSuccess(false);
        router.push(`/kelas/mapel/${idMapel}`)
    };

    const handleErrorPopup = () => {
        setIsError(false);
    };

    if (!nisnFetched || !mapelFetched) {
        return <SpinLoading />;
    }

    return (
        <div className="bg-[#F3F5FB]">
            <Navbar id={id} role={role}/>
            <div className="container mx-auto flex items-center justify-center py-16">
                <div className="w-full max-w-sm space-y-4 bg-white shadow-md rounded-xl px-8 py-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="nisn-siswa" className="inline-block text-sm font-medium overflow-hidden">Students List</label>
                            <Select
                                value={selectedNisn}
                                onChange={(selectedOption) => setSelectedNisn(selectedOption)}
                                options={nisnOptions}
                                isSearchable={true}
                                closeMenuOnSelect={true}
                                className='border-[#6C80FF] border-0 rounded-lg !hover:border-[#6C80FF]'
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderColor: '#6C80FF',
                                        borderRadius: '8px'
                                    }),
                                }}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="mapel" className="inline-block text-sm font-medium overflow-hidden">List Mata Pelajaran</label>
                            <Select
                                value={selectedMapel}
                                onChange={(selectedOption) => setSelectedMapel(selectedOption)}
                                options={mapelOptions}
                                isSearchable={true}
                                closeMenuOnSelect={true}
                                className='border-[#6C80FF] border-0 rounded-lg !hover:border-[#6C80FF]'
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderColor: '#6C80FF',
                                        borderRadius: '8px'
                                    }),
                                }}
                            />
                        </div>

                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2">Tipe Nilai</th>
                                    <th className="py-2">Nilai</th>
                                    <th className="py-2"></th> {/* Column for 'x' button */}
                                </tr>
                            </thead>
                            <tbody>
                                {tipeNilai.map((tipe, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">
                                            <input
                                                required
                                                type="text"
                                                value={tipe}
                                                onChange={(e) => handleTipeNilaiChange(index, e.target.value)}
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                required
                                                type="number"
                                                value={listNilai[index]}
                                                onChange={(e) => handleListNilaiChange(index, e.target.value)}
                                                className="w-full border border-gray-300 rounded-md p-2"
                                                min={0}
                                                max={100}
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <button onClick={() => handleRemoveRow(index)} className="text-red-500 hover:text-red-700">
                                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button type="button" onClick={handleAddRow} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded flex items-center justify-center mx-auto">Add Row</button>

                        <div className="flex gap-4 justify-end mt-4">
                            <Link href={`/kelas/${idKelas}`} className="bg-white border-[1px] border-[#6C80FF] text-[#6C80FF] py-2 px-4 transition duration-300 w-40 rounded-xl text-center">Cancel</Link>
                            <button type="submit" className="bg-[#6C80FF] text-white py-2 px-4 transition duration-300 w-40 rounded-xl">Post</button>
                        </div>
                    </form>
                </div>

                {isSuccess && (
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-8 rounded-lg shadow-md absolute">
                            <p className="text-green-600 font-semibold">Nilai berhasil diinput!</p>
                            <button onClick={handleSuccessPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Tutup</button>
                        </div>
                    </div>
                )}
                {isError && (
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-8 rounded-lg shadow-md absolute">
                            <p className="text-red-600 font-semibold">Gagal memasukkan nilai!</p>
                            <button onClick={handleErrorPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Tutup</button>
                        </div>
                    </div>
                )}
                <Footer />
            </div>
        </div>
    );
};

export default FormInputScore;
