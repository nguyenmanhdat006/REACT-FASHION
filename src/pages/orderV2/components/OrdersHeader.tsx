import { JSX } from 'react';
import { FiBell, FiShoppingCart } from 'react-icons/fi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OrdersHeaderProps {
  orderCount: number;
  userName: string;
  userImage?: string;
}

export const OrdersHeader = ({
  orderCount,
  userName,
  userImage,
}: OrdersHeaderProps): JSX.Element => {
  return (
    <header className="flex flex-col items-center justify-center gap-8 border-b border-grayscale-100 bg-white px-8 py-8">
      <div className="flex flex-col items-start gap-8 self-stretch w-full">
        <div className="flex items-center justify-between self-stretch w-full">
          {/* Order count */}
          <div className="inline-flex items-center gap-2">
            <div className="text-black text-h3 font-medium">
              {orderCount}
            </div>
            <div className="relative w-px h-5 bg-gray-600" />
            <div className="inline-flex flex-col items-center justify-center">
              <div className="text-black font-body-regular">Orders</div>
              <div className="text-gray-600 text-caption-sm-regular">Last 7 days</div>
            </div>
          </div>

          {/* Header actions */}
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex bg-grayscale-50 rounded-full items-center gap-2 p-4 hover:bg-grayscale-100 transition-colors"
            >
              <FiBell className="w-6 h-6" />
            </button>
            <button
              type="button"
              aria-label="Open cart"
              className="inline-flex bg-grayscale-50 rounded-2xl items-center gap-2 p-4 hover:bg-grayscale-100 transition-colors"
            >
              <FiShoppingCart className="w-6 h-6" />
              <div className="text-black font-body-regular">Cart</div>
            </button>
            <button
              type="button"
              aria-label={`User menu for ${userName}`}
              className="inline-flex items-center gap-2 p-2 hover:bg-gray-100 transition-colors rounded-full"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-black font-body-regular">{userName}</span>
            </button>
          </div>
        </div>

        <h1 className="text-black text-h3 font-medium">Orders</h1>
      </div>
    </header>
  );
};
