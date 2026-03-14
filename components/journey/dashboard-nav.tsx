'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutDashboard, Shield, LogOut, ChevronDown, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function DashboardNav() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (!session?.user) return null;

  const isAdmin = session.user.role === 'ADMIN';
  const initials = session.user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const navLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/resumo',    icon: TrendingUp,      label: 'Resumo'    },
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
          <div
            className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center transition-shadow"
            style={{ boxShadow: '0 4px 12px rgba(13,148,136,0.3)' }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight brand-gradient-text">MasterFlow</span>
            <p className="text-[10px] text-white/30 leading-none mt-0.5">by MindMaster</p>
          </div>
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

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all group cursor-pointer">
              <div
                className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ boxShadow: '0 3px 10px rgba(13,148,136,0.25)' }}
              >
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-white/80 leading-none mb-0.5">
                  {session.user.name?.split(' ')[0]}
                </p>
                <p className="text-[11px] text-white/30 leading-none truncate max-w-[110px]">
                  {session.user.email}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 transition-colors" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-2xl p-2 mt-1.5"
            style={{ background: 'rgba(8,18,32,0.97)', border: '1px solid rgba(13,148,136,0.15)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
          >
            {/* User info */}
            <DropdownMenuLabel className="px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ boxShadow: '0 4px 12px rgba(13,148,136,0.25)' }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/85 truncate">{session.user.name}</p>
                  <p className="text-xs text-white/35 truncate">{session.user.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator style={{ background: 'rgba(13,148,136,0.12)' }} className="mx-1 my-1" />

            {navLinks.map(({ href, icon: Icon, label }) => (
              <DropdownMenuItem
                key={href}
                onClick={() => router.push(href)}
                className="cursor-pointer rounded-xl px-3 py-2.5 text-white/60 hover:text-white gap-3 focus:bg-teal-500/8 focus:text-teal-300"
                style={{ transition: 'all 0.2s' }}
              >
                <Icon className="w-4 h-4 text-teal-500/70" />
                {label}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator style={{ background: 'rgba(13,148,136,0.12)' }} className="mx-1 my-1" />

            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/' })}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-red-400/70 hover:text-red-400 gap-3 focus:bg-red-500/8"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.nav>
  );
}
