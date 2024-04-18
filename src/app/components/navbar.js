import React from 'react';

const Navbar = () => {
  return (
<<<<<<< HEAD
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
=======
        <div class="border-b border-gray-200 dark:border-gray-850">
            <div class="px-4 py-6 md:px-6 lg:px-8">
                <div class="flex items-center justify-between">
                    <a class="flex gap-4 items-center" href="/">
                        <span class="font-semibold text-base sm:text-xl">
                            MyJISc
                        </span>
                    </a>
                    <nav class="hidden md:flex gap-4 text-sm">
                        <a class="font-medium text-gray-900 dark:text-gray-100" href="/">
                            Halaman Depan
                        </a>
                        <a class="font-medium text-gray-500 dark:text-gray-400" href="#">
                            Berita
                        </a>
                        <a class="font-medium text-gray-500 dark:text-gray-400" href="/kelas/myclass">
                            Kelasku
                        </a>
                    </nav>
                    <div class="flex items-center gap-4 md:gap-6">
                        <button type="button" class="text-sm font-medium">
                            Masuk
                        </button>
                    </div>
                </div>
            </div>
>>>>>>> cff74f3b48b9590f3c95b033c704db51f24e887a
        </div>
  );
};

export default Navbar;