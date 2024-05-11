import React from 'react';

const SpinLoading = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="mb-2 text-lg font-semibold text-gray-700">Loading...</div>
    <div className="flex justify-center items-center animate-spin">
      <svg
        className="w-12 h-12 text-purple-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8 8 0 0112 4v4c-3.86 0-7 3.14-7 7h4zm6 2.627A8 8 0 0120 12h-4c0 3.86-3.14 7-7 7v-4z"
        ></path>
      </svg>
    </div>
  </div>
);

export default SpinLoading;
