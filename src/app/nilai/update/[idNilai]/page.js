"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { parseJwt } from "@/app/utils/jwtUtils";
import FadeIn from "@/app/components/fadein-div";
import Footer from "@/app/components/footer";
import Navbarguru from "@/app/components/navbarguru";

const InputNilaiForm = ({ params }) => {
    const [id, setId] = useState('');
    const { idNilai } = params;
    const [decodedToken, setDecodedToken] = useState(null);
    const router = useRouter();
    const [idMapel, setIdMapel] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [idSiswa, setIdSiswa] = useState(undefined);
    const [nilaiData, setNilaiData] = useState({
        tipeNilai: [],
        listNilai: [],
    });

    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
            const decoded = parseJwt(token);
            setDecodedToken(decoded);
            setId(decoded.id);
        } else {
            console.log("No token found, redirecting to login");
            router.push('/user/login');
        }
    }, [router]);

    useEffect(() => {
        if (decodedToken) {
            if (decodedToken.role === 'GURU') {
                // Authorized
            } else {
                console.log("Unauthorized role, redirecting");
                router.push(`/kelas/mapel/${idMapel}`);
            }
        }
    }, [decodedToken, router]);

    useEffect(() => {
        const fetchScoreData = async (idScore) => {
            try {
                const res = await axios.get(
                    `https://myjisc-user-c9e48ced667a.herokuapp.com/api/score/${idScore}`
                );
                return res.data;
            } catch (err) {
                throw new Error("Failed to fetch score data");
            }
        };

        fetchScoreData(idNilai)
            .then((res) => {
                setNilaiData({
                    tipeNilai: res.data.tipeNilai,
                    listNilai: res.data.listNilai,
                });
                setIdMapel(res.data.idMapel);
                setIdSiswa(res.data.idSiswa);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    }, [idNilai]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (name === "listNilai") {
            const updatedListNilai = [...nilaiData.listNilai];
            updatedListNilai[index] = value;
            setNilaiData({
                ...nilaiData,
                listNilai: updatedListNilai,
            });
        } else if (name === "tipeNilai") {
            const updatedTipeNilai = [...nilaiData.tipeNilai];
            updatedTipeNilai[index] = value;
            setNilaiData({
                ...nilaiData,
                tipeNilai: updatedTipeNilai,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `https://myjisc-user-c9e48ced667a.herokuapp.com/api/score/update/${idNilai}`,
                nilaiData
            );
            console.log("Nilai submitted successfully");
            router.push(`/kelas/mapel/${idMapel}`); // Use idMapel in navigation
        } catch (error) {
            console.error("Failed to submit nilai:", error);
        }
    };


    if (isLoading) return "Loading ...";

    return (
        <FadeIn>
            <div>
                {decodedToken && decodedToken.role === 'GURU' && <Navbarguru role={id} />}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", marginBottom: '100px' }}>
                <form onSubmit={handleSubmit} style={{ textAlign: "center", width: '80%', maxWidth: '600px' }}>
                    <table style={{ borderCollapse: "collapse", width: "100%", borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ padding: "12px", border: "1px solid #ddd", color: "black" }}>Tipe</th>
                                <th style={{ padding: "12px", border: "1px solid #ddd", color: "black" }}>Nilai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nilaiData.tipeNilai.map((tipe, index) => (
                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}>
                                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                        <input
                                            type="text"
                                            name="tipeNilai"
                                            value={nilaiData.tipeNilai[index]}
                                            onChange={(e) => handleChange(e, index)}
                                            style={{ color: "black", width: "100%", border: "none", outline: "none", textAlign: "center", padding: "8px 10px" }}
                                        />
                                    </td>
                                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                                        <input
                                            type="text"
                                            name="listNilai"
                                            value={nilaiData.listNilai[index]}
                                            onChange={(e) => handleChange(e, index)}
                                            style={{ color: "black", width: "100%", border: "none", outline: "none", textAlign: "center", padding: "8px 10px" }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
                        <button
                            type="button"
                            onClick={() =>
                                setNilaiData((prev) => ({
                                    tipeNilai: [...prev.tipeNilai, ""],
                                    listNilai: [...prev.listNilai, ""],
                                }))
                            }
                            style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", marginBottom: "10px" }}
                        >
                            Tambah Baris Baru
                        </button>
                        <button
                            type="submit"
                            style={{ backgroundColor: "#28a745", color: "white", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", marginBottom: "10px" }}
                        >
                            Update Nilai
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push(`/nilai/${idSiswa}`)}
                            style={{ backgroundColor: "#dc3545", color: "white", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}
                        >
                            Kembali
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </FadeIn>

    );

};

export default InputNilaiForm;
