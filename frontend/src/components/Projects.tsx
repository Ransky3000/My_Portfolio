'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import ProjectCard, { Project } from './ProjectCard';
import styles from '../styles/projects.module.css';

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const categories = ['All', 'iot', 'automation', 'web', 'research', 'open-source'];

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) {
        console.error('Error fetching projects:', error);
      } else if (data) {
        setProjects(data as Project[]);
      }
      setLoading(false);
    }
    
    fetchProjects();
  }, []);

  return (
    <section className={styles.section} id="projects">
      <motion.h2 
        className={styles.heading}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        Featured Projects
      </motion.h2>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No projects found.</div>
      ) : (
        <>
          <div className={styles.filterContainer}>
            {categories.map(category => (
              <button 
                key={category}
                className={`${styles.filterBtn} ${activeFilter === category ? styles.active : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          <motion.div 
            className={styles.grid}
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {projects
              .filter(p => activeFilter === 'All' || p.category === activeFilter)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </>
      )}
    </section>
  );
}
