export default function WordPressPostSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="aspect-[4/3] bg-ink/10" />
      <div className="border-t border-ink/15 pt-5">
        <div className="h-3 w-1/3 bg-ink/10" />
        <div className="mt-4 h-8 w-4/5 bg-ink/10" />
        <div className="mt-3 h-4 w-full bg-ink/10" />
        <div className="mt-2 h-4 w-2/3 bg-ink/10" />
      </div>
    </div>
  );
}
