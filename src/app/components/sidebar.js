import React, { useState, useEffect } from 'react';

const Sidebar = () => {
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    // Mendapatkan tanggal hari ini dalam format "DD MMMM YYYY" (misal: 10 Maret 2024)
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('id-ID', options);
    setTodayDate(formattedDate);

    // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
    const todayDateISO = currentDate.toISOString().split('T')[0];

    // Mendapatkan data jadwal sholat dari API
    fetch('https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/jakartatimur/2024/03.json')
      .then(response => response.json())
      .then(data => {
        // Cari data jadwal sholat untuk hari ini
        const todayData = data.find(schedule => schedule.tanggal === todayDateISO);
        setTodaySchedule(todayData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="w-full lg:w-1/3">
      <div className="bg-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2 underline">Jadwal Sholat Hari Ini</h2>
        <h3 className="text-base font-normal mb-2">{todayDate && todayDate}</h3>
        {todaySchedule && (
          <div className="mb-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Waktu</th>
                  <th className="border border-gray-300 px-4 py-2">Sholat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{todaySchedule.imsyak}</td>
                  <td className="border border-gray-300 px-4 py-2">Imsyak</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{todaySchedule.shubuh}</td>
                  <td className="border border-gray-300 px-4 py-2">Subuh</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{todaySchedule.terbit}</td>
                  <td className="border border-gray-300 px-4 py-2">Terbit</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{todaySchedule.dhuha}</td>
                  <td className="border border-gray-300 px-4 py-2">Dhuha</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{todaySchedule.dzuhur}</td>
                  <td className="border border-gray-300 px-4 py-2">Dzuhur</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{todaySchedule.ashr}</td>
                  <td className="border border-gray-300 px-4 py-2">Ashar</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{todaySchedule.magrib}</td>
                  <td className="border border-gray-300 px-4 py-2">Maghrib</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{todaySchedule.isya}</td>
                  <td className="border border-gray-300 px-4 py-2">Isya</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold mb-2">Kalender</h2>
          {/* Tambahkan kode kalender di sini */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
