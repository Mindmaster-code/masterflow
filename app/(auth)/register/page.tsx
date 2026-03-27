'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogIn, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#060d18' }}>
      <div className="absolute inset-0 hero-bg" />
      <div className="orb orb-teal w-80 h-80 top-0 right-[-80px] animate-float" />
      <div className="orb orb-cyan w-64 h-64 bottom-0 left-[-60px] animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-white/35 hover:text-white/70 transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/mindmaster-logo.png" alt="MasterFlow" width={140} height={75} className="h-12 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1.5">
            Cadastro no <span className="brand-gradient-text">MasterFlow</span>
          </h1>
          <p className="text-white/40 text-sm">Acesso exclusivo para alunos da MindMaster</p>
        </div>

        <div className="premium-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center" style={{ boxShadow: '0 6px 16px rgba(0,151,167,0.3)' }}>
              <Mail className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white/90">Cadastro exclusivo</h2>
              <p className="text-xs text-white/35">O cadastro é feito pela MindMaster</p>
            </div>
          </div>

          <p className="text-white/70 text-sm leading-relaxed mb-6">
            O cadastro na plataforma é feito exclusivamente pela MindMaster Treinamentos. Entre em contato conosco ou use as credenciais enviadas por email para acessar sua conta.
          </p>

          <Link href="/login" className="block">
            <Button className="premium-button w-full h-12 rounded-xl text-sm font-semibold">
              <LogIn className="w-4 h-4 mr-2" />
              Ir para Login
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

