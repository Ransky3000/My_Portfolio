'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from '../styles/navbar.module.css';

export default function Navbar({ initialSiteTitle = 'Ranian' }: { initialSiteTitle?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [siteTitle, setSiteTitle] = useState(initialSiteTitle);

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
          <Link href="/admin/login" onClick={closeMobileMenu} className={styles.adminLink}>
            Admin CMS
          </Link>
        </div>

        <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu} aria-label="Toggle menu" id="mobile-menu-btn">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
