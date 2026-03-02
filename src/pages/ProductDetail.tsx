import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Button from '@/components/Button';
import { ROUTES } from '@/constants';
import { MOCK_PRODUCTS } from '@/mocks/ecommerceMockData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCartThunk, fetchProductBySlugThunk } from '@/store/thunks';

const ProductDetail: React.FC = () => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedProduct, isLoading } = useAppSelector(state => state.products);

  useEffect(() => {
    if (slug) {
      void dispatch(fetchProductBySlugThunk(slug));
    }
  }, [dispatch, slug]);

  const product =
    selectedProduct || MOCK_PRODUCTS.find(item => item.slug === slug) || MOCK_PRODUCTS[0];

  if (isLoading && !selectedProduct) {
    return <p className="text-gray-600 dark:text-gray-300">Loading product...</p>;
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - React Fashion</title>
      </Helmet>
      <div className="space-y-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Link to={ROUTES.PRODUCTS} className="hover:text-primary-600">Products</Link> / {product.name}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img
            src={product.images?.[0]?.imageUrl || 'https://via.placeholder.com/700x700'}
            alt={product.name}
            className="w-full h-[460px] object-cover rounded-2xl"
          />
          <div className="space-y-5">
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
              {product.category.name}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold text-primary-600">
                ${product.salePrice ?? product.price}
              </p>
              {product.salePrice && (
                <p className="text-lg text-gray-400 line-through">${product.price}</p>
              )}
            </div>
            <p className="text-sm text-gray-500">Brand: {product.brand.name}</p>
            <p className="text-sm text-gray-500">Stock: {product.stockQuantity} available</p>
            <div className="flex gap-3">
              <Button
                onClick={() => dispatch(addToCartThunk({ productId: product.id, quantity: 1 }))}
              >
                Add to Cart
              </Button>
              <Button variant="outline" onClick={() => navigate(ROUTES.CART)}>
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
