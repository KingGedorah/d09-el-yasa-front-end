const BASE_URL = 'http://localhost:8083/api/kelas'

export const getAllKelas = async () => {
  try {
    const response = await fetch(`${BASE_URL}/view-all`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching kelas:', error);
    throw error; // Re-throw the error for handling in the component
  }
};

export const getKelasByIdKelas = async (idKelas) => {
  try {
    const response = await fetch(`${BASE_URL}/${idKelas}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching kelas by ID Kelas:', error);
    throw error;
  }
};

export const getKelasByIdSiswa = async (idSiswa) => {
    try {
      const response = await fetch(`${BASE_URL}/siswa/${idSiswa}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching kelas by ID Siswa:', error);
      throw error;
    }
};

export const getAllKelasDiajarByIdGuru = async (idGuru) => {
    try {
      const response = await fetch(`${BASE_URL}/guru/${idGuru}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching kelas by ID Guru:', error);
      throw error;
    }
};

export const getMapelByIdMapel = async (idMapel) => {
    try {
      const response = await fetch(`${BASE_URL}/mapel/${idMapel}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Mapel by ID Mapel:', error);
      throw error;
    }
};

export const getMateriByIdMateri = async (idMateri) => {
  try {
    const response = await fetch(`${BASE_URL}/materi/${idMateri}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Mapel by ID Mapel:', error);
    throw error;
  }
}