'use client';

import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from '../styles/footer.module.css';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string | null;
  display_order: number;
}

/* ─── Raw SVG Icon Components ─── */
const GithubSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const UpworkSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.47 6.07a4.54 4.54 0 0 0-4.38 3.69 19.9 19.9 0 0 1-2.28-4.9H8.55v6.03a2.1 2.1 0 1 1-4.2 0V4.86H2.09v6.03a4.36 4.36 0 0 0 8.71 0v-1a20.3 20.3 0 0 0 1.65 2.7l-1.38 6.55h2.32l1-4.72a5.4 5.4 0 0 0 3.08 1 4.54 4.54 0 0 0 0-9.08zm0 6.83a3.3 3.3 0 0 1-2.54-1.2l.63-2.87c.38-1.56 1.17-2.5 1.91-2.5a2.27 2.27 0 1 1 0 4.54z"></path>
  </svg>
);

function getIconComponent(iconName: string | null) {
  switch (iconName?.toLowerCase()) {
    case 'github': return <GithubSVG />;
    case 'linkedin': return <LinkedinSVG />;
    case 'upwork': return <UpworkSVG />;
    case 'email': case 'mail': return <Mail size={20} />;
    default: return <Mail size={20} />;
  }
}

const FALLBACK_LINKS: SocialLink[] = [
  { id: '1', platform: 'GitHub', url: 'https://github.com/Ransky3000', icon_name: 'github', display_order: 1 },
  { id: '2', platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ranianrulona', icon_name: 'linkedin', display_order: 2 },
  { id: '3', platform: 'Email', url: 'mailto:contact@example.com', icon_name: 'email', display_order: 3 },
];

export default function Footer() {
  const [links, setLinks] = useState<SocialLink[]>(FALLBACK_LINKS);
  const [footerText, setFooterText] = useState<string>('© 2026 Ranian. All rights reserved.');

  useEffect(() => {
    async function fetchData() {
      // Fetch social links
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true });

      if (!socialError && socialData && socialData.length > 0) {
        setLinks(socialData as SocialLink[]);
      }

      // Fetch footer text from site_settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('footer_text')
        .limit(1)
        .single();

      if (!settingsError && settingsData?.footer_text) {
        setFooterText(settingsData.footer_text);
      }
    }
    fetchData();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.socials}>
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.url.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className={styles.iconLink}
              aria-label={link.platform}
            >
              {getIconComponent(link.icon_name)}
            </a>
          ))}
        </div>
        
        <p className={styles.copyright}>
          {footerText}
        </p>
        
        <p className={styles.tech}>
          Built with Next.js + Supabase
        </p>
      </div>
    </footer>
  );
}
