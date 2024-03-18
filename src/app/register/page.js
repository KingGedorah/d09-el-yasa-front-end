// src/app/register/page.js

import Head from 'next/head';

export default function RegisterPage() {
  return (
    <div className="bg-white dark:bg-gray-950">
      <Head>
        <title>Your Title</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
      </Head>

      <div className="border-b border-gray-200 dark:border-gray-850">
        <div className="px-4 py-6 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a className="flex gap-4 items-center font-nunito-sans" href="#">
              <span className="font-semibold text-base sm:text-xl">MyJISc</span>
            </a>
            <nav className="hidden md:flex gap-4 text-sm font-nunito-sans">
              <a className="font-medium text-gray-900 dark:text-gray-100" href="#">
                Halaman Depan
              </a>
              <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
                Siswa
              </a>
              <a className="font-medium text-gray-500 dark:text-gray-400" href="#">
                Guru
              </a>
            </nav>
            <div className="flex items-center gap-4 md:gap-6">
              <button type="button" className="text-sm font-medium font-nunito-sans">
                Masuk
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold font-nunito-sans">Daftar</h1>
              <p className="text-gray-500 dark:text-gray-400 font-nunito-sans">
                Masukkan informasi di bawah ini.
              </p>
            </div>
            <form>
              <div className="space-y-2">
                <div className="space-y-1">
                  <label htmlFor="username" className="inline-block text-sm font-medium font-nunito-sans">
                    Username
                  </label>
                  <input
                    className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                    id="username"
                    placeholder="Username"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="firstname" className="inline-block text-sm font-medium font-nunito-sans">
                    Firstname
                  </label>
                  <input
                    className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                    id="firstname"
                    placeholder="Firstname"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="lastname" className="inline-block text-sm font-medium font-nunito-sans">
                    Lastname
                  </label>
                  <input
                    className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                    id="lastname"
                    placeholder="Lastname"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="inline-block text-sm font-medium font-nunito-sans">
                    Email
                  </label>
                  <input
                    className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                    id="email"
                    placeholder="afiq.ilyasa@ui.ac.id"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="inline-block text-sm font-medium font-nunito-sans">
                    Password
                  </label>
                  <input
                    className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                    id="password"
                    type="password"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="role" className="inline-block text-sm font-medium font-nunito-sans">
                    Role
                  </label>
                  <select
                    className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
                    id="role">
                    <option value="guru">Guru</option>
                    <option value="siswa">Siswa</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 font-nunito-sans"
                >
                  Daftar!
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; 2024 Jakarta Islamic School. All rights reserved.</p>
      </footer>
    </div>
  );
}
