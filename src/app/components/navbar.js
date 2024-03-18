import React from 'react';

const Navbar = () => {
  return (
    <nav class="bg-blue-500 p-4 flex justify-between">
        <div class="flex items-center text-white">
            <img src="https://www.jakartaislamicschool.com/wp-content/uploads/2023/11/logo-web-sekolah-islam-terbaik-jakarta-timur-jisc.png" alt="Logo" class="h-8 mr-4"/>
            <ul class="flex space-x-4">
                <li><a href="/" class="text-white">Beranda</a></li>
                <li><a href="#" class="text-white">Akademik</a></li>
                <li><a href="#" class="text-white">Inventaris</a></li>
                <li><a href="/artikel" class="text-white">Artikel</a></li>
                <li><a href="/berita" class="text-white">Berita</a></li>
                <li><a href="#" class="text-white">Tentang Kami</a></li>
            </ul>
        </div>
        <div class="flex items-center">
            <span class="text-white mr-4">Halo, [Nama Admin]</span>
            <a href="#" class="text-white bg-red-500 px-4 py-2 rounded-md">Logout</a>
        </div>
    </nav>
  );
};

export default Navbar;