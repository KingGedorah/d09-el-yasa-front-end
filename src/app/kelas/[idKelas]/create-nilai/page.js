"use client";

// src/app/kelas/[idKelas]/create-nilai/page.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Sidebar from "@/app/components/sidebar";
import { parseJwt } from "@/app/utils/jwtUtils";
import { useRouter } from 'next/navigation';

const InputNilai = () => {
  const router = useRouter();
  const [idKelas, setIdKelas] = useState(null);

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentIds, setStudentIds] = useState([]);
  const [subjectIds, setSubjectIds] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [scores, setScores] = useState({
    tipeNilai: Array(6).fill(""),
    listNilai: Array(6).fill(""),
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    // Check if the router and router.query objects are available
    if (router && router.query && router.query.idKelas) {
      setIdKelas(router.query.idKelas);
    }
  }, [router]); 

  const fetchKelasData = async () => {
    try {
      const response = await axios.get(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/${idKelas}`);
      const { nisnSiswa, listMataPelajaran } = response.data.data;
      setStudentIds(nisnSiswa);
      setSubjectIds(listMataPelajaran);
    } catch (error) {
      setError("Failed to fetch kelas data");
      console.error("Error fetching kelas data:", error);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setScores((prevScores) => ({
      ...prevScores,
      [name]: prevScores[name].map((val, i) => (i === index ? value : val)),
    }));
  };

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
      setDecodedToken(parseJwt(token));
    } else {
      console.log("Need to login");
      router.push("/user/login");
    }
  }, [router]);

  useEffect(() => {
    if (decodedToken) {
      if (decodedToken.role === "GURU") {
        console.log("Access granted");
      } else {
        console.log("Not authorized");
        router.push(`/kelas/${idKelas}`);
      }
    }
  }, [decodedToken, router, idKelas]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, subjectsData] = await Promise.all([
          axios.get("https://myjisc-user-e270dbbfd631.herokuapp.com/api/user/get-all-murid"),
          axios.get(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/mapel/${idMapel}`),
        ]);
        setStudents(studentsData.data);
        setSubjects(subjectsData.data);
        await fetchKelasData();
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [idMapel, idKelas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        tipeNilai: scores.tipeNilai,
        listNilai: scores.listNilai.map(Number),
        idSiswa: selectedStudent,
        idMapel: selectedSubject,
      };
      await axios.post("https://myjisc-user-e270dbbfd631.herokuapp.com/api/score/input", requestData);
      console.log("Nilai submitted successfully");
    } catch (error) {
      setError("Failed to submit nilai");
      console.error("Failed to submit nilai:", error);
    }
  };

  useEffect(() => {
    const filterStudents = students.filter((student) =>
      studentIds.includes(student.nisn)
    );
    const filterSubjects = subjects.filter((subject) =>
      subjectIds.includes(subject.id)
    );
    setStudents(filterStudents);
    setSubjects(filterSubjects);
  }, [students, subjects, studentIds, subjectIds]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      <Sidebar />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
          <div>
            <label htmlFor="student">Student:</label>
            <select id="student" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subject">Subject:</label>
            <select id="subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <table style={{ width: "70%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "12px", border: "1px solid #ddd", color: "black" }}>Tipe</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", color: "black" }}>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {scores.tipeNilai.map((tipe, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <input
                      type="text"
                      name="tipeNilai"
                      value={scores.tipeNilai[index]}
                      onChange={(e) => handleChange(e, index)}
                      style={{ color: "black", width: "90%", border: "none", outline: "none", textAlign: "center" }}
                    />
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <input
                      type="text"
                      name="listNilai"
                      value={scores.listNilai[index]}
                      onChange={(e) => handleChange(e, index)}
                      style={{ color: "black", width: "90%", border: "none", outline: "none", textAlign: "center" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="submit"
            style={{
              marginTop: "20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit Nilai
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default InputNilai;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "@/app/components/navbar";
// import Footer from "@/app/components/footer";
// import Sidebar from "@/app/components/sidebar";
// import { getUsersById } from "@/app/api/user";
// import { getMapelByIdMapel } from "@/app/api/kelas";
// import { parseJwt } from "@/app/utils/jwtUtils";
// // import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

// const InputNilai = () => {
//   const router = useRouter();
//   const { idKelas } = router.query; // Get idKelas from the URL

//   const [students, setStudents] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [studentIds, setStudentIds] = useState([]);
//   const [subjectIds, setSubjectIds] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [scores, setScores] = useState({
//     tipeNilai: Array(6).fill(""),
//     listNilai: Array(6).fill(""),
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [decodedToken, setDecodedToken] = useState(null);

//   const fetchKelasData = async () => {
//     try {
//       const response = await axios.get(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/${idKelas}`);
//       const { nisnSiswa, listMataPelajaran } = response.data.data;
//       setStudentIds(nisnSiswa);
//       setSubjectIds(listMataPelajaran);
//     } catch (error) {
//       setError("Failed to fetch kelas data");
//       console.error("Error fetching kelas data:", error);
//     }
//   };

//   const handleChange = (e, index) => {
//     const { name, value } = e.target;
//     setScores((prevScores) => ({
//       ...prevScores,
//       [name]: prevScores[name].map((val, i) => (i === index ? value : val)),
//     }));
//   };

//   useEffect(() => {
//     const token = sessionStorage.getItem("jwtToken");
//     if (token) {
//       setDecodedToken(parseJwt(token));
//     } else {
//       console.log("Need to login");
//       router.push("/user/login");
//     }
//   }, [router]);

//   useEffect(() => {
//     if (decodedToken) {
//       if (decodedToken.role === "GURU") {
//         console.log("Access granted");
//       } else {
//         console.log("Not authorized");
//         router.push(`/kelas/${idKelas}`);
//       }
//     }
//   }, [decodedToken, router, idKelas]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // const jwtToken = sessionStorage.getItem("jwtToken");
//         const [studentsData, subjectsData] = await Promise.all([
//           axios.get("https://myjisc-user-e270dbbfd631.herokuapp.com/api/user/get-all-murid"),
//           axios.get(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/kelas/mapel/${idMapel}`),
//         ]);
//         setStudents(studentsData.data);
//         setSubjects(subjectsData.data);
//         await fetchKelasData(); // Call the new function here
//         setLoading(false);
//       } catch (error) {
//         setError("Failed to fetch data");
//         console.error("Error fetching data:", error);
//       }
//     };
  
//     fetchData();
//   }, [idMapel, idKelas]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const requestData = {
//         tipeNilai: scores.tipeNilai,
//         listNilai: scores.listNilai.map(Number),
//         idSiswa: selectedStudent,
//         idMapel: selectedSubject,
//       };
//       await axios.post("https://myjisc-user-e270dbbfd631.herokuapp.com/api/score/input", requestData);
//       console.log("Nilai submitted successfully");
//     } catch (error) {
//       setError("Failed to submit nilai");
//       console.error("Failed to submit nilai:", error);
//     }
//   };

//   useEffect(() => {
//     const filterStudents = students.filter((student) =>
//       studentIds.includes(student.nisn)
//     );
//     const filterSubjects = subjects.filter((subject) =>
//       subjectIds.includes(subject.id)
//     );
//     setStudents(filterStudents);
//     setSubjects(filterSubjects);
//   }, [students, subjects, studentIds, subjectIds]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <>
//       <Navbar />
//       <Sidebar />
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
//         <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
//           <div>
//             <label htmlFor="student">Student:</label>
//             <select id="student" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
//               <option value="">Select Student</option>
//               {students.map((student) => (
//                 <option key={student.id} value={student.id}>
//                   {student.firstName} {student.lastName}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="subject">Subject:</label>
//             <select id="subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
//               <option value="">Select Subject</option>
//               {subjects.map((subject) => (
//                 <option key={subject.id} value={subject.id}>
//                   {subject.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <table style={{ width: "70%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#f2f2f2" }}>
//                 <th style={{ padding: "12px", border: "1px solid #ddd", color: "black" }}>Tipe</th>
//                 <th style={{ padding: "12px", border: "1px solid #ddd", color: "black" }}>Nilai</th>
//               </tr>
//             </thead>
//             <tbody>
//               {scores.tipeNilai.map((tipe, index) => (
//                 <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}>
//                   <td style={{ padding: "12px", border: "1px solid #ddd" }}>
//                     <input
//                       type="text"
//                       name="tipeNilai"
//                       value={scores.tipeNilai[index]}
//                       onChange={(e) => handleChange(e, index)}
//                       style={{ color: "black", width: "90%", border: "none", outline: "none", textAlign: "center" }}
//                     />
//                   </td>
//                   <td style={{ padding: "12px", border: "1px solid #ddd" }}>
//                     <input
//                       type="text"
//                       name="listNilai"
//                       value={scores.listNilai[index]}
//                       onChange={(e) => handleChange(e, index)}
//                       style={{ color: "black", width: "90%", border: "none", outline: "none", textAlign: "center" }}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <button
//             type="submit"
//             style={{
//               marginTop: "20px",
//               backgroundColor: "#007bff",
//               color: "white",
//               border: "none",
//               padding: "10px 20px",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Submit Nilai
//           </button>
//         </form>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default InputNilai;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from '@/app/components/navbar';
// import Footer from '@/app/components/footer';
// import Sidebar from '@/app/components/sidebar';
// import { getUsersById } from '@/app/api/user';
// import { getMapelByIdMapel } from '@/app/api/kelas';
// import { parseJwt } from '@/app/utils/jwtUtils';
// import { useRouter } from 'next/navigation';

// // const fetchUserScores = async (IdUser) => {
// //     try {
// //         const response = await axios.get(`https://myjisc-user-e270dbbfd631.herokuapp.com/api/score/view-all/siswa/${IdUser}`);
// //         return response.data;
// //     } catch (error) {
// //         throw new Error('Failed to fetch user scores');
// //     }
// //     };

// const InputNilai = ({ }) => {
//     const router = useRouter()
//     const [students, setStudents] = useState([]);
//     const [subjects, setSubjects] = useState([]);
//     const [selectedStudent, setSelectedStudent] = useState('');
//     const [selectedSubject, setSelectedSubject] = useState('');
//     // const { IdKelas } = params;
//     const [scores, setScores] = useState({
//         tipeNilai: ["", "", "", "", "", ""], // Initialize with empty strings
//         listNilai: ["", "", "", "", "", ""] // Initialize with empty strings
//       });
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [decodedToken, setDecodedToken] = useState(null);

//     const handleChange = (e, index) => {
//         const { name, value } = e.target;
//         if (name === "listNilai") {
//           const updatedListNilai = [...scores.listNilai];
//           updatedListNilai[index] = value; // Directly set the value typed by the user
//           setNilaiData({
//             ...scores,
//             listNilai: updatedListNilai
//           });
//         } else if (name === "tipeNilai") {
//           const updatedTipeNilai = [...scores.tipeNilai];
//           updatedTipeNilai[index] = value;
//           setNilaiData({
//             ...scores,
//             tipeNilai: updatedTipeNilai
//           });
//         }
//       };

//     useEffect(() => {
//         const token = sessionStorage.getItem('jwtToken');
//         if (token) {
//           setDecodedToken(parseJwt(token));
//         } else {
//           console.log("Need to login");
//           redirect('/user/login');
//         }
//       }, []);
      
//       useEffect(() => {
//         if (decodedToken) {
//           if (decodedToken.role === 'GURU') {
//             console.log("Access granted");
//           } else {
//             console.log("Not authorized");
//             redirect(`/kelas/${idKelas}`);
//           }
//         }
//       }, [decodedToken]);
    
//       useEffect(() => {
//         const fetchNuptkOptions = async () => {
//           try {
//             const jwtToken = sessionStorage.getItem('jwtToken');
//             const data = await getAllGuru(jwtToken);
//             const options = [];
//             for (const id of data) {
//               const user = await getUsersById(id);
//               console.log(user.id)
//               options.push({ label: `${user.firstname} ${user.lastname}`, value: user.id });
//             }
//             setNuptkOptions(options);
//             setLoading(false);
//           } catch (error) {
//             router.push(`/error/500`);
//           }
//         };
    
//         fetchNuptkOptions();
//       }, []);

//       useEffect(() => {
//         // Fetch students and subjects when the component mounts
//         fetchStudents();
//         fetchSubjects();
//     }, []);

//     const fetchStudents = async () => {
//         try {
//             const response = await axios.get('https://myjisc-user-e270dbbfd631.herokuapp.com/api/user/get-all-murid'); // Assuming the endpoint to fetch users is '/api/users'
//             setStudents(response.data);
//         } catch (error) {
//             console.error('Error fetching students:', error);
//         }
//     };

//     const fetchSubjects = async () => {
//         try {
//             const response = await axios.get(`https://myjisc-kelas-cdbf382fd9cb.herokuapp.com//api/kelas/mapel/${idMapel}`); // Assuming the endpoint to fetch subjects is '/api/subjects'
//             setSubjects(response.data);
//         } catch (error) {
//             console.error('Error fetching subjects:', error);
//         }
//     };
    

//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         try {
//     //             const userScores = await fetchUserScores(IdUser);

//     //             const namaMapel = userScores.data.map(us => getMapelByIdMapel(us.idMapel));
//     //             const mapel = await Promise.all(namaMapel);

//     //             let userScoresWithNamaMapel = userScores.data.map((us, index) => ({
//     //                 ...us,
//     //                 namaMapel: mapel[index].data.namaMapel
//     //             }));

//     //             setScores(userScoresWithNamaMapel);
//     //         } catch (error) {
//     //             setError(error.message);
//     //         } finally {
//     //             setLoading(false)
//     //         }
//     //     };

//     //     fetchData();
//     // }, [IdUser]);

//     // useEffect(() => {
//     //     const fetchUser = async () => {
//     //         try {
//     //             const response = await getUsersById(IdUser);
//     //             setUser(response.data);
//     //         } catch (error) {
//     //             setError(error.message);
//     //         }
//     //     };

//     //     fetchUser();
//     // }, [IdUser]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//           await axios.post(`https://myjisc-user-e270dbbfd631.herokuapp.com/api/score/input`, scores);
//           // Handle success (e.g., show success message, redirect user, etc.)
//           console.log('Nilai submitted successfully');
//         } catch (error) {
//           // Handle error (e.g., show error message to user)
//           console.error('Failed to submit nilai:', error);
//         }
//       };

//     return (
//         <>
//             <Navbar />
//             <Sidebar />
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//                     <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
//                                     <div>
//                                     <label htmlFor="student">Student:</label>
//                                     <select id="student" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
//                                         <option value="">Select Student</option>
//                                         {students.map((student) => (
//                                             <option key={student.id} value={student.id}>{student.firstName} {student.lastName}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="subject">Subject:</label>
//                                     <select id="subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
//                                         <option value="">Select Subject</option>
//                                         {subjects.map((subject) => (
//                                             <option key={subject.id} value={subject.id}>{subject.name}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                         <table style={{ width: '70%', borderCollapse: 'collapse' }}>
//                         <thead>
//                             <tr style={{ backgroundColor: '#f2f2f2' }}>
//                             <th style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>Tipe</th>
//                             <th style={{ padding: '12px', border: '1px solid #ddd', color: 'black' }}>Nilai</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {scores.tipeNilai.map((tipe, index) => (
//                             <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
//                                 <td style={{ padding: '12px', border: '1px solid #ddd' }}>
//                                 <input
//                                     type="text"
//                                     name="tipeNilai"
//                                     value={scores.tipeNilai[index]}
//                                     onChange={(e) => handleChange(e, index)}
//                                     style={{ color: 'black', width: '90%', border: 'none', outline: 'none', textAlign: 'center' }}
//                                 />
//                                 </td>
//                                 <td style={{ padding: '12px', border: '1px solid #ddd' }}>
//                                 <input
//                                     type="text"
//                                     name="listNilai"
//                                     value={scores.listNilai[index]}
//                                     onChange={(e) => handleChange(e, index)}
//                                     style={{ color: 'black', width: '90%', border: 'none', outline: 'none', textAlign: 'center' }}
//                                 />
//                                 </td>
//                             </tr>
//                             ))}
//                         </tbody>
//                         </table>
//                         <button type="submit" style={{ marginTop: '20px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Submit Nilai</button>
//                     </form>
//                     </div>
//             <Footer />
//         </>
//     );
// }

// export default InputNilai;



