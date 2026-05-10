'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';
import Image from 'next/image';
import styles from '../styles/projects.module.css';

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url?: string;
  live_url?: string;
  github_url?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div className={styles.card} variants={cardVariants}>
      <div className={styles.imageContainer}>
        {project.image_url ? (
          <Image 
            src={project.image_url} 
            alt={project.title} 
            fill 
            style={{ objectFit: 'cover' }} 
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>No Image</span>
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        
        <div className={styles.techStack}>
          {project.tech_stack?.map((tech) => (
            <span key={tech} className={styles.techTag}>{tech}</span>
          ))}
        </div>
        
        <div className={styles.links}>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
              <Code size={18} /> Code
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
              <ExternalLink size={18} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
