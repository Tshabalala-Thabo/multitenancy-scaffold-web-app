import * as React from 'react';
import { Check, ChevronsUpDown, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconExampleProps {
  className?: string;
}

/**
 * Example component demonstrating the use of Lucide React icons
 */
export function IconExample({ className }: IconExampleProps) {
  return (
    <div className={cn('flex gap-4 items-center', className)}>
      <Check className="h-4 w-4 text-green-500" />
      <ChevronsUpDown className="h-4 w-4 text-gray-500" />
      <User className="h-5 w-5 text-blue-500" />
      <LogOut className="h-5 w-5 text-red-500" />
      <Settings className="h-6 w-6 text-purple-500" />
    </div>
  );
}