'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export interface SkillRec {
  type: 'book' | 'movie';
  title: string;
  creator: string;
  coverUrl: string;
  why: string;
}

function RecCard({ rec }: { rec: SkillRec }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="flex gap-3 p-3 rounded-xl"
      style={{ background: 'rgba(13,148,136,0.07)', border: '1px solid rgba(13,148,136,0.15)' }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Cover */}
      <div
        className="flex-shrink-0 w-12 h-[72px] rounded-lg overflow-hidden flex items-center justify-center"
        style={{ background: 'rgba(13,148,136,0.12)' }}
      >
        {!imgError && rec.coverUrl ? (
          <img
            src={rec.coverUrl}
            alt={rec.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl">{rec.type === 'book' ? '📚' : '🎬'}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-0.5">
          {rec.type === 'book' ? '📖 Livro' : '🎬 Filme'}
        </p>
        <p className="text-xs font-bold text-white/90 leading-snug">{rec.title}</p>
        {rec.creator && (
          <p className="text-[11px] text-white/40 mb-1.5">{rec.creator}</p>
        )}
        <p className="text-[11px] text-white/60 leading-relaxed">{rec.why}</p>
      </div>
    </div>
  );
}

interface SkillRecommendationsPanelProps {
  skillName: string;
}

export function SkillRecommendationsPanel({ skillName }: SkillRecommendationsPanelProps) {
  const [open, setOpen] = useState(false);
  const [recs, setRecs] = useState<SkillRec[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!skillName.trim()) return;
    setLoading(true);
    fetch(`/api/recommendations?skill=${encodeURIComponent(skillName)}`)
      .then((res) => res.json())
      .then((data: SkillRec[]) => setRecs(Array.isArray(data) ? data : []))
      .catch(() => setRecs([]))
      .finally(() => setLoading(false));
  }, [skillName]);

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      <button
        className="flex items-center gap-1.5 text-xs text-teal-400/70 hover:text-teal-400 transition-colors w-full group"
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="font-semibold">Livros e filmes para desenvolver essa skill</span>
        {open
          ? <ChevronUp className="w-3.5 h-3.5 ml-auto flex-shrink-0" />
          : <ChevronDown className="w-3.5 h-3.5 ml-auto flex-shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="mt-3 space-y-2.5">
              {loading ? (
                <p className="text-xs text-white/40 py-2">Carregando...</p>
              ) : recs.length === 0 ? (
                <p className="text-xs text-white/40 py-2">Nenhuma recomendação encontrada.</p>
              ) : (
                recs.map((rec, i) => (
                  <RecCard key={i} rec={rec} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
