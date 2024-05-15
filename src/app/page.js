// pages/index.js
"use client";
import Head from 'next/head';
import Navbar from './components/navbar';
import { useState, useEffect, useRef } from 'react';
import { parseJwt } from '@/app/utils/jwtUtils';
import { getAllArticles, fetchImageData } from '@/app/api/artikel'
import Link from 'next/link';
import Image from 'next/image';
import { FaRegSadCry } from 'react-icons/fa';

const ArticleImage = ({ idArtikel, className }) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    fetchImageData(idArtikel).then(setImageSrc).catch(console.error);
  }, [idArtikel]);

  return imageSrc ? <img src={imageSrc} className={className} alt="Article" /> : null;
};

export default function Home() {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = parseJwt(token);
      setId(decodedToken.id);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    getAllArticles().then((data) => {
      if (data && data.length > 0) {
        setArticles(data.slice(0, 3)); // Mengambil 3 artikel terbaru
      } else {
        setArticles([]);
      }
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching articles:', error);
      setError(error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, [loading]);

  const sectionStyle = {
    opacity: 0,
    transition: 'opacity 1s ease-in-out'
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <Navbar role={id} />
      <main
        ref={(el) => (sectionsRef.current[0] = el)}
        style={{
          ...sectionStyle,
          backgroundImage: `url('https://lh3.googleusercontent.com/p/AF1QipOh2VaGBWKKwXGEHF6hzevdXpC_biIRDbxrvHgF=s1360-w1360-h1020')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="py-16 md:py-24 lg:py-32 hero-bg"
      >
        <div className="container px-4 md:px-6 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold font-nunito-sans text-white">
                Selamat Datang di Jakarta Islamic School
              </h1>
              <p className="dark:text-gray-400 font-nunito-sans text-white">
                Memberikan Pendidikan Berkualitas Tinggi untuk Masa Depan yang Cerah
              </p>
            </div>
            <div className="space-y-2">
              <a
                href="https://bit.ly/enrollmentJIScTA20242025" target='blank'
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-block"
              >
                Daftar Sekarang
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* About */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        style={sectionStyle}
        className="bg-white py-16 md:py-24 lg:py-32"
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Tentang Kami</h2>
          <p className="text-lg text-center">
            Jakarta Islamic School adalah sekolah menengah atas yang berkomitmen untuk memberikan pendidikan berkualitas
            tinggi yang membentuk karakter unggul bagi para generasi masa depan.
          </p>
        </div>
      </section>

      {/* Featured Program */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        style={sectionStyle}
        className="bg-gray-100 py-16 md:py-24 lg:py-32"
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Program Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">STEM</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Program pendidikan ilmu pengetahuan, teknologi, teknik, dan matematika yang menantang untuk membekali siswa
                dengan keterampilan inovatif dan keahlian teknis.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Bahasa dan Budaya</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Pelajari bahasa asing dan apresiasi terhadap berbagai budaya di dunia dengan program bahasa dan budaya kami
                yang komprehensif.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Seni dan Kreativitas</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Eksplorasi ekspresi diri melalui seni rupa, musik, teater, dan banyak lagi, dalam lingkungan yang mendukung
                dan mendorong kreativitas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Artikel Terbaru */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        style={sectionStyle}
        className="bg-white py-16 md:py-24 lg:py-32"
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Artikel Terbaru</h2>
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {!loading && !error && (
            <div className="flex flex-col gap-4 w-full">
              {articles.length === 0 ? (
                <div className="text-center">
                  <FaRegSadCry size={64} className="text-gray-400 mx-auto" />
                  <p className="text-lg font-semibold mt-4">There's no artikel has been posted</p>
                  <p className="text-sm text-gray-600">Make one now !</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {articles.map((article, index) => (
                    <div
                      key={index}
                      className="p-4 border-[1px] border-[#8D6B94] w-full rounded-xl artikel-item"
                      style={{
                        transition: 'transform 0.3s',
                        transform: 'scale(1)',
                      }}
                      onMouseEnter={(event) => event.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(event) => event.target.style.transform = 'scale(1)'}
                    >
                      <div className='flex justify-center'>
                        {article.imageArtikel ? (
                          <ArticleImage idArtikel={article.idArtikel} className="w-full h-48 object-cover" />
                        ) : (
                          <Image src="https://via.placeholder.com/600x400" width="600" height="400" objectFit="cover" alt="Placeholder" loading="lazy" />
                        )}
                      </div>
                      <Link href={`/artikel/${article.idArtikel}`} passHref>
                        <h2 className='text-2xl text-center mb-4 mt-4 font-extrabold'>{article.judulArtikel}</h2>
                      </Link>
                      <div dangerouslySetInnerHTML={{ __html: article.isiArtikel.slice(0, 150) }} />
                      <Link href={`/artikel/${article.idArtikel}`} passHref>
                        <button className="mt-2 bg-white border-[1px] border-[#6C80FF] text-[#6C80FF] px-4 py-2 rounded-md cursor-pointer">Baca Selengkapnya</button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        style={sectionStyle}
        className="bg-white py-16 md:py-24 lg:py-32"
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Hubungi Kami</h2>
          <p className="text-lg text-center">
            Alamat: Jalan Manunggal I, Komplek Kodam No.17, RT.11/RW.6, Cipinang Melayu, Kec. Makasar, Kota Jakarta Timur,
            Daerah Khusus Ibukota Jakarta 13620
          </p>
          <p className="text-lg text-center">Telepon: (XXX) XXX-XXXX</p>
          <p className="text-lg text-center">Email: info@jakartaislamicschool.com</p>
          <p className="text-lg text-center">
            Website: <a href="#" className="text-blue-500 hover:underline">www.jakartaislamicschool.com</a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        ref={(el) => (sectionsRef.current[5] = el)}
        style={sectionStyle}
        className="bg-gray-900 text-white text-center py-6"
      >
        <p>&copy; 2024 Jakarta Islamic School. All rights reserved.</p>
      </footer>
    </div>
  );
}
