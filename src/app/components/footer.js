import React, { useEffect, useState } from 'react';

const Footer = () => {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
      const isShortContent = window.innerHeight >= document.body.offsetHeight;
      setShowFooter(isBottom || isShortContent);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <footer className={`bg-gray-900 text-white text-center py-6 ${showFooter ? 'fixed bottom-0 w-full' : 'hidden'}`}>
      <div className="container mx-auto">
        <p>&copy; 2024 Jakarta Islamic School. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;