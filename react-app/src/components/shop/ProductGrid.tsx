import { cn } from '../../utils/format';
import type { StoreProduct } from '../../services/storeApi';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductGridProps {
  products: StoreProduct[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export default function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  className,
  columns = 4,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={cn('grid gap-x-5 gap-y-10 sm:gap-x-6', columnClasses[columns], className)}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-x-5 gap-y-10 sm:gap-x-6', columnClasses[columns], className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
