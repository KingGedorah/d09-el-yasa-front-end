"use client";

import React, { useState, useEffect } from 'react';
import { getBeritaById } from '../../../api/berita'; // Import updateBerita API
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import Sidebar from '../../../components/sidebar';

const BeritaDetail = ({ params }) => {
    const { idBerita } = params;
    const [berita, setBerita] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchBerita = async () => {
        try {
          const beritaData = await getBeritaById(idBerita);
          setBerita(beritaData.data);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };
  
      fetchBerita();
    }, [idBerita]); // Add idBerita to dependency array to trigger effect when idBerita changes
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        await fetch(`https://myjisc-berita-e694a34d5b58.herokuapp.com/api/berita/update/${idBerita}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ judulBerita: berita.judulBerita, isiBerita: berita.isiBerita }),
        });
        console.log('Berita updated successfully');
        // Fetch the updated berita data and update the state
        const updatedBeritaData = await getBeritaById(idBerita);
        setBerita(updatedBeritaData.data);
      } catch (error) {
        console.error('Error updating berita:', error);
        // Handle error appropriately, such as displaying an error message to the user
      }
    };

    const handleChange = (e) => {
        // Update the state with the new value from the form input
        setBerita({ ...berita, [e.target.name]: e.target.value });
      };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {berita && (
              <form onSubmit={handleUpdate}>
                <div className="bg-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <img src="https://via.placeholder.com/600x400" alt="Placeholder" className="w-full h-48 object-cover" />
                  </div>
                  <div className="p-4">
                    <input type="text" name="judulBerita" value={berita.judulBerita} onChange={handleChange} className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500" required/>
                    <textarea name="isiBerita" rows="5" value={berita.isiBerita} onChange={handleChange} className="border border-gray-300 rounded-md py-2 px-4 w-full resize-none focus:outline-none focus:border-blue-500" required />
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Update</button>
                  </div>
                </div>
              </form>
            )}
          </div>
          <Sidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BeritaDetail;
