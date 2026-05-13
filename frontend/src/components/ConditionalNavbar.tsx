'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ConditionalNavbar({ initialSiteTitle }: { initialSiteTitle: string }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  
  if (isAdmin) return null;
  return <Navbar initialSiteTitle={initialSiteTitle} />;
}
