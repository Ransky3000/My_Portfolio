'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from '../styles/navbar.module.css';
import LoginModal from './LoginModal';

export default function Navbar({ initialSiteTitle = 'Ranian' }: { initialSiteTitle?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [siteTitle, setSiteTitle] = useState(initialSiteTitle);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`} id="navbar">
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {siteTitle}
        </Link>

        <div className={`${styles.navLinks} ${mobileOpen ? styles.mobileOpen : ''}`}>
          <Link href="#about" onClick={closeMobileMenu}>About</Link>
          <Link href="#projects" onClick={closeMobileMenu}>Projects</Link>
          <Link href="#contact" onClick={closeMobileMenu}>Contact</Link>
          <button 
            onClick={() => {
              closeMobileMenu();
              setShowLoginModal(true);
            }} 
            className={styles.adminLink}
          >
            Admin CMS
          </button>
        </div>

        <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu} aria-label="Toggle menu" id="mobile-menu-btn">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </nav>
  );
}
