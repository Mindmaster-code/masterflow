'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { EditUserDialog, type EditUserPayload } from './edit-user-dialog';

interface EditUserButtonProps {
  user: EditUserPayload;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  stopPropagation?: boolean;
}

export function EditUserButton({
  user,
  className,
  variant = 'outline',
  size = 'sm',
  stopPropagation = false,
}: EditUserButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={(e) => {
          if (stopPropagation) {
            e.preventDefault();
            e.stopPropagation();
          }
          setOpen(true);
        }}
      >
        <Pencil className="w-4 h-4 mr-1.5" />
        Editar
      </Button>
      <EditUserDialog user={user} open={open} onOpenChange={setOpen} />
    </>
  );
}
