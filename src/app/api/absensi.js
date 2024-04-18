const BASE_URL = 'http://localhost:8083/api/absensi'

export const retrieveAbsensiKelas = async (idKelas) => {
    try {
        const response = await fetch(`${BASE_URL}/${idKelas}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching absensi by ID Kelas:', error);
        throw error; // Re-throw the error for handling in the component
    };
};


export const retrieveDetailAbsensi = async (idAbsen) => {
    try {
      const response = await fetch(`${BASE_URL}/detail/${idAbsen}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching absensi by ID Absen:', error);
      throw error;
    }
  };
