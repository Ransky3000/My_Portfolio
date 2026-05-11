'use client';

import { motion } from 'framer-motion';
import { Zap, Wrench, Rocket } from 'lucide-react';
import styles from '../styles/about.module.css';

const timelinePhases = [
  {
    id: 'foundation',
    icon: <Zap size={24} />,
    title: 'Foundation',
    period: '2021–2023',
    description: 'Started Computer Engineering at JRMSU. Discovered passion for embedded systems, wrote first PIC microcontroller drivers in C.'
  },
  {
    id: 'building',
    icon: <Wrench size={24} />,
    title: 'Building',
    period: '2023–2024',
    description: 'Built real hardware systems (Smart Outlet, Cacao Processor). Learned to bridge firmware with cloud dashboards.'
  },
  {
    id: 'expansion',
    icon: <Rocket size={24} />,
    title: 'Expansion',
    period: '2025–Present',
    description: 'Expanded into AI Automation (n8n, LangChain), Full-Stack Web (Next.js, Supabase), and freelancing on Upwork.'
  }
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
        Career Timeline
      </motion.h2>

      <div className={styles.timeline}>
        {timelinePhases.map((phase, index) => (
          <motion.div 
            key={phase.id}
            className={styles.timelineItem}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className={styles.iconContainer}>
              {phase.icon}
            </div>
            <div className={styles.content}>
              <div className={styles.header}>
                <h3 className={styles.title}>{phase.title}</h3>
                <span className={styles.period}>{phase.period}</span>
              </div>
              <p className={styles.description}>{phase.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
