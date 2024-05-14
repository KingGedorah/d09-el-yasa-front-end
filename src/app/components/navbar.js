// import React from 'react';
// import Link from 'next/link';

// const Navbar = ({ handleLogout, isLoggedIn }) => {
//   if (isLoggedIn) {
//     return (
//       <div className="border-b border-gray-200 dark:border-gray-850">
//         <div className="px-4 py-6 md:px-6 lg:px-8">
//           <div className="flex items-center justify-between">
//             <div className="flex gap-4 items-center">
//               <span className="font-semibold text-base sm:text-xl">MyJISc</span>
//             </div>
//             <nav className="hidden md:flex gap-4 text-sm">
//               <a className="font-medium text-gray-900 dark:text-gray-100">Halaman Depan</a>
//               <a className="font-medium text-gray-500 dark:text-gray-400">Kelasku</a>
//             </nav>
//             <div className="flex items-center gap-4 md:gap-6">
//               <button type="button" className="text-sm font-medium" onClick={handleLogout}>
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   } else {
//     return (
//       <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-850 px-4 py-6 md:px-6 lg:px-8">
//         <div className="container mx-auto flex items-center justify-between">
//           <a className="flex gap-4 items-center font-nunito-sans" href="#">
//             <span className="font-semibold text-base sm:text-xl">Jakarta Islamic School</span>
//           </a>
//           <nav className="hidden md:flex gap-4 text-sm font-nunito-sans">
//             <a className="font-medium text-gray-900 dark:text-gray-100" href="#">Halaman Depan</a>
//             <a className="font-medium text-gray-500 dark:text-gray-400" href="#">Tentang</a>
//             <a className="font-medium text-gray-500 dark:text-gray-400" href="#">Program</a>
//             <a className="font-medium text-gray-500 dark:text-gray-400" href="#">Kontak</a>
//           </nav>
//           <div className="flex items-center gap-4 md:gap-6">
//             <Link href="/user/login">
//               <button type="button" className="text-sm font-medium font-nunito-sans">Masuk</button>
//             </Link>
//           </div>
//         </div>
//       </nav>
//     );
//   }
// };

// export default Navbar;

// 'use client';



// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { parseJwt } from '@/app/utils/jwtUtils';
// import { getUsersById } from '../api/user';


// const Navbar = () => {
//   const [decodedToken, setDecodedToken] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = sessionStorage.getItem("jwtToken");
//     if (token) {
//         const decoded = parseJwt(token);
//         setDecodedToken(decoded);
//         console.log(decoded);
//     }
//   }, [router]);

//   const handleLogout = () => {
//     sessionStorage.removeItem("jwtToken");
//     setDecodedToken(null);
//     router.push("/user/login");
//   };

//   return decodedToken ? (
//     <div className="border-b border-gray-200 dark:border-gray-850">
//       <div className="px-4 py-6 md:px-6 lg:px-8">
//         <div className="flex items-center justify-between">
//           <div className="flex gap-4 items-center">
//             <span className="font-semibold text-base sm:text-xl"><p>Welcome, {decodedToken.username}</p></span>
//           </div>
//           <nav className="hidden md:flex gap-4 text-sm">
//             <a className="font-medium text-gray-900 dark:text-gray-100">Halaman Depan</a>
//             <a className="font-medium text-gray-500 dark:text-gray-400">Kelasku</a>
//           </nav>
//           <div className="flex items-center gap-4 md:gap-6">
//             <button type="button" className="text-sm font-medium" onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   ) : (
//     <div className="border-b border-gray-200 dark:border-gray-850">
//       <div className="px-4 py-6 md:px-6 lg:px-8">
//         <div className="flex items-center justify-between">
//           <a className="flex gap-4 items-center" href="/">
//             <span className="font-semibold text-base sm:text-xl">MyJISc</span>
//           </a>
//           <nav className="hidden md:flex gap-4 text-sm">
//             <a className="font-medium text-gray-900 dark:text-gray-100" href="/">
//               Beranda
//             </a>
//             <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
//               Tentang Kami
//             </a>
//           </nav>
//           <div className="flex items-center gap-4 md:gap-6">
//             <button type="button" className="text-sm font-medium">
//               <a href="/user/login">Masuk</a>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

'use client';

import React,{ useState, useEffect } from 'react';
import { getUsersById } from '../api/user';

const Navbar = ({ role }) => {
    const [userName, setUserName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (role) {
          getUsersById(role)
            .then(user => {
              if (user) {
                console.log(user)
                setUserName(user.firstname + ' ' + user.lastname);
              }
            })
            .catch(error => {
              console.error('Error fetching user:', error);
            });
        }
      }, [role]);

      const handleLogout = () => {
        // Clear session storage or remove the token
        sessionStorage.removeItem('jwtToken');
        // Redirect to login page or home page
        window.location.href = '/user/login';
      };

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
              Beranda
            </a>
            <a class="font-medium text-gray-500 dark:text-gray-400" href="#">
              Akademik
            </a>
            <a class="font-medium text-gray-500 dark:text-gray-400" href="#">
              Tentang Kami
            </a>
          </nav>
           <div className="flex items-center gap-4 md:gap-6">
            {userName ? (
              <div className="relative">
                <button type="button" className="text-sm font-medium">
                  Halo, {userName}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                  <button onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left">
                    Logout
                  </button>
                </div>
              </div>
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

export default Navbar;