import React,{ useState, useEffect } from 'react';
import { getUsersById } from '../api/user';

const Navbarguru = ({ role }) => {
  const [userName, setUserName] = useState('');

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

export default Navbarguru;
