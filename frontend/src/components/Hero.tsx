'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '../styles/hero.module.css';

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
          Hi, I&apos;m <span className={styles.gradientText}>Ranian</span>
        </motion.h1>
        
        <motion.p className={styles.subtitle} variants={itemVariants}>
          Full-Stack Developer & Embedded Systems Engineer. 
          Building seamless bridges between hardware and beautiful interfaces.
        </motion.p>
        
        <motion.div className={styles.ctaContainer} variants={itemVariants}>
          <Link href="#projects" className={styles.btnPrimary} id="hero-btn-projects">
            View Projects
          </Link>
          <Link href="#contact" className={styles.btnSecondary} id="hero-btn-contact">
            Contact Me
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
