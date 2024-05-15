"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import Sidebar from '@/app/components/sidebar';
import * as KelasApi from '../../../api/kelas';
import * as UserApi from '../../../api/user';
import axios from 'axios';
import SpinLoading from '@/app/components/spinloading';
import { useRouter } from 'next/navigation';
import { AiOutlineWarning } from 'react-icons/ai';
import { parseJwt } from '@/app/utils/jwtUtils';
import Navbarmurid from '@/app/components/navbarmurid';
import Navbarguru from '@/app/components/navbarguru';
import Link from 'next/link';
import FadeIn from '@/app/components/fadein-div';
import Chart from 'chart.js/auto';

const DetailMapel = ({ params }) => {
  const router = useRouter();
  const [materiId, setMateriId] = useState(null);
  const [decodedToken, setDecodedToken] = useState('');
  const { idMapel } = params;
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [materiInfo, setMateriInfo] = useState([]);
  const [mapelInfo, setMapelInfo] = useState('');
  const [scoreInfo, setScoreInfo] = useState([]);
  const [materiFetched, setMateriFetched] = useState(false);
  const [nilaiFetched, setNilaiFetched] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isErrorDelete, setIsErrorDelete] = useState(false);
  const [activeTab, setActiveTab] = useState('materi');
  const [chartData, setChartData] = useState({});
  const [scoreMap, setScoreMap] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const decoded = parseJwt(token);
      setDecodedToken(decoded);
    } else {
      redirect('/user/login');
    }
  }, []);

  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role === 'MURID' || decodedToken.role === 'GURU') {
        //Authorized
      } else {
        redirect(`/kelas/myclass`);
      }
    }
  }, [decodedToken]);

  useEffect(() => {
    const fetchMapelInfo = async () => {
      try {
        const mapelData = await KelasApi.getMapelByIdMapel(idMapel);
        setMapelInfo(mapelData.data.idKelas);
        if (mapelData.data.listKontenMapel == null) {
          setLoading(false);
          setMateriInfo([])
        } else {
          const materiPromises = mapelData.data.listKontenMapel.map(async (idMateri) => {
            const materiData = await KelasApi.getMateriByIdMateri(idMateri);
            return materiData.data;
          })
          const materiData = await Promise.all(materiPromises);
          setMateriInfo(materiData);
          setLoading(false);
        }
        setMateriFetched(true);
      } catch (error) {
        router.push(`/error/500`);
      }
    };

    fetchMapelInfo();
  }, [idMapel]);

  useEffect(() => {
    const fetchScoreInfo = async () => {
      if (!decodedToken) {
        return;
      }
      try {
        if (decodedToken.role === "GURU") {
          const response = await UserApi.getScoreByIdMapel(idMapel);
          const promises = response.map(async (score) => {
            const userResponse = await UserApi.getUsersById(score.idSiswa);
            const fullName = `${userResponse.firstname} ${userResponse.lastname}`;
            const averageScore = calculateAverage(score.listNilai);
            return { fullName, idNilai: score.idNilai, averageScore };
          });
          const transformedData = await Promise.all(promises);
          const scoreMap = transformedData.reduce((acc, curr) => {
            acc[curr.fullName] = { idNilai: curr.idNilai, averageScore: curr.averageScore };
            return acc;
          }, {});
          setScoreMap(scoreMap);
        } else {
          const response = await UserApi.getScoreByIdSiswa(decodedToken.id);
          const filteredScoreInfo = response.filter(item => item.idMapel === idMapel);
          setScoreInfo(filteredScoreInfo);
        }
        setNilaiFetched(true);
      } catch (error) {
        setNilaiFetched(true);
        // console.log(error)
        // router.push(`/error/500`);
      }
    };

    fetchScoreInfo();
  }, [idMapel, decodedToken]);

  useEffect(() => {
    if (showGraph && scoreInfo.length > 0) {
      renderChart();
    }
  }, [showGraph, scoreInfo]);

  useEffect(() => {
    renderChart();
  }, []);

  // Fungsi untuk menghapus materi
  const handleDeleteMateri = async (materiId) => {
    try {
      await axios.delete(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/delete/materi/${materiId}`);
    } catch (error) {
      setIsErrorDelete(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await handleDeleteMateri(materiId);
      setShowDeleteConfirmation(false);
      setIsSuccessDelete(true);
    } catch (error) {
      setIsErrorDelete(true);
    }
  }

  const handleSuccessDeletePopup = () => {
    setIsSuccessDelete(false);
    window.location.reload();
  };

  const showConfirmationPopup = (idMateri) => {
    setShowDeleteConfirmation(true);
    setMateriId(idMateri);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleErrorDeletePopUp = () => {
    setIsErrorDelete(false);
  };

  const handleChangeSearchBar = (e) => {
    setQuery(e.target.value);
  };

  const renderChart = () => {
    const canvas = document.getElementById('nilaiChart');
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const labels = [];
    const values = {}; // Initialize values as an empty object
    const counts = {}; // Initialize counts as an empty object to count occurrences

    scoreInfo[0].tipeNilai.forEach((tipe, index) => {
      // Memisahkan nama tipe dan nomor
      const [namaTipe] = tipe.split(' ');

      // Menambahkan nilai ke objek nilai berdasarkan tipe
      if (!values[namaTipe]) {
        values[namaTipe] = scoreInfo[0].listNilai[index];
        counts[namaTipe] = 1; // Initialize count for this type
      } else {
        values[namaTipe] += scoreInfo[0].listNilai[index];
        counts[namaTipe]++; // Increment count for this type
      }
    });

    // Calculate the average values
    Object.keys(values).forEach((tipe) => {
      values[tipe] /= counts[tipe]; // Divide the sum by count to get the average
    });

    // Mendapatkan label dan nilai dari objek nilai
    const dataValues = Object.values(values); // Get the values of the object

    Object.keys(values).forEach((tipe) => {
      labels.push(tipe);
    });

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nilai',
          data: dataValues, // Use dataValues array here
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    setChartData(chart);
  };

  const exportChart = () => {
    const canvas = document.getElementById('nilaiChart');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chart.png';
    link.click();
  };

  const toggleView = () => {
    setShowGraph(!showGraph);
    if (!showGraph) {
      renderChart();
    }
  };

  function calculateAverage(scores) {
    const total = scores.reduce((acc, score) => acc + score, 0);
    return total / scores.length;
  }


  if (!materiFetched || !nilaiFetched) {
    return <SpinLoading />;
  }

  return (
    <FadeIn>
      {decodedToken && decodedToken.role === 'MURID' && <Navbarmurid role={decodedToken.id} />}
      {decodedToken && decodedToken.role === 'GURU' && <Navbarguru role={decodedToken.id} />}
      <div className="container mx-auto flex justify-center mt-8" style={{ marginBottom: '100px' }}>
        <main className="w-4/5 md:w-3/5 lg:w-1/2 p-4">
          <div className="tabs mb-4 flex" style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`tab${activeTab === 'materi' ? ' active' : ''}`}
              onClick={() => setActiveTab('materi')}
              style={{
                padding: '10px 20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: activeTab === 'materi' ? '#007bff' : '#fff',
                color: activeTab === 'materi' ? '#fff' : '#000',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Materi
            </button>
            <button
              className={`tab${activeTab === 'nilai' ? ' active' : ''}`}
              onClick={() => setActiveTab('nilai')}
              style={{
                padding: '10px 20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: activeTab === 'nilai' ? '#007bff' : '#fff',
                color: activeTab === 'nilai' ? '#fff' : '#000',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Nilai
            </button>
          </div>

          {activeTab === 'materi' && (
            <Suspense fallback={<div></div>}>
              <div>
                <div className='relative'>
                  <input onChange={handleChangeSearchBar} type='text' className="border border-[#6C80FF] mb-4 rounded-xl py-3 bg-transparent px-4 w-full focus:outline-none focus:border-blue-500" />
                  <div className='absolute top-[14px] right-4'>
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 0C13.968 0 18 4.032 18 9C18 13.968 13.968 18 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0ZM9 16C12.867 16 16 12.867 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16ZM17.485 16.071L20.314 18.899L18.899 20.314L16.071 17.485L17.485 16.071Z" fill="#6C80FF" />
                    </svg>
                  </div>
                </div>
                {!loading && !error && materiInfo.length > 0 ? (
                  materiInfo
                    .filter((materi) =>
                      materi.judulKonten.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((materi, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-4 flex justify-between items-center">
                        <div className="p-4">
                          <h2 className="text-xl font-bold">{materi.judulKonten}</h2>
                          <h2 className="text-base">{materi.isiKonten}</h2>
                          {materi.nama_file && (
                            <div className="flex items-center">
                              <a href={`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/get/materi/${materi.idKonten}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                <svg className="h-6 w-6 text-blue-500 mr-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path stroke="none" d="M0 0h24v24H0z" />
                                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                  <line x1="12" y1="11" x2="12" y2="17" />
                                  <polyline points="9 14 12 17 15 14" />
                                </svg>
                                <h2 className="text-xs font-bold">{materi.nama_file}</h2>
                              </a>
                            </div>
                          )}
                          <h2 className="text-base">{materi.materiPelajaran}</h2>
                        </div>
                        {decodedToken && decodedToken.role === 'GURU' && (
                          <div className="p-4">
                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => showConfirmationPopup(materi.idKonten)}>Delete</button>
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="flex justify-center items-center h-40 bg-white rounded-lg">
                    <svg className="h-16 w-16 text-gray-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-gray-400 opacity-50 ml-4">Tidak ada materi yang ditemukan</p>
                  </div>
                )}
              </div>
            </Suspense>
          )}
          {activeTab === 'nilai' && (
            <div>
              <h2 className="text-2xl font-bold">Nilai</h2>
              {decodedToken.role === "MURID" && scoreInfo.length > 0 && (
                <div>
                  <button onClick={toggleView} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {showGraph ? 'Tampilkan Tabel' : 'Tampilkan Grafik'}
                  </button>
                  {showGraph && (
                    <div>
                      <div className="flex justify-end mb-4">
                        <button onClick={exportChart} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mr-2 flex items-center">
                          <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 4.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L11 10.414V15a1 1 0 11-2 0v-4.586l-1.293 1.293a1 1 0 01-1.414-1.414l5-5zM9 3a1 1 0 00-1 1v6a1 1 0 102 0V4a1 1 0 00-1-1z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Export Chart
                        </button>
                      </div>
                      <canvas id="nilaiChart" width="400" height="400"></canvas>
                    </div>
                  )}
                  {!showGraph && (
                    <div>
                      {scoreInfo.length > 0 ? (
                        <div>
                          {scoreInfo.map((info, index) => (
                            <div key={index}>
                              <h3 className="text-lg font-bold mt-4">{info.namaMataPelajaran}</h3>
                              <table className="min-w-full bg-white border border-gray-200 mt-2">
                                <thead>
                                  <tr>
                                    <th className="py-2 px-4 border-b">Tipe Nilai</th>
                                    <th className="py-2 px-4 border-b">Nilai</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {info.tipeNilai.map((tipe, idx) => (
                                    <tr key={idx}>
                                      <td className="py-2 px-4 border-b text-center">{tipe}</td>
                                      <td className="py-2 px-4 border-b text-center">{info.listNilai[idx]}</td>
                                    </tr>
                                  ))}
                                  <tr>
                                    <td className="py-2 px-4 border-b text-center font-bold">Rata-rata</td>
                                    <td className="py-2 px-4 border-b text-center font-bold">{calculateAverage(info.listNilai)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 text-gray-600">No Scores available</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {decodedToken.role === "MURID" && scoreInfo.length == 0 && (
                <p className="mt-4 text-gray-600">No Scores available</p>
              )}
              {decodedToken.role === "GURU" && scoreMap && (
                <div>
                  <table className="min-w-full bg-white border border-gray-200 mt-2">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Full Name</th>
                        <th className="py-2 px-4 border-b">Average Score</th>
                        <th className="py-2 px-4 border-b">Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoreMap &&
                        Object.entries(scoreMap).map(([fullName, { idNilai, averageScore }]) => (
                          <tr key={idNilai}>
                            <td className="py-2 px-4 border-b text-center">{fullName}</td>
                            <td className="py-2 px-4 border-b text-center">{averageScore.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b text-center">
                              <Link legacyBehavior href={`/nilai/update/${idNilai}`}>
                                <a className="text-blue-500 hover:underline text-center">Edit</a>
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
              {decodedToken.role === "GURU" && (!scoreMap || Object.keys(scoreMap).length === 0) && (
                <div>
                  <p>No scores available.</p>
                </div>
              )}
            </div>
          )}
        </main>
        <div className='flex flex-col gap-4'>
          {decodedToken.role === "GURU" && activeTab === 'materi' && (
            <Link href={`/kelas/mapel/${idMapel}/create-materi`} className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'
              onMouseEnter={(event) => event.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(event) => event.target.style.transform = 'scale(1)'}
            >
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.5 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 12H16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Post Materi
            </Link>
          )}
          {decodedToken.role === "GURU" && activeTab === 'nilai' && (
            <Link href={`/kelas/${mapelInfo}/input-score`} className='flex gap-4 text-white bg-[#6C80FF] text-center justify-center px-5 py-3 rounded-3xl'
              onMouseEnter={(event) => event.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(event) => event.target.style.transform = 'scale(1)'}
            >
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.5 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 12H16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Tambahkan Nilai
            </Link>
          )}
          <Sidebar />
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
            <p className="text-red-600 font-semibold mb-4 flex items-center">
              <AiOutlineWarning className="mr-2" />
              Apakah Anda yakin ingin menghapus materi ini?
            </p>
            <p className="text-red-600 font-semibold mb-4">Materi yang ada tidak dapat dipulihkan kembali!</p>
            <div className="flex">
              <button onClick={confirmDelete} className="bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600 transition duration-300">
                Delete
              </button>
              <button onClick={handleCloseDeleteConfirmation} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 flex items-center justify-center mx-auto">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
            <p className="text-green-600 font-semibold mb-4">Materi berhasil dihapus!</p>
            <button onClick={handleSuccessDeletePopup} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}

      {isErrorDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute flex flex-col items-center justify-center">
            <p className="text-green-600 font-semibold mb-4">Terjadi kesalahan pada server coba lagi nanti</p>
            <button onClick={handleErrorDeletePopUp} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}

      <Footer />
    </FadeIn>
  );
};

export default DetailMapel;
