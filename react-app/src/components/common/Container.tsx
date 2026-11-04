import type { ReactNode } from 'react';
import { cn } from '../../utils/format';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}

export default function Container({ children, className, wide = false }: ContainerProps) {
  return <div className={cn(wide ? 'shell-wide' : 'shell', className)}>{children}</div>;
}
