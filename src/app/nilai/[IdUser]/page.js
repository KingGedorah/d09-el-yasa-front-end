"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import Sidebar from '@/app/components/sidebar';
import { getUsersById } from '@/app/api/user';
import { getMapelByIdMapel } from '@/app/api/kelas';
import { parseJwt } from '@/app/utils/jwtUtils';
import { useRouter } from 'next/navigation';

const fetchUserScores = async (IdUser) => {
  try {
    const response = await axios.get(`https://myjisc-user-c9e48ced667a.herokuapp.com/api/score/view-all/siswa/${IdUser}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user scores');
  }
};

const UserIdPage = ({ params }) => {
  const router = useRouter()
  const { IdUser } = params;
  const [user, setUser] = useState(null)
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decodedToken, setDecodedToken] = useState(null);


  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setDecodedToken(parseJwt(token));
    }
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userScores = await fetchUserScores(IdUser);

        const namaMapel = userScores.data.map(us => getMapelByIdMapel(us.idMapel));
        const mapel = await Promise.all(namaMapel);

        let userScoresWithNamaMapel = userScores.data.map((us, index) => ({
          ...us,
          namaMapel: mapel[index].data.namaMapel
        }));

        setScores(userScoresWithNamaMapel);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false)
      }
    };

    if (IdUser) {
      fetchData();
    }
  }, [IdUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUsersById(decodedToken.id);
        setUser(user);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false)
      }
    };

    if (decodedToken) {
      fetchData()
    }
  }, [decodedToken]);

  useEffect(() => {
    if (decodedToken) {
        if (decodedToken.role === 'MURID') {
            console.log("Access granted");
        } else {
            console.log("Not authorized");
            router.push(`/user/login`);
        }
    }
}, [decodedToken]);

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-8 px-12 rounded-lg" style={{ marginBottom: '100px' }}>
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-2/3">
            <h1 className='text-center font-bold my-8 text-2xl'>{user?.firstname ? user?.firstname + "'s" : "Your"} Score</h1>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error.message}</div>
            ) : (
              scores?.map((d, index) => (
                <div key={index} className="flex flex-col gap-2 w-full rounded-xl mb-8">
                  <h2 className='font-bold text-lg'>{d.namaMapel}</h2>
                  <div className="border-collapse border-2 border-[#6C80FF] rounded-xl max-w-max">
                    <div className='flex items-center'>
                        {
                          d.tipeNilai.map(tipe => (
                            <div key={tipe} className="p-2 w-24 text-center">{tipe}</div>
                          ))
                        }
                    </div>
                    <hr className='border-[#6C80FF]'/>
                    <div className='flex items-center'>
                        {
                          d.listNilai.map((nilai, idx) => (
                            <div key={idx} className="p-2 w-24 text-center">{nilai}</div>
                          ))
                        }
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className='flex flex-col gap-4'>
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
  
};

export default UserIdPage;