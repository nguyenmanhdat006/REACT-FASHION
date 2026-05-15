import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { useTheme } from '@/hooks/theme/useTheme';
import { Button } from '@/components/ui/button';
import { ROUTES, ROUTESV2 } from '@/constants';

const Layout: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const quickCategories = [
    { label: 'Áo thun', query: 'shirt' },
    { label: 'Váy', query: 'dress' },
    { label: 'Giày', query: 'shoes' },
    { label: 'Túi xách', query: 'bag' },
    { label: 'Phụ kiện', query: 'accessories' },
    { label: 'Sale 50%', query: 'sale' },
  ];

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const keyword = String(formData.get('keyword') || '').trim();

    if (!keyword) {
      navigate(ROUTES.PRODUCTS);
      return;
    }

    navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="bg-primary-600 dark:bg-primary-700 text-white text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Miễn phí vận chuyển đơn từ 199K</span>
              <span className="hidden md:inline">Flash Sale mỗi ngày 12:00</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link to={ROUTES.ADMIN_DASHBOARD} className="hover:underline">
                Kênh người bán
              </Link>
              <Link to={ROUTES.PRODUCTS} className="hover:underline">
                Hỗ trợ
              </Link>
            </div>
          </div>
        </div>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 md:gap-6">
              <Link
                to={ROUTES.HOME}
                className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap"
              >
                FashionMall
              </Link>

              <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
                <input
                  name="keyword"
                  placeholder="Tìm sản phẩm, thương hiệu và shop"
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                  <Button type="submit" variant="default" size="sm" className="h-10 px-5">
                  Tìm
                </Button>
              </form>

              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={toggle}
                  className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>

                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(ROUTESV2.CART)}
                  >
                    Giỏ hàng
                  </Button>
                )}

                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300 max-w-36 truncate">
                      {user?.fullName || user?.email}
                    </span>
                    <Button variant="outline" size="sm" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(ROUTES.LOGIN)}
                    >
                      Login
                    </Button>
                      <Button
                        variant="default"
                      size="sm"
                      onClick={() => navigate(ROUTES.SIGNUP)}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-gray-600 dark:text-gray-300">
              <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400">
                Trang chủ
              </Link>
              <Link to={ROUTES.PRODUCTS} className="hover:text-primary-600 dark:hover:text-primary-400">
                Tất cả sản phẩm
              </Link>
              {quickCategories.map(category => (
                <button
                  key={category.query}
                  onClick={() =>
                    navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(category.query)}`)
                  }
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {category.label}
                </button>
              ))}

              {isAuthenticated && (
                <>
                  <Link
                    to={ROUTES.ORDERS}
                    className="hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Đơn hàng
                  </Link>
                  <Link
                    to={ROUTES.PROFILE}
                    className="hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Tài khoản
                  </Link>
                  {user?.roles?.includes('ADMIN') && (
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      className="hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="lg:hidden flex items-center justify-between pt-1">
              <button
                onClick={toggle}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <div className="flex items-center gap-2">
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(ROUTESV2.CART)}
                  >
                    Giỏ hàng
                  </Button>
                )}
                {isAuthenticated ? (
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(ROUTES.LOGIN)}
                    >
                      Login
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate(ROUTES.SIGNUP)}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <p className="text-xl font-bold text-primary-600 dark:text-primary-400">FashionMall</p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-md">
                Nền tảng mua sắm thời trang chính hãng với giao hàng nhanh, đổi trả minh bạch
                và hỗ trợ khách hàng 24/7.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                Điều hướng
              </p>
              <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <Link to={ROUTES.HOME} className="block hover:text-primary-600 dark:hover:text-primary-400">
                  Trang chủ
                </Link>
                <Link to={ROUTES.PRODUCTS} className="block hover:text-primary-600 dark:hover:text-primary-400">
                  Sản phẩm
                </Link>
                <Link to={ROUTES.ORDERS} className="block hover:text-primary-600 dark:hover:text-primary-400">
                  Theo dõi đơn hàng
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                Liên hệ
              </p>
              <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>Hotline: 1900 6868</p>
                <p>Email: support@fashionmall.vn</p>
                <p>HCM: 123 Nguyen Hue, Q1</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} FashionMall Vietnam.</p>
            <p>Chinh sach bao mat • Dieu khoan su dung</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
