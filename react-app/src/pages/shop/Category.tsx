import { useParams } from 'react-router-dom';
import ProductListing from './ProductListing';
import { shopCategories } from '../../data/shop';

export default function Category() {
  const { slug = '' } = useParams();
  const category = shopCategories.find((entry) => entry.slug === slug);
  const name = category?.name ?? slug.replace(/-/g, ' ');

  return (
    <ProductListing
      eyebrow={category?.tagline ?? 'Category'}
      title={name}
      description={
        category?.description ??
        `Explore ${name} from the Walking Shadow Poetry collection.`
      }
      category={slug}
      canonicalPath={`/shop/categories/${slug}`}
      breadcrumbLabel={name}
      image={category?.image}
    />
  );
}
