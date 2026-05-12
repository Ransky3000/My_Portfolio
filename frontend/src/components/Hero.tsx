'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../styles/hero.module.css';

interface SiteSettings {
  headline: string;
  subtitle: string | null;
  cv_url: string | null;
}

const DEFAULTS: SiteSettings = {
  headline: 'Computer Engineer &\nAI Automation Developer',
  subtitle: 'Building Solutions. Automating Processes. Connecting Things.',
  cv_url: null,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 50 } }
};

export default function Hero() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('headline, subtitle, cv_url')
        .limit(1)
        .single();

      if (!error && data) {
        setSettings({
          headline: data.headline || DEFAULTS.headline,
          subtitle: data.subtitle || DEFAULTS.subtitle,
          cv_url: data.cv_url || null,
        });
      }
    }
    fetchSettings();
  }, []);

  // Split headline on newline for styling
  const headlineParts = settings.headline.split('\n');

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.bgGradient} />
      
      <motion.div 
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className={styles.title} variants={itemVariants}>
          {headlineParts.length > 1 ? (
            <>
              {headlineParts[0]} <br />
              <span className={styles.gradientText}>{headlineParts[1]}</span>
            </>
          ) : (
            <span className={styles.gradientText}>{settings.headline}</span>
          )}
        </motion.h1>
        
        <motion.p className={styles.subtitle} variants={itemVariants}>
          {settings.subtitle}
        </motion.p>
        
        <motion.div className={styles.ctaContainer} variants={itemVariants}>
          <Link href="#projects" className={styles.btnPrimary} id="hero-btn-projects">
            View Projects
          </Link>
          {settings.cv_url && (
            <a href={settings.cv_url} className={styles.btnSecondary} id="hero-btn-cv" target="_blank" rel="noopener noreferrer">
              <Download size={18} /> Download CV
            </a>
          )}
          <Link href="#contact" className={styles.btnSecondary} id="hero-btn-contact">
            Contact Me
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
