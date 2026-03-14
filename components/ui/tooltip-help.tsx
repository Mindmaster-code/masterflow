'use client';

import { HelpCircle } from 'lucide-react';

interface TooltipHelpProps {
  text: string;
  title?: string;
}

export function TooltipHelp({ text, title }: TooltipHelpProps) {
  return (
    <div className="group relative inline-block">
      <HelpCircle className="w-5 h-5 text-primary/60 hover:text-primary cursor-help transition-colors" />
      <div className="hidden group-hover:block absolute z-50 -top-2 left-8 w-96 p-5 bg-gray-900/95 backdrop-blur-sm border-2 border-primary/30 rounded-xl shadow-2xl">
        {title && <p className="font-bold text-base text-primary mb-2">{title}</p>}
        <p className="text-sm text-white/90 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
