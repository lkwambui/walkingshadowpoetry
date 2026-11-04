import { Link } from 'react-router-dom';
import { cn } from '../../utils/format';

interface WordmarkProps {
  tone?: 'ink' | 'ivory';
  className?: string;
  onClick?: () => void;
}

export default function Wordmark({ className, onClick }: WordmarkProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Walking Shadow Poetry — home"
      className={cn('group inline-flex w-fit shrink-0 items-center', className)}
    >
      <img
        src="/brand/logo-trimmed.png"
        alt="Walking Shadow Poetry"
        width={580}
        height={162}
        className="h-8 w-auto transition-opacity duration-300 group-hover:opacity-80 sm:h-9"
      />
    </Link>
  );
}
