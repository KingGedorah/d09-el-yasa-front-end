// api/ayatquran.js

const fetchVerse = async () => {
    try {
      const surahNumberRandom = Math.floor(Math.random() * 114) + 1; // Nomor surat secara acak antara 1 dan 114
      const response = await fetch(`https://al-quran-8d642.firebaseio.com/surat/${surahNumberRandom}.json?print=pretty`);
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomVerse = data[randomIndex];
      return { ...randomVerse, surahNumber: surahNumberRandom }; // Include the surah number in the returned object
    } catch (error) {
      console.error('Error fetching Quran verse:', error);
      throw error; // Re-throw the error for handling in the component
    }
  };
  
export default fetchVerse;