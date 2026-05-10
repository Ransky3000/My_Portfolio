'use client';

import { motion } from 'framer-motion';
import styles from '../styles/about.module.css';

const skills = [
  'C', 'Python', 'TypeScript', 'Next.js', 'React', 
  'Supabase', 'PostgreSQL', 'Embedded Systems', 
  'PIC Microcontrollers', 'ESP32', 'Firebase', 'Git'
];

export default function About() {
  return (
    <section className={styles.section} id="about">
      <motion.h2 
        className={styles.heading}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        About Me
      </motion.h2>

      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <p className={styles.bio}>
          I am a versatile developer with a unique background spanning both embedded hardware and modern web infrastructure. 
          I specialize in building end-to-end solutions, from writing firmware for PIC microcontrollers and ESP32 chips 
          to developing scalable full-stack web applications using Next.js and Supabase. My passion lies in creating 
          seamless bridges between physical devices and elegant, user-friendly digital interfaces.
        </p>

        <div>
          <h3 className={styles.skillsTitle}>Technical Toolkit</h3>
          <div className={styles.skillsGrid}>
            {skills.map((skill, index) => (
              <motion.span 
                key={skill} 
                className={styles.skillPill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
