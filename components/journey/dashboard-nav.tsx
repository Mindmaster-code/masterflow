'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserMenu } from './user-menu';

export function DashboardNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session?.user) return null;

  const isAdmin = session.user?.role === 'ADMIN';
  const navLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/resumo', icon: TrendingUp, label: 'Resumo' },
    ...(isAdmin ? [{ href: '/admin/students', icon: Shield, label: 'Admin' }] : []),
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(6,13,24,0.85)', backdropFilter: 'blur(20px) saturate(160%)', borderBottom: '1px solid rgba(255,255,255,0.04)' }} />

      <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Image src="/mindmaster-logo.png" alt="MasterFlow" width={120} height={32} className="h-8 w-auto" />
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
            return (
              <Link key={href} href={href}>
                <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              </Link>
            );
          })}
        </div>

        <UserMenu />
      </div>
    </motion.nav>
  );
}
