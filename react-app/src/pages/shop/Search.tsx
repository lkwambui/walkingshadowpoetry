import { useSearchParams } from 'react-router-dom';
import ProductListing from './ProductListing';

export default function Search() {
  const [searchParams] = useSearchParams();
  const term = searchParams.get('search') ?? '';

  return (
    <ProductListing
      eyebrow="Search"
      title={term ? `Results for “${term}”` : 'Search the shop'}
      description="Search across poetry-inspired merchandise and personalized pieces."
      canonicalPath="/shop/search"
      breadcrumbLabel="Search"
    />
  );
}
