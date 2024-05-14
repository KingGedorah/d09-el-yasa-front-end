"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SpinLoading from '@/app/components/spinloading';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';

const UpdateUserPage = ({ params }) => {
  const [id, setId] = useState('');
  const router = useRouter();
  const { IdUser } = params;
  const [loading, setLoading] = useState(true);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for modal visibility

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = parseJwt(token);
      setId(decodedToken.id);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('jwtToken'); // Retrieve the JWT token from sessionStorage
        console.log(token);
        const response = await axios.get(`https://myjisc-user-e270dbbfd631.herokuapp.com/api/user/${IdUser}`, {
        });
        const userData = response.data;
        setFirstname(userData.firstname);
        setLastname(userData.lastname);
        setUserName(userData.username);
        setPassword(userData.password);
        setLoading(false);
      } catch (error) {
        router.push(`/error/500`);
      }
    };

    fetchUser();
  }, [IdUser]);

  const handleSuccessPopup = () => {
    setIsSuccess(false);
    window.location.href = '/user/login';
  };

  const handleErrorPopup = () => {
    setIsError(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://myjisc-user-e270dbbfd631.herokuapp.com/api/user/update/${IdUser}`, {
        firstname,
        lastname,
        username,
        password
      });
      // Optionally, handle success (e.g., show a success message)
    } catch (error) {
      setError('Error updating user');
    }
  };

  const closeModal = () => {
    setIsSuccessModalOpen(false);
    window.location.href = '/user/login';
  };


  if (loading) {
    return <SpinLoading/>;
  }

  return (
  <div className="bg-[#F3F5FB]">
    <Navbar role={id}/>
    <div className="container py-8 px-4 md:px-6 flex items-center justify-center mx-auto">
      <div className="w-full max-w-sm space-y-4 bg-white p-8 rounded-xl shadow-lg">
      <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-nunito-sans">Update User Information</h1>
            <p className="text-gray-400  font-nunito">
              Insert the correct information
            </p>
      </div>
      <form onSubmit={handleSubmit}>
      <div className="space-y-2">
        <div className="space-y-1">
          <label htmlFor="firstName" className="inline-block text-sm font-medium font-nunito-sans">
            First Name:</label>
          <input
            className="h-10 w-full rounded-md border border-[#6C80FF] bg-white px-3 py-2 text-sm placeholder-gray-400  font-nunito"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            style={{ color: 'black' }}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="lastName" className="inline-block text-sm font-medium font-nunito-sans">
            Last Name:</label>
          <input
          className="h-10 w-full rounded-md border border-[#6C80FF] bg-white px-3 py-2 text-sm placeholder-gray-400  font-nunito"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            style={{ color: 'black' }}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="username" className="inline-block text-sm font-medium font-nunito-sans">
            Username:</label>
          <input
          className="h-10 w-full rounded-md border border-[#6C80FF] bg-white px-3 py-2 text-sm placeholder-gray-400  font-nunito"
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            style={{ color: 'black' }}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="inline-block text-sm font-medium font-nunito-sans">
            Password:</label>
          <input
          className="h-10 w-full rounded-md border border-[#6C80FF] bg-white px-3 py-2 text-sm placeholder-gray-400  font-nunito"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ color: 'black' }}
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-[#6C80FF] hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 font-nunito"
              >
                Update
              </button>
            </div>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>
    {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6">
            <p className="text-center text-green-600 text-xl font-semibold mb-4">Updated Success!</p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 font-nunito-sans"
            >
              Login
            </button>
          </div>
        </div>
      )}
      <Footer />
      {isSuccess && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-green-600 font-semibold">Account updated succesfully</p>
            <button onClick={handleSuccessPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}
      {isError && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md absolute">
            <p className="text-red-600 font-semibold">Failed to updated account</p>
            <button onClick={handleErrorPopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto">Close</button>
          </div>
        </div>
      )}
  </div>
  );
};

export default UpdateUserPage;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { getUsersById } from '../../../api/user';
// import Navbar from '../../../components/navbar';
// import Footer from '../../../components/footer';

// const UpdateUserPage = ({ params }) => {
//   const { IdUser } = params;
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);


//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await getUsersById(IdUser);
//         setUser(userData.data);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [IdUser]);

//   console.log(user);

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await fetch(`http://localhost:8080/api/v1/user/update/${IdUser}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ firstName: user.firstname, lastName: user.lastname }),
//       });
//       console.log('User updated successfully');
//       // Fetch the updated berita data and update the state
//       const updatedUserData = await getUsersById(IdUser);
//       setBerita(updatedUserData.data);
//     } catch (error) {
//       console.error('Error updating user:', error);
//       // Handle error appropriately, such as displaying an error message to the user
//     }
//   };

//   const handleChange = (e) => {
//     // Update the state with the new value from the form input
//     setBerita({ ...user, [e.target.name]: e.target.value });
//   };

// if (loading) return <div>Loading...</div>;
// if (error) return <div>Error: {error.message}</div>;

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const response = await axios.put(`http://localhost:8080/api/v1/user/update/${IdUser}`, {
//   //       firstname: firstName,
//   //       lastname: lastName
//   //     });
//   //     if (response.status === 200) {
//   //       setSuccess(true);
//   //       setError('');
//   //     }
//   //   } catch (error) {
//   //     setError('Error updating user. Please try again.');
//   //     setSuccess(false);
//   //   }
//   // };

//   return (
//       <div>
//         <Navbar />
//         <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-screen-lg">
//           <div className="flex flex-col lg:flex-row gap-8">
//             <div className="w-full lg:w-2/3">
//               {loading && <div>Loading...</div>}
//               {error && <div>Error: {error.message}</div>}
//               {user && (
//                 <form onSubmit={handleUpdate}>
//                   <div className="bg-gray-200 rounded-lg overflow-hidden">
//                     <div className="p-4">
//                       <input type="text" name="firstName" value={user.firstName} onChange={handleChange} className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500" required/>
//                       <input type="text" name="lastName" value={user.lastName} onChange={handleChange} className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:border-blue-500" required/>
//                       <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Update</button>
//                     </div>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//   );
// };

// export default UpdateUserPage;
