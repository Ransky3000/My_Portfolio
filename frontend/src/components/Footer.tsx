'use client';

import { Code, User, Mail } from 'lucide-react';
import styles from '../styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.socials}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label="GitHub">
            <Code size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label="LinkedIn">
            <User size={20} />
          </a>
          <a href="mailto:contact@example.com" className={styles.iconLink} aria-label="Email">
            <Mail size={20} />
          </a>
        </div>
        
        <p className={styles.copyright}>
          © 2026 Ranian. All rights reserved.
        </p>
        
        <p className={styles.tech}>
          Built with Next.js + Supabase
        </p>
      </div>
    </footer>
  );
}
