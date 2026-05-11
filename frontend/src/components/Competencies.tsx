'use client';

import { motion } from 'framer-motion';
import { Cpu, Bot, Code2, Wifi } from 'lucide-react';
import styles from '../styles/competencies.module.css';

const capabilities = [
  {
    id: 'hardware',
    icon: <Cpu size={32} />,
    title: 'Hardware-Software Integration',
    description: 'Designing embedded firmware (PIC, ESP32, Arduino) that feeds data into web dashboards and cloud APIs.'
  },
  {
    id: 'ai',
    icon: <Bot size={32} />,
    title: 'AI & Automation Pipelines',
    description: 'Building intelligent workflows using n8n, LangChain, and LangGraph for real-world business automation.'
  },
  {
    id: 'web',
    icon: <Code2 size={32} />,
    title: 'Full-Stack Web Development',
    description: 'End-to-end web apps with Next.js, TypeScript, Supabase (PostgreSQL), and Framer Motion.'
  },
  {
    id: 'iot',
    icon: <Wifi size={32} />,
    title: 'IoT & Real-Time Monitoring',
    description: 'Sensor integration (ACS712, SCT013), real-time data streaming, and cloud-connected control systems.'
  }
];

export default function Competencies() {
  return (
    <section className={styles.section} id="competencies">
      <motion.h2 
        className={styles.heading}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        Core Competencies
      </motion.h2>

      <div className={styles.grid}>
        {capabilities.map((cap, index) => (
          <motion.div 
            key={cap.id}
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className={styles.iconWrapper}>
              {cap.icon}
            </div>
            <h3 className={styles.title}>{cap.title}</h3>
            <p className={styles.description}>{cap.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
