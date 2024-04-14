"use client";

import React, { useState } from 'react';
import axios from 'axios';

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
        <form onSubmit={handleSubmit} style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#333', fontWeight: 'bold' }}>Judul Konten:</label>
                <input type="text" value={judulKonten} onChange={(e) => setJudulKonten(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: '#333' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#333', fontWeight: 'bold' }}>Isi Konten:</label>
                <textarea value={isiKonten} onChange={(e) => setIsiKonten(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: '#333' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#333', fontWeight: 'bold' }}>Upload File:</label>
                <input id="fileInput" type="file" onChange={(e) => setFile(e.target.files[0])} accept=".ppt,.pptx,.doc,.docx,.pdf,.xls,.xlsx" style={{ display: 'block', marginBottom: '8px', color: '#333' }} />
                {file && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#333', marginRight: '10px' }}>{file.name}</span>
                        <button type="button" onClick={handleRemoveFile} style={{ background: '#ff5c5c', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}>X</button>
                    </div>
                )}
            </div>
            <button type="submit" style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px', cursor: 'pointer' }}>Submit</button>
            {isSuccess && <p style={{ color: '#4CAF50', marginTop: '10px', fontWeight: 'bold' }}>Materi berhasil dibuat</p>}
            {isError && <p style={{ color: '#ff5c5c', marginTop: '10px', fontWeight: 'bold' }}>Terjadi kesalahan saat membuat materi</p>}
        </form>
    );
};

export default FormCreateMateri;
