'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { CreateStudentDialog } from './create-student-dialog';

export function CreateStudentButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="premium-button rounded-xl"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Cadastrar usuário
      </Button>
      <CreateStudentDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
