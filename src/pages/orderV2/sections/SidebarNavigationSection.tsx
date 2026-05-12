import { JSX } from 'react';
import {
  FiTrendingUp,
  FiCompass,
  FiTag,
  FiPercent,
  FiHeart,
  FiPlus,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/auth/useAuth';

const primaryNavigationItems = [
  {
    label: 'Popular Products',
    Icon: FiTrendingUp,
    active: false,
  },
  {
    label: 'Explore New',
    Icon: FiCompass,
    active: true,
  },
  {
    label: 'Clothing',
    Icon: FiTag,
    active: false,
  },
  {
    label: 'Deal',
    Icon: FiPercent,
    active: false,
  },
  {
    label: 'Inspirations',
    Icon: FiHeart,
    active: false,
  },
];

const quickActionItems = [
  {
    label: 'Add Products',
  },
  {
    label: 'Add Users',
  },
];

const lastOrderItems = [
  {
    label: 'Thang dep c...',
    imageClassName: 'bg-[url(/frame-449.png)]',
  },
  {
    label: 'Huddie',
    imageClassName: 'bg-[url(/image.png)]',
  },
];

export const SidebarNavigationSection = (): JSX.Element => {
  const { logout } = useAuth();

  return (
    <aside
      aria-label="Sidebar navigation"
      className="flex h-[982px] w-[300px] flex-col items-center justify-between border-r border-grayscale-100 bg-white px-8 py-12"
    >
      <div className="flex w-full flex-[0_0_auto] flex-col items-start gap-8 self-stretch">
        {/* Logo / Brand */}
        <div className="relative self-stretch font-semibold text-h4 text-black">
          Cartify
        </div>

        <div className="relative flex w-full flex-[0_0_auto] flex-col items-center justify-center gap-[22px] self-stretch">
          <nav
            aria-label="Primary"
            className="flex w-full flex-[0_0_auto] flex-col items-center justify-center gap-[22px] self-stretch"
          >
            {/* Primary nav items */}
            <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch">
              {primaryNavigationItems.map(({ label, Icon, active }) => (
                <button
                  key={label}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex w-full flex-[0_0_auto] items-center gap-2 self-stretch overflow-hidden rounded-2xl p-4 text-left transition-colors ${
                    active ? 'bg-primary-900 text-white' : 'bg-white text-black hover:bg-gray-100'
                  }`}
                  type="button"
                >
                  <div className="relative inline-flex flex-[0_0_auto] items-center justify-center gap-2.5 p-0.5">
                    <Icon className="relative aspect-square h-6 w-6" />
                  </div>
                  <div className="relative w-fit whitespace-nowrap font-body-regular text-[length:var(--regular-body-base-regular-font-size)]">
                    {label}
                  </div>
                </button>
              ))}
            </div>

            <div className="relative h-px w-full self-stretch border-[0.5px] border-solid border-gray-400 bg-white" />

            {/* Quick Actions */}
            <section className="relative flex w-full flex-[0_0_auto] flex-col items-center self-stretch">
              <div className="relative self-stretch font-regular text-caption-lg text-gray-600">
                Quick Actions
              </div>
              <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch">
                {quickActionItems.map(({ label }) => (
                  <button
                    key={label}
                    className="relative flex w-full flex-[0_0_auto] items-center gap-2 self-stretch overflow-hidden rounded-2xl bg-white p-4 text-left hover:bg-gray-50"
                    type="button"
                  >
                    <div className="relative inline-flex flex-[0_0_auto] items-center justify-center gap-2.5 overflow-hidden rounded-md bg-grayscale-50 p-0.5">
                      <FiPlus className="relative aspect-square h-6 w-6" />
                    </div>
                    <div className="text-grayscaleblack relative w-fit whitespace-nowrap font-body-regular">
                      {label}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <div className="relative h-px w-full self-stretch border-[0.5px] border-solid border-gray-400 bg-white" />

            {/* Last Orders */}
            <section className="relative flex w-full flex-[0_0_auto] flex-col items-center self-stretch">
              <div className="relative flex w-full flex-[0_0_auto] items-center gap-0.5 self-stretch">
                <div className="relative w-fit whitespace-nowrap font-regular text-caption-lg text-gray-600">
                  Last Orders
                </div>
                <div className="relative mt-[-1.00px] w-fit whitespace-nowrap font-body-regular text-grayscaleblack">
                  37
                </div>
              </div>
              <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
                {lastOrderItems.map(({ label, imageClassName }) => (
                  <button
                    key={label}
                    className="box-border relative flex w-full flex-[0_0_auto] items-center gap-2 self-stretch overflow-hidden rounded-2xl bg-white px-4 py-2 text-left hover:bg-gray-50"
                    type="button"
                  >
                    <div
                      aria-hidden="true"
                      className={`relative h-7 w-7 rounded-md bg-cover bg-center ${imageClassName}`}
                    />
                    <div className="text-grayscaleblack relative w-fit whitespace-nowrap font-body-regular">
                      {label}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </nav>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="relative flex w-full flex-[0_0_auto] items-center gap-2 self-stretch overflow-hidden rounded-2xl bg-white p-4 text-left hover:bg-red-50"
        type="button"
      >
        <div className="relative inline-flex flex-[0_0_auto] items-center justify-center gap-2.5 p-0.5">
          <FiLogOut className="relative aspect-square h-6 w-6" />
        </div>
        <div className="text-black relative w-fit whitespace-nowrap font-body-regular">
          Logout
        </div>
      </button>
    </aside>
  );
};
