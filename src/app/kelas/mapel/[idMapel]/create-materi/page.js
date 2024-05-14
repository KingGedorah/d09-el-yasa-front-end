"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import { getMapelByIdMapel } from '@/app/api/kelas';
import { redirect } from 'next/navigation';
import { parseJwt } from '@/app/utils/jwtUtils';
import Navbarguru from '@/app/components/navbarguru';

const FormCreateMateri = ({ params }) => {
    const [decodedToken, setDecodedToken] = useState('');
    const [id, setId] = useState('');
    const { idMapel } = params;
    const [judulKonten, setJudulKonten] = useState('');
    const [isiKonten, setIsiKonten] = useState('');
    const [file, setFile] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
            const decoded = parseJwt(token);
            setDecodedToken(decoded);
            setId(decoded.id);
            console.log("id: " + decoded.id);
            console.log("role: " + decoded.role)
        } else {
            console.log("Need to login");
            redirect('/user/login');
        }
    }, []);

    useEffect(() => {
        if (decodedToken) {
            if (decodedToken.role === 'GURU') {
                console.log("Access granted");
            } else {
                console.log("Not authorized");
                redirect(`/kelas/mapel/${idKelas}`);
            }
        }
    }, [decodedToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!judulKonten || (!isiKonten && !file)) {
            setIsError(true);
            return;
        }

        const formData = new FormData();
        formData.append('judulKonten', judulKonten);
        formData.append('isiKonten', isiKonten);
        formData.append('file', file);

        try {
            const response = await axios.post(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/${idMapel}/create-materi`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            setIsSuccess(true);
            setJudulKonten('');
            setIsiKonten('');
            setFile(null);
            document.getElementById("fileInput").value = null;
            setShowModal(true); // Menampilkan modal setelah sukses
        } catch (error) {
            console.log('Error creating materi', error);
            setIsError(true);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        // Clear the file input field
        document.getElementById("fileInput").value = null;
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="bg-white dark:bg-gray-950">
            {decodedToken && decodedToken.role === 'GURU' && <Navbarguru role={id} />} 
            <div className="container px-4 md:px-6 flex items-center justify-center py-16 md:py-24 lg:py-32">
                <div className="w-full max-w-sm space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold font-nunito-sans">Tambahkan materi</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
                            Masukkan informasi materi di sini.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: '#333', fontWeight: 'bold' }}>Judul materi:</label>
                            <input required type="text" value={judulKonten} onChange={(e) => setJudulKonten(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: '#333' }} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: '#333', fontWeight: 'bold' }}>Isi materi:</label>
                            <textarea required value={isiKonten} onChange={(e) => setIsiKonten(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: '#333' }} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: '#333', fontWeight: 'bold' }}>Upload file (maks 1 MB):</label>
                            <input id="fileInput" type="file" onChange={(e) => setFile(e.target.files[0])} accept=".ppt,.pptx,.doc,.docx,.pdf,.xls,.xlsx" style={{ display: 'block', marginBottom: '8px', color: '#333' }} />
                            {file && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#333', marginRight: '10px' }}>{file.name}</span>
                                    <button type="button" onClick={handleRemoveFile} style={{ background: '#ff5c5c', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}>X</button>
                                </div>
                            )}
                        </div>
                        <div className='grid place-items-center'>
                            <button type="submit" style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px', cursor: 'pointer' }}>Tambah materi</button>
                        </div>
                        {isSuccess && <p style={{ color: '#4CAF50', marginTop: '10px', fontWeight: 'bold' }}>Materi berhasil dibuat</p>}
                        {isError && <p style={{ color: '#ff5c5c', marginTop: '10px', fontWeight: 'bold' }}>Terjadi kesalahan saat membuat materi</p>}
                    </form>
                </div>
            </div>
            {showModal && (
                <div id="modal" className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                    <div className="bg-white max-w-xl w-full rounded-md">
                        <div className="p-3 flex items-center justify-between border-b border-b-gray-300">
                            <h3 className="font-semibold text-xl">
                                Berhasil :)
                            </h3>
                            <span className="modal-close cursor-pointer" onClick={closeModal}>×</span>
                        </div>
                        <div className="p-3 border-b border-b-gray-300">
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded relative mt-4" role="alert">
                                <p className="block sm:inline">Materi berhasil dibuat! Kembali ke <a className='font-bold' href={`/kelas/mapel/${idMapel}`}>halaman mata pelajaran</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default FormCreateMateri;
