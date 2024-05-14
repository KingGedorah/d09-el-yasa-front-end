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
    const [filePreview, setFilePreview] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
            const decoded = parseJwt(token);
            setDecodedToken(decoded);
            setId(decoded.id);
        } else {
            redirect('/user/login');
        }
    }, []);

    useEffect(() => {
        if (decodedToken) {
            if (decodedToken.role === 'GURU') {
                // Authorized
            } else {
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
            setIsSuccess(true);
            setJudulKonten('');
            setIsiKonten('');
            setFile(null);
            setFilePreview(null);
            document.getElementById("fileInput").value = null;
            setShowModal(true); // Menampilkan modal setelah sukses
        } catch (error) {
            console.log('Error creating materi', error);
            setIsError(true);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFilePreview(null);
        // Clear the file input field
        document.getElementById("fileInput").value = null;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        if (file && file.type === "application/pdf") {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFilePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="bg-white min-h-screen flex flex-col justify-between">
            {decodedToken && decodedToken.role === 'GURU' && <Navbarguru role={id} />}
            <div className="flex-grow flex items-center justify-center py-16 md:py-24 lg:py-32">
                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-extrabold font-nunito-sans">Tambahkan Materi</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
                            Masukkan informasi materi di sini.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 border-2 border-gray-300 rounded-lg shadow-lg space-y-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Judul Materi:</label>
                            <input
                                required
                                type="text"
                                value={judulKonten}
                                onChange={(e) => setJudulKonten(e.target.value)}
                                placeholder="Masukkan judul materi"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Isi Materi:</label>
                            <textarea
                                required
                                value={isiKonten}
                                onChange={(e) => setIsiKonten(e.target.value)}
                                placeholder="Masukkan isi materi"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Upload File (maks 1 MB):</label>
                            <input
                                id="fileInput"
                                type="file"
                                onChange={handleFileChange}
                                accept=".ppt,.pptx,.doc,.docx,.pdf,.xls,.xlsx"
                                className="block w-full text-gray-700 mb-2"
                            />
                            {file && (
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-gray-700">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="bg-red-500 text-white rounded-md px-3 py-1"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            )}
                            {filePreview && (
                                <div className="mt-4">
                                    <iframe src={filePreview} width="100%" height="500px" className="border rounded-md"></iframe>
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Tambah Materi
                            </button>
                        </div>
                        {isSuccess && <p className="text-green-500 mt-4 font-bold">Materi berhasil dibuat</p>}
                        {isError && <p className="text-red-500 mt-4 font-bold">Terjadi kesalahan saat membuat materi</p>}
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
