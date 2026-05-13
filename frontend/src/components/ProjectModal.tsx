'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink, Code, Target, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import styles from '../styles/projects.module.css';
import type { Project } from './ProjectCard';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combine image_url and gallery_urls
  const allImages = [
    ...(project?.image_url ? [project.image_url] : []),
    ...(project?.gallery_urls || [])
  ];

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [project, onClose]);

  if (!project) return null;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <AnimatePresence>
      <div className={styles.modalOverlay} onClick={onClose}>
        <motion.div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>

          {allImages.length > 0 && (
            <div className={styles.modalCarousel}>
              {allImages.length > 1 && (
                <button className={`${styles.carouselBtn} ${styles.carouselLeft}`} onClick={handlePrevImage}>
                  <ChevronLeft size={24} />
                </button>
              )}
              
              <Image 
                src={allImages[currentImageIndex]} 
                alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />

              {allImages.length > 1 && (
                <button className={`${styles.carouselBtn} ${styles.carouselRight}`} onClick={handleNextImage}>
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
          )}

          <div className={styles.modalBody}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{project.title}</h2>
              <div className={styles.modalMeta}>
                <span className={styles.categoryBadge}>{project.category}</span>
                <div className={styles.techStack} style={{ marginTop: 0, marginBottom: 0 }}>
                  {project.tech_stack?.map((tech) => (
                    <span key={tech} className={styles.techTag}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalSection}>
              <p>{project.description}</p>
            </div>

            {(project.problem || project.solution) && (
              <div className={styles.modalSection} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {project.problem && (
                  <div>
                    <h4><Target size={18} color="#ef4444" /> The Problem</h4>
                    <p>{project.problem}</p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <h4><Lightbulb size={18} color="#10b981" /> The Solution</h4>
                    <p>{project.solution}</p>
                  </div>
                )}
              </div>
            )}

            {project.stats && project.stats.length > 0 && (
              <div className={styles.statsGrid}>
                {project.stats.map((stat, idx) => (
                  <div key={idx} className={styles.statCard}>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.modalActions}>
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className={`${styles.btnAction} ${styles.btnPrimary}`}>
                  <ExternalLink size={18} /> Live Demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={`${styles.btnAction} ${styles.btnSecondary}`}>
                  <Code size={18} /> View Source
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
