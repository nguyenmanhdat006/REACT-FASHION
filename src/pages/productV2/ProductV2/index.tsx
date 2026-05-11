import { Grid3X3, Mars, Search, Venus } from 'lucide-react';
import { type JSX, useMemo, useState } from 'react';

import { IconButton } from '@/components/buttons/IconButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import { ProductCard } from '@/components/cards/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  type ExploreCategoryId,
  EXPLORE_PRODUCTS,
} from './productsExploreData';

type CategoryFilter = {
  id: ExploreCategoryId;
  label: string;
  icon: typeof Grid3X3;
};

const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all', label: 'All', icon: Grid3X3 },
  { id: 'men', label: 'Men', icon: Mars },
  { id: 'women', label: 'Women', icon: Venus },
];

export default function Products(): JSX.Element {
  const [category, setCategory] = useState<ExploreCategoryId>('all');

  const visibleProducts = useMemo(() => {
    if (category === 'all') return EXPLORE_PRODUCTS;
    return EXPLORE_PRODUCTS.filter((p) => p.category === category);
  }, [category]);

  return (
    <main className="relative mx-auto flex w-full max-w-[1212px] flex-col gap-6 self-stretch px-8 pb-12 pt-2">
      <h1 className="text-h3-medium text-gray-black">Explore</h1>

      <div className="relative flex w-full flex-wrap items-center justify-between gap-4">
        <div
          className="relative inline-flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Category"
        >
          {CATEGORY_FILTERS.map((item) => {
            const Icon = item.icon;
            const selected = category === item.id;
            return (
              <Button
                key={item.id}
                type="button"
                variant={selected ? 'default' : 'ghost'}
                onClick={() => setCategory(item.id)}
                className={cn(
                  'relative flex h-auto items-center gap-2 overflow-hidden rounded-[32px] px-5 py-3 shadow-none',
                  selected
                    ? 'bg-gray-black text-white hover:bg-gray-black/90 hover:text-white'
                    : 'bg-gray-50 text-gray-black hover:bg-gray-100',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="text-body-regular">{item.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="relative flex items-center justify-center gap-2">
          <LabelButton label="Filters" ariaLabel="Open filters" className="min-w-[120px]" />
          <IconButton icon={Search} ariaLabel="Search products" className="px-3 py-3" />
        </div>
      </div>

      <div className="relative grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            imageUrl={product.imageUrl}
            title={product.title}
            price={product.price}
          />
        ))}
      </div>
    </main>
  );
}
