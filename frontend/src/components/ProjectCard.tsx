'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';
import Image from 'next/image';
import styles from '../styles/projects.module.css';

export interface Project {
  id: string;
  title: string;
  description: string;
  problem?: string;
  solution?: string;
  category: string;
  tech_stack: string[];
  image_url?: string;
  live_url?: string;
  github_url?: string;
  visibility?: 'hidden' | 'visible' | 'featured';
  gallery_urls?: string[];
  stats?: { label: string; value: string }[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ProjectCard({ project, onClick }: { project: Project; onClick?: () => void }) {
  const truncatedDesc = project.description && project.description.length > 100
    ? project.description.substring(0, 100) + '...'
    : project.description;

  return (
    <motion.div 
      className={`${styles.card} ${onClick ? styles.clickableCard : ''}`} 
      variants={cardVariants}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
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
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{project.title}</h3>
          <span className={styles.categoryBadge}>{project.category}</span>
        </div>
        
        {truncatedDesc && <p className={styles.description}>{truncatedDesc}</p>}
        
        <div className={styles.techStack}>
          {project.tech_stack?.slice(0, 4).map((tech) => (
            <span key={tech} className={styles.techTag}>{tech}</span>
          ))}
          {project.tech_stack?.length > 4 && (
            <span className={styles.techTag}>+{project.tech_stack.length - 4}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
