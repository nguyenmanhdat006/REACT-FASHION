import {
  FiTrendingUp,
  FiCompass,
  FiTag,
  FiPercent,
  FiHeart,
  FiPlus,
  FiLogOut,
} from "react-icons/fi";

const primaryNavigationItems = [
  {
    label: "Popular Products",
    Icon: FiTrendingUp,
    active: false,
  },
  {
    label: "Explore New",
    Icon: FiCompass,
    active: true,
  },
  {
    label: "Clothing",
    Icon: FiTag,
    active: false,
  },
  {
    label: "Deal",
    Icon: FiPercent,
    active: false,
  },
  {
    label: "Inspirations",
    Icon: FiHeart,
    active: false,
  },
];

const quickActionItems = [
  {
    label: "Add Products",
  },
  {
    label: "Add Users",
  },
];

const lastOrderItems = [
  {
    label: "Thang dep c...",
    imageClassName: "bg-[url(/frame-449.png)]",
  },
  {
    label: "Huddie",
    imageClassName: "bg-[url(/image.png)]",
  },
];

export const SidebarNavigationSection = (): JSX.Element => {
  return (
    <aside
      aria-label="Sidebar navigation"
      className="flex h-[982px] w-[300px] flex-col items-center justify-between border-r border-grayscale-100 bg-[#ffffff] px-8 py-12 [border-right-style:solid]"
    >
      <div className="flex w-full flex-[0_0_auto] flex-col items-start gap-8 self-stretch">
        {/* Logo / Brand */}
        <div className="relative self-stretch mt-[-1.00px] font-semibold-heading-h4-semibold font-[number:var(--semibold-heading-h4-semibold-font-weight)] text-black text-[length:var(--semibold-heading-h4-semibold-font-size)] tracking-[var(--semibold-heading-h4-semibold-letter-spacing)] leading-[var(--semibold-heading-h4-semibold-line-height)] [font-style:var(--semibold-heading-h4-semibold-font-style)]">
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
                  aria-current={active ? "page" : undefined}
                  className={`relative flex w-full flex-[0_0_auto] items-center gap-2 self-stretch overflow-hidden rounded-2xl p-4 text-left ${
                    active ? "bg-primary-900" : "bg-[#ffffff]"
                  }`}
                  type="button"
                >
                  <div className="relative inline-flex flex-[0_0_auto] items-center justify-center gap-2.5 p-0.5">
                    <Icon className="relative aspect-[1] h-6 w-6" />
                  </div>
                  <div
                    className={`relative w-fit whitespace-nowrap font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] [font-style:var(--regular-body-base-regular-font-style)] ${
                      active ? "text-[#ffffff]" : "text-black"
                    }`}
                  >
                    {label}
                  </div>
                </button>
              ))}
            </div>

            <div className="relative h-px w-full self-stretch border-[0.5px] border-solid border-[#666666] bg-[#ffffff]" />

            {/* Quick Actions */}
            <section className="relative flex w-full flex-[0_0_auto] flex-col items-center self-stretch">
              <div className="relative self-stretch mt-[-1.00px] font-regular-caption-large-regular font-[number:var(--regular-caption-large-regular-font-weight)] text-[#666666] text-[length:var(--regular-caption-large-regular-font-size)] tracking-[var(--regular-caption-large-regular-letter-spacing)] leading-[var(--regular-caption-large-regular-line-height)] [font-style:var(--regular-caption-large-regular-font-style)]">
                Quick Actions
              </div>
              <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch">
                {quickActionItems.map(({ label }) => (
                  <button
                    key={label}
                    className="relative flex w-full flex-[0_0_auto] items-center gap-2 self-stretch overflow-hidden rounded-2xl bg-[#ffffff] p-4 text-left"
                    type="button"
                  >
                    <div className="relative inline-flex flex-[0_0_auto] items-center justify-center gap-2.5 overflow-hidden rounded-md bg-grayscale-50 p-0.5">
                      <FiPlus className="relative aspect-[1] h-6 w-6" />
                    </div>
                    <div className="text-grayscaleblack relative w-fit whitespace-nowrap font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] [font-style:var(--regular-body-base-regular-font-style)]">
                      {label}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <div className="relative h-px w-full self-stretch border-[0.5px] border-solid border-[#666666] bg-[#ffffff]" />

            {/* Last Orders */}
            <section className="relative flex w-full flex-[0_0_auto] flex-col items-center self-stretch">
              <div className="relative flex w-full flex-[0_0_auto] items-center gap-0.5 self-stretch">
                <div className="relative w-fit whitespace-nowrap font-regular-caption-large-regular font-[number:var(--regular-caption-large-regular-font-weight)] text-[#666666] text-[length:var(--regular-caption-large-regular-font-size)] tracking-[var(--regular-caption-large-regular-letter-spacing)] leading-[var(--regular-caption-large-regular-line-height)] [font-style:var(--regular-caption-large-regular-font-style)]">
                  Last Orders
                </div>
                <div className="relative mt-[-1.00px] w-fit whitespace-nowrap font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-grayscaleblack text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] [font-style:var(--regular-body-base-regular-font-style)]">
                  37
                </div>
              </div>
              <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
                {lastOrderItems.map(({ label, imageClassName }) => (
                  <button
                    key={label}
                    className="box-border relative flex w-full flex-[0_0_auto] items-center gap-2 self-stretch overflow-hidden rounded-2xl bg-[#ffffff] px-4 py-2 text-left"
                    type="button"
                  >
                    <div
                      aria-hidden="true"
                      className={`relative h-7 w-7 rounded-md bg-cover bg-[50%_50%] ${imageClassName}`}
                    />
                    <div className="text-grayscaleblack relative w-fit whitespace-nowrap font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] [font-style:var(--regular-body-base-regular-font-style)]">
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
        className="relative flex w-full flex-[0_0_auto] items-center gap-2 self-stretch overflow-hidden rounded-2xl bg-[#ffffff] p-4 text-left"
        type="button"
      >
        <div className="relative inline-flex flex-[0_0_auto] items-center justify-center gap-2.5 p-0.5">
          <FiLogOut className="relative aspect-[1] h-6 w-6" />
        </div>
        <div className="text-black relative w-fit whitespace-nowrap font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] [font-style:var(--regular-body-base-regular-font-style)]">
          Logout
        </div>
      </button>
    </aside>
  );
};