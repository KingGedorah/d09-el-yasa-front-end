import React from 'react';

const Navbar = () => {
  return (
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
                        <a class="font-medium text-gray-500 dark:text-gray-400" href="/kelas/myclass">
                            Kelasku
                        </a>
                    </nav>
                    <div class="flex items-center gap-4 md:gap-6">
                        <button type="button" class="text-sm font-medium">
                            <a href='/user/login'>Masuk</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default Navbar;