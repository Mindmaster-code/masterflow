'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LayoutDashboard, Shield, LogOut, ChevronDown, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (!session?.user) return null;

  const isAdmin = session.user?.role === 'ADMIN';
  const initials = session.user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const navLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/resumo', icon: TrendingUp, label: 'Resumo' },
    ...(isAdmin ? [{ href: '/admin/students', icon: Shield, label: 'Admin' }] : []),
  ];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all group cursor-pointer focus:outline-none"
        >
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
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className={cn(
            'w-56 rounded-2xl p-2 z-50',
            'bg-[rgba(8,18,32,0.97)] border border-teal-500/15',
            'backdrop-blur-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
          )}
        >
          <DropdownMenu.Label className="px-3 py-2.5">
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
          </DropdownMenu.Label>

          <DropdownMenu.Separator className="mx-1 my-1 h-px bg-teal-500/12" />

          {navLinks.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
            return (
              <DropdownMenu.Item
                key={href}
                onSelect={() => router.push(href)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer outline-none',
                  'text-white/60 hover:text-white hover:bg-teal-500/8 focus:bg-teal-500/8 focus:text-teal-300',
                  isActive && 'text-teal-400 bg-teal-500/10'
                )}
              >
                <Icon className="w-4 h-4 text-teal-500/70" />
                {label}
              </DropdownMenu.Item>
            );
          })}

          <DropdownMenu.Separator className="mx-1 my-1 h-px bg-teal-500/12" />

          <DropdownMenu.Item asChild>
            <a
              href="/api/auth/signout?callbackUrl=/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/8 outline-none cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
