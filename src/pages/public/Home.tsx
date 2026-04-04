import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/constants';
import { MOCK_PRODUCTS } from '@/mocks/ecommerce/ecommerceMockData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFeaturedProductsThunk, fetchCategoriesThunk } from '@/store/thunks';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { featured, categories } = useAppSelector(state => state.products);

  useEffect(() => {
    void dispatch(fetchFeaturedProductsThunk());
    void dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const featuredProducts =
    featured.length > 0 ? featured : MOCK_PRODUCTS.filter(product => product.featured);
  const flashSaleProducts = MOCK_PRODUCTS.filter(product => product.salePrice).slice(0, 4);

  const trustHighlights = [
    { title: 'Miễn phí vận chuyển', description: 'Cho đơn từ 199K toàn quốc' },
    { title: 'Đổi trả 7 ngày', description: 'Kiểm hàng trước khi thanh toán' },
    { title: 'Thanh toán an toàn', description: 'Hỗ trợ nhiều cổng thanh toán' },
    { title: 'Hỗ trợ 24/7', description: 'Chat trực tuyến mọi lúc' },
  ];

  return (
    <>
      <Helmet>
        <title>Home - React Fashion</title>
        <meta name="description" content="Shop latest fashion products" />
      </Helmet>
      <div className="space-y-10">
        <section className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-8 md:p-12 text-white shadow-lg">
          <p className="text-sm md:text-base font-medium mb-2 opacity-90">
            Flash Sale • Free Shipping For Orders Over $50
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            New Season Fashion Collection
          </h1>
          <p className="text-base md:text-lg text-primary-100 mb-8 max-w-2xl">
            Explore trending styles with fast checkout, trusted payment and real-time order tracking.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to={ROUTES.PRODUCTS}>
              <Button variant="secondary" size="lg">
                Shop Now
              </Button>
            </Link>
            <Link to={ROUTES.CART}>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-700 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-primary-700"
              >
                View Cart
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Flash Deals</h2>
            <Link
              to={`${ROUTES.PRODUCTS}?search=sale`}
              className="text-sm font-medium text-primary-600 dark:text-primary-300 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {flashSaleProducts.map(product => {
              const salePrice = product.salePrice ?? product.price;
              const discountPercent = Math.round(((product.price - salePrice) / product.price) * 100);

              return (
                <Link key={product.id} to={ROUTES.PRODUCT_DETAIL(product.slug)}>
                  <Card hover className="h-full">
                    <div className="space-y-3">
                      <div className="relative">
                        <img
                          src={product.images?.[0]?.imageUrl || 'https://via.placeholder.com/400x280'}
                          alt={product.name}
                          className="w-full h-36 object-cover rounded-lg"
                        />
                        <span className="absolute top-2 left-2 px-2 py-1 rounded bg-primary-600 text-white text-xs font-bold">
                          -{discountPercent}%
                        </span>
                      </div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-primary-600 font-bold">${salePrice}</span>
                        <span className="text-xs text-gray-400 line-through">${product.price}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.length > 0 ? (
              categories.slice(0, 6).map(category => (
                <button
                  key={category.id}
                  onClick={() => navigate(`${ROUTES.PRODUCTS}?categoryId=${category.id}`)}
                  className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                >
                  {category.name}
                </button>
              ))
            ) : (
              <p className="text-gray-600">Loading categories...</p>
            )}
          </div>
        </section>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map(product => (
              <Card key={product.id} hover>
                <img
                  src={product.images?.[0]?.imageUrl || 'https://via.placeholder.com/400x280'}
                  alt={product.name}
                  className="w-full h-44 object-cover rounded-lg mb-3"
                />
                <span className="inline-flex px-2 py-1 mb-2 text-xs font-semibold rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
                  {product.category.name}
                </span>
                <Link
                  to={ROUTES.PRODUCT_DETAIL(product.slug)}
                  className="font-semibold text-gray-900 dark:text-white hover:text-primary-600"
                >
                  {product.name}
                </Link>
                <div className="mt-3 flex items-center gap-2">
                  <p className="text-primary-600 font-bold">
                    ${product.salePrice ?? product.price}
                  </p>
                  {product.salePrice && (
                    <p className="text-sm text-gray-400 line-through">${product.price}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustHighlights.map(item => (
            <Card key={item.title} className="h-full">
              <div className="space-y-1">
                <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </>
  );
};

export default Home;
