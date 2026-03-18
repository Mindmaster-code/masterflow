'use client';

import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface TagFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  items: string[];
  placeholder: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function TagField({
  value,
  onValueChange,
  items,
  placeholder,
  onAdd,
  onRemove,
}: TagFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className="premium-input h-11 flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        <button
          type="button"
          onClick={onAdd}
          className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:opacity-80"
          style={{
            background: 'rgba(0,151,167,0.15)',
            border: '1px solid rgba(0,151,167,0.25)',
            color: 'rgb(0,151,167)',
          }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
              style={{
                background: 'rgba(0,151,167,0.1)',
                border: '1px solid rgba(0,151,167,0.2)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="transition-colors text-white/30 hover:text-white/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/30 italic">Pressione Enter ou + para adicionar</p>
      )}
    </div>
  );
}
