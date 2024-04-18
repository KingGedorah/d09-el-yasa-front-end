"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateUserPage = ({ params }) => {
  const { IdUser } = params;
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('jwtToken'); // Retrieve the JWT token from sessionStorage
        console.log(token);
        const response = await axios.get(`http://localhost:8080/api/user/${IdUser}`, {
        });
        const userData = response.data;
        setFirstname(userData.firstname);
        setLastname(userData.lastname);
      } catch (error) {
        setError('Error fetching user data');
      }
    };

    fetchUser();
  }, [IdUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/user/update/${IdUser}`, {
        firstname,
        lastname,
      });
      // Optionally, handle success (e.g., show a success message)
    } catch (error) {
      setError('Error updating user');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit}>
      <h2>Update User</h2>
        <div className="space-y-1">
          <label htmlFor="firstName" className="inline-block text-sm font-medium font-nunito-sans">
            First Name:</label>
          <input
          className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
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
          className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-nunito-sans"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            style={{ color: 'black' }}
          />
        </div>
        <button type="submit">Update</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
