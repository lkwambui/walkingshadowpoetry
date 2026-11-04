import { useReadingProgress } from '../../hooks/useReadingProgress';

export default function ReadingProgress() {
  const progress = useReadingProgress();

  return (
    <div className="fixed inset-x-0 top-0 z-[90] h-[2px] bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-brand transition-[width] duration-150 ease-out"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
  );
}
