import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/constants';
import { useCart } from '@/hooks/cart/useCart';
import { MOCK_CART } from '@/mocks/ecommerce/ecommerceMockData';

const Cart: React.FC = () => {
  const { cart, fetchCart, updateQuantity, removeItem, isLoading } = useCart();

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  const displayCart = cart && cart.items.length > 0 ? cart : MOCK_CART;

  return (
    <>
      <Helmet>
        <title>Cart - React Fashion</title>
      </Helmet>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading cart...</p>
        ) : !displayCart || displayCart.items.length === 0 ? (
          <Card>
            <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
            {displayCart.items.map(item => (
              <Card key={item.id}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.productName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">${item.price} each</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => removeItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            </div>
            <Card className="h-fit">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{displayCart.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${displayCart.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-${displayCart.discount}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary-600">${displayCart.total}</span>
              </div>
              <Link to={ROUTES.CHECKOUT}>
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
