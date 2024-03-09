import React from 'react';

const Sidebar = () => {
  return (

            <div class="w-full lg:w-1/3">
                <div class="bg-gray-200 rounded-lg p-4">
					<button class="bg-blue-500 text-white py-2 px-4 rounded-md mb-4 block mx-auto">Tambah Post</button>

                    <div class="mb-4">
                        <h2 class="text-lg font-semibold mb-2">Jadwal Sholat Hari Ini</h2>
                        <table class="w-full">
                            <thead>
                                <tr>
                                    <th class="border border-gray-300 px-4 py-2">Waktu</th>
                                    <th class="border border-gray-300 px-4 py-2">Sholat</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border border-gray-300 px-4 py-2">04:50</td>
                                    <td class="border border-gray-300 px-4 py-2">Subuh</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-4 py-2">12:30</td>
                                    <td class="border border-gray-300 px-4 py-2">Dzuhur</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-4 py-2">15:00</td>
                                    <td class="border border-gray-300 px-4 py-2">Ashar</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-4 py-2">17:45</td>
                                    <td class="border border-gray-300 px-4 py-2">Maghrib</td>
                                </tr>
                                <tr>
                                    <td class="border border-gray-300 px-4 py-2">19:00</td>
                                    <td class="border border-gray-300 px-4 py-2">Isya</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold mb-2">Kalender</h2>
        
                        <div class="flex flex-col">
                            <div class="flex justify-between mb-2">
                                <button class="px-1">&lt;</button>
                                <h3 class="text-lg font-semibold">November 2024</h3>
                                <button class="px-1">&gt;</button>
                            </div>
                            <table class="table-auto">
                                <thead>
                                    <tr>
                                        <th class="px-4 py-2">M</th>
                                        <th class="px-4 py-2">T</th>
                                        <th class="px-4 py-2">W</th>
                                        <th class="px-4 py-2">T</th>
                                        <th class="px-4 py-2">F</th>
                                        <th class="px-4 py-2">S</th>
                                        <th class="px-4 py-2">S</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="border px-4 py-2">1</td>
                                        <td class="border px-4 py-2">2</td>
                                        <td class="border px-4 py-2">3</td>
                                        <td class="border px-4 py-2">4</td>
                                        <td class="border px-4 py-2">5</td>
                                        <td class="border px-4 py-2">6</td>
                                        <td class="border px-4 py-2">7</td>
                                    </tr>
                               
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
  );
};

export default Sidebar;