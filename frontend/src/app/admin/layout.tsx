'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase-auth';
import { Settings, FolderKanban, Link2, MessageSquare, LogOut, LayoutDashboard } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import styles from './admin.module.css';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/settings', label: 'Site Settings', icon: <Settings size={18} /> },
  { href: '/admin/projects', label: 'Projects', icon: <FolderKanban size={18} /> },
  { href: '/admin/social', label: 'Social Links', icon: <Link2 size={18} /> },
  { href: '/admin/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) {
        router.replace('/admin/login');
        return;
      }
      setUser(session.user);
      setLoading(false);
    }
    checkAuth();

    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (pathname === '/admin/login') return;
      if (!session) {
        router.replace('/admin/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.replace('/admin/login');
  }

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--text-muted)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%' }} />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <main className={styles.loginShell}>{children}</main>;
  }

  return (
    <div className={styles.adminShell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>← Portfolio</Link>
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <span className={styles.userEmail}>{user?.email}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
