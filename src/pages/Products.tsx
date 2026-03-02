import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { ROUTES } from '@/constants';
import { MOCK_PRODUCTS } from '@/mocks/ecommerceMockData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCartThunk, fetchProductsThunk } from '@/store/thunks';

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector(state => state.products);
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search')?.trim().toLowerCase() || '';

  useEffect(() => {
    void dispatch(fetchProductsThunk({ page: 0, size: 12, published: true }));
  }, [dispatch]);

  const productList = items.length > 0 ? items : MOCK_PRODUCTS;
  const filteredProducts = useMemo(() => {
    if (!searchKeyword) {
      return productList;
    }

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

      return searchableText.includes(searchKeyword);
    });
  }, [productList, searchKeyword]);

  return (
    <>
      <Helmet>
        <title>Products - React Fashion</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
            {searchKeyword && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Search: <span className="font-medium text-primary-600 dark:text-primary-300">{searchKeyword}</span>
              </p>
            )}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredProducts.length} products
          </span>
        </div>
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <div className="text-center py-6 space-y-3">
              <p className="text-gray-700 dark:text-gray-300">Không tìm thấy sản phẩm phù hợp.</p>
              <Link to={ROUTES.PRODUCTS} className="inline-block">
                <Button variant="outline" size="sm">
                  Xóa bộ lọc
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
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
        )}
      </div>
    </>
  );
};

export default Products;
