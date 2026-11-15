export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden="true">
      <div className="aspect-[4/5] w-full animate-pulse bg-ink/5" />
      <div className="mt-4 space-y-2">
        <div className="h-2.5 w-16 animate-pulse bg-ink/10" />
        <div className="h-4 w-3/4 animate-pulse bg-ink/10" />
        <div className="h-3.5 w-20 animate-pulse bg-ink/10" />
      </div>
    </div>
  );
}
