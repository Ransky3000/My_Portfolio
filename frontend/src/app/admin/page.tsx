'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-auth';
import styles from '@/styles/admin-pages.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0, socialLinks: 0 });

  useEffect(() => {
    async function fetchStats() {
      const [projectsRes, messagesRes, unreadRes, linksRes] = await Promise.all([
        supabaseBrowser.from('projects').select('id', { count: 'exact', head: true }),
        supabaseBrowser.from('contact_submissions').select('id', { count: 'exact', head: true }),
        supabaseBrowser.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('read', false),
        supabaseBrowser.from('social_links').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        projects: projectsRes.count ?? 0,
        messages: messagesRes.count ?? 0,
        unread: unreadRes.count ?? 0,
        socialLinks: linksRes.count ?? 0,
      });
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.projects}</span>
          <span className={styles.statLabel}>Projects</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.messages}</span>
          <span className={styles.statLabel}>Messages</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.unread}</span>
          <span className={styles.statLabel}>Unread</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.socialLinks}</span>
          <span className={styles.statLabel}>Social Links</span>
        </div>
      </div>
    </div>
  );
}
