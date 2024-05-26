// components/navbar.js
import React, { useState, useEffect } from 'react';
import { getUsersById } from '../api/user';

const Navbar = ({ role, id }) => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (id) {
            getUsersById(id)
                .then(user => {
                    if (user) {
                        console.log(user);
                        setUserName(user.firstname + ' ' + user.lastname);
                    }
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                });
        }
    }, [id]);

    const handleLogout = () => {
        // Clear session storage or remove the token
        sessionStorage.removeItem('jwtToken');
        // Redirect to login page or home page
        window.location.href = '/user/login';
    };

    const renderNavLinks = () => {
        switch (role) {
            case 'ADMIN':
                return (
                    <>
                        <a className="font-medium text-gray-900 dark:text-gray-100" href="/">
                            Home
                        </a>
                        <a className="font-medium text-gray-500 dark:text-gray-400" href="/artikel">
                            Articles
                        </a>
                        <a className="font-medium text-gray-500 dark:text-gray-400" href="/kelas/view-all">
                            List of class
                        </a>
                    </>
                );
            case 'GURU':
                return (
                    <>
                        <a className="font-medium text-gray-900 dark:text-gray-100" href="/">
                            Home
                        </a>
                        <a className="font-medium text-gray-500 dark:text-gray-400" href="/kelas/view-all">
                            List of class
                        </a>
                        <a className="font-medium text-gray-500 dark:text-gray-400" href="/kelas/myclass">
                           My class
                        </a>
                        <a className="font-medium text-gray-500 dark:text-gray-400" href="/berita">
                            News
                        </a>
                    </>
                );
            case 'STAFF':
                return (
                    <>
                        <a className="font-medium text-gray-900 dark:text-gray-100" href="/">
                            Home
                        </a>
                        <a className="font-medium text-gray-500 dark:text-gray-400" href="/peminjaman">
                            Inventory
                        </a>
                        <a className="font-medium text-gray-500 dark:text-gray-400" href="/berita">
                            News
                        </a>
                    </>
                );
                case '':
                    return (
                        <>
                            <a className="font-medium text-gray-900 dark:text-gray-100" href="/">
                                Home
                            </a>
                            <a className="font-medium text-gray-500 dark:text-gray-400" href="/artikel">
                                Articles
                            </a>
                        </>
                    );
            case 'MURID':
                return (
                    <>
                        <a className="font-medium text-gray-900 dark:text-gray-100" href="/">
                            Home
                        </a>
                        <a className="font-medium text-gray-500 dark:text-gray-400" href="/kelas/myclass">
                            My class
                        </a>
                        <a className="font-medium text-gray-500 dark:text-gray-400" href="/peminjaman">
                            Borrow 
                        </a>
                        <a className="font-medium text-gray-500 dark:text-gray-400" href="/artikel">
                            Articles
                        </a>
                        <a className="font-medium text-gray-500 dark:text-gray-400" href="/berita">
                            News
                        </a>
                    </>
                );
            default:
                return null;
        }
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
                        {renderNavLinks()}
                    </nav>
                    <div className="flex items-center gap-4 md:gap-6">
                        {userName ? (
                            <div className="relative group">
                                <button type="button" className="text-sm font-medium">
                                    Halo, {userName}
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button onClick={handleLogout} className="block px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left font-extrabold">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button type="button" className="text-sm font-medium">
                                <a href='/user/login'>Login</a>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
