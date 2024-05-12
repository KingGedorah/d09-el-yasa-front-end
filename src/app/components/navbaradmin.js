import React from 'react';

const Navbaradmin = ({ username }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-850">
      <div className="px-4 py-6 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a className="flex gap-4 items-center" href="/">
            <span className="font-semibold text-base sm:text-xl">
              MyJISc
            </span>
          </a>
          <nav className="hidden md:flex gap-4 text-sm">
            <a className="font-medium text-gray-900 dark:text-gray-100" href="/">
              Beranda
            </a>
            <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
              Akademik
            </a>
            <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
              Inventaris
            </a>
            <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
              Manajemen Konten
            </a>
            <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
              Tentang Kami
            </a>
          </nav>
          <div className="flex items-center gap-4 md:gap-6">
            {username ? ( 
              <span className="text-sm font-medium">Halo, {username}</span>
            ) : (
              <button type="button" className="text-sm font-medium">
                <a href='/user/login'>Masuk</a>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbaradmin;
