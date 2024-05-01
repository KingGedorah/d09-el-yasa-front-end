import React, { useState, useEffect } from 'react';
import AyatQuran from './ayatquran'; 

const Sidebar = () => {
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    // Mendapatkan tanggal hari ini dalam format "DD MMMM YYYY"
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('id-ID', options);
    setTodayDate(formattedDate);

    // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
    const todayDateISO = currentDate.toISOString().split('T')[0];

    // Mendapatkan data jadwal sholat dari API
    fetch('https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/jakartatimur/2024/04.json')
      .then(response => response.json())
      .then(data => {
        // Cari data jadwal sholat untuk hari ini
        const todayData = data.find(schedule => schedule.tanggal === todayDateISO);
        setTodaySchedule(todayData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
          <aside class="w-1/5 md:w-1/4 lg:w-1/3 p-4">
              <div class="bg-white dark:bg-gray-700 p-4">
                <h3 class="text-lg font-semibold mb-2">Jadwal Sholat Hari Ini</h3>
                <h3 className="text-base font-normal mb-2 text-center">{todayDate && todayDate}</h3>
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
              </div>
              <div class="bg-white dark:bg-gray-700 p-4">
                <h3 class="text-lg font-semibold mb-2">Ayat hari ini</h3>
                <AyatQuran />
                <p class="text-gray-600 dark:text-gray-300"></p>
              </div>
          </aside>
  );
};

export default Sidebar;
