import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Input from '@/components/form/Input';
import { ROUTES } from '@/constants';
import { MOCK_PRODUCTS } from '@/mocks/ecommerce/ecommerceMockData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCartThunk, fetchProductsThunk, fetchCategoriesThunk, fetchBrandsThunk } from '@/store/thunks';

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, isLoading, categories, brands } = useAppSelector(state => state.products);
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search')?.trim().toLowerCase() || '';
  const selectedCategoryId = searchParams.get('categoryId') || '';
  const selectedBrandId = searchParams.get('brandId') || '';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  const [localMinPrice, setLocalMinPrice] = React.useState(minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = React.useState(maxPrice?.toString() || '');

  useEffect(() => {
    void dispatch(fetchProductsThunk({ page: 0, size: 12, published: true }));
    void dispatch(fetchCategoriesThunk());
    void dispatch(fetchBrandsThunk());
  }, [dispatch]);

  const loadFilteredProducts = async () => {
    const queryParams = new URLSearchParams();

    if (searchKeyword) {
      queryParams.set('search', searchKeyword);
    }
    if (selectedCategoryId) {
      queryParams.set('categoryId', selectedCategoryId);
    }
    if (selectedBrandId) {
      queryParams.set('brandId', selectedBrandId);
    }
    if (localMinPrice) {
      queryParams.set('minPrice', localMinPrice);
    }
    if (localMaxPrice) {
      queryParams.set('maxPrice', localMaxPrice);
    }

    navigate(`${ROUTES.PRODUCTS}?${queryParams.toString()}`);
  };

  const clearFilters = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    navigate(ROUTES.PRODUCTS);
  };

  const navigateToCategory = (categoryId: string) => {
    navigate(`${ROUTES.PRODUCTS}?categoryId=${categoryId}`);
  };

  const productList = items.length > 0 ? items : MOCK_PRODUCTS;
  const filteredProducts = useMemo(() => {
    return productList.filter(product => {
      const searchableText = [
        product.name,
        product.shortDescription,
        product.description,
        product.category.name,
        product.brand.name,
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch = !searchKeyword || searchableText.includes(searchKeyword);
      const matchesCategory = !selectedCategoryId || product.category.id === selectedCategoryId;
      const matchesBrand = !selectedBrandId || product.brand.id === selectedBrandId;
      const matchesMinPrice = minPrice === undefined || product.price >= minPrice;
      const matchesMaxPrice = maxPrice === undefined || product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice;
    });
  }, [productList, searchKeyword, selectedCategoryId, selectedBrandId, minPrice, maxPrice]);

  return (
    <>
      <Helmet>
        <title>Products - React Fashion</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          {(searchKeyword || selectedCategoryId || selectedBrandId || minPrice || maxPrice) && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {[
                searchKeyword && `Search: "${searchKeyword}"`,
                selectedCategoryId && `Category: "${categories.find(c => c.id === selectedCategoryId)?.name || selectedCategoryId}"`,
                selectedBrandId && `Brand: "${brands.find(b => b.id === selectedBrandId)?.name || selectedBrandId}"`,
                minPrice && `Min: $${minPrice}`,
                maxPrice && `Max: $${maxPrice}`,
              ]
                .filter(Boolean)
                .join(' • ')}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="Filters" className="sticky top-20">
              <div className="space-y-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Category
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {!selectedCategoryId && (
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked
                          onChange={() => {}}
                          className="rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300">All</span>
                      </label>
                    )}
                    {categories.map(category => (
                      <label
                        key={category.id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategoryId === category.id}
                          onChange={() => navigateToCategory(category.id)}
                          className="rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Brand
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {!selectedBrandId && (
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked
                          onChange={() => {}}
                          className="rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300">All</span>
                      </label>
                    )}
                    {brands.map(brand => (
                      <label
                        key={brand.id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrandId === brand.id}
                          onChange={() => {
                            const newParams = new URLSearchParams(window.location.search);
                            if (selectedBrandId === brand.id) {
                              newParams.delete('brandId');
                            } else {
                              newParams.set('brandId', brand.id);
                            }
                            navigate(`${ROUTES.PRODUCTS}?${newParams.toString()}`);
                          }}
                          className="rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {brand.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Price Range
                  </h3>
                  <Input
                    type="number"
                    label="Min"
                    value={localMinPrice}
                    onChange={e => setLocalMinPrice(e.target.value)}
                    placeholder="0"
                  />
                  <Input
                    type="number"
                    label="Max"
                    value={localMaxPrice}
                    onChange={e => setLocalMaxPrice(e.target.value)}
                    placeholder="9999"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => void loadFilteredProducts()}
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <Card>
              <div className="text-center py-6 space-y-3">
                <p className="text-gray-700 dark:text-gray-300">Không tìm thấy sản phẩm phù hợp.</p>
                <button onClick={clearFilters} className="inline-block">
                  <Button variant="outline" size="sm">
                    Xóa bộ lọc
                  </Button>
                </button>
              </div>
            </Card>
          ) : (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {filteredProducts.length} products
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} hover>
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={product.images?.[0]?.imageUrl || 'https://via.placeholder.com/400x300'}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {product.salePrice && (
                      <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded bg-primary-600 text-white">
                        SALE
                      </span>
                    )}
                  </div>
                  <Link
                    to={ROUTES.PRODUCT_DETAIL(product.slug)}
                    className="font-semibold text-lg text-gray-900 dark:text-white hover:text-primary-600"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-primary-700 dark:text-primary-300 font-medium">
                    {product.category.name} • {product.brand.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {product.shortDescription || product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary-600">
                        ${product.salePrice ?? product.price}
                      </span>
                      {product.salePrice && (
                        <span className="text-sm text-gray-400 line-through">${product.price}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        dispatch(addToCartThunk({ productId: product.id, quantity: 1 }))
                      }
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
