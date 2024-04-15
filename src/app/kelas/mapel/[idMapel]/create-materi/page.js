"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';

const FormCreateMateri = ({ params }) => {
    const { idMapel } = params;
    const [judulKonten, setJudulKonten] = useState('');
    const [isiKonten, setIsiKonten] = useState('');
    const [file, setFile] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!judulKonten) {
            alert("Judul konten tidak boleh kosong");
            return;
        }
        if (!isiKonten && !file) {
            alert("Isi konten atau file harus diisi minimal salah satu");
            return;
        }
        const formData = new FormData();
        formData.append('judulKonten', judulKonten);
        formData.append('isiKonten', isiKonten);
        formData.append('file', file);

        try {
            const response = await axios.post(`http://localhost:8083/api/kelas/${idMapel}/create-materi`, formData, {
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

    return (
        <div className="bg-white dark:bg-gray-950">
            <Navbar/>
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
                <input type="text" value={judulKonten} onChange={(e) => setJudulKonten(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: '#333' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#333', fontWeight: 'bold' }}>Isi materi:</label>
                <textarea value={isiKonten} onChange={(e) => setIsiKonten(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: '#333' }} />
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
        <Footer/>
        </div>
    );
};

export default FormCreateMateri;
