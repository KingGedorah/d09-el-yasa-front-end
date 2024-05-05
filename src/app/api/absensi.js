const BASE_URL = 'https://myjisc-kelas-cdbf382fd9cb.herokuapp.com/api/absensi'

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

export const updateAbsensi = async (idAbsen, dataAbsensi) => {
  try {
    const response = await fetch(`${BASE_URL}/update/${idAbsen}`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "PUT",
      body: dataAbsensi,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating data absensi: ", error);
    throw error;
  }
}