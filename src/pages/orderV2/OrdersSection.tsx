import { useMemo, useState } from "react";
import {
  FiBell,
  FiShoppingCart,
  FiInfo,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

type OrderRow = {
  id: string;
  name: string;
  address: string;
  date: string;
  status: string;
  shaded: boolean;
  initiallySelected: boolean;
};

const ordersData: OrderRow[] = [
  {
    id: "000001",
    name: "Jane Cooper",
    address: "979 Immanuel Ferry Suite 526",
    date: "5/27/15",
    status: "Pending",
    shaded: true,
    initiallySelected: true,
  },
  {
    id: "000001",
    name: "Wade Warren",
    address: "979 Immanuel Ferry Suite 526",
    date: "5/19/12",
    status: "Pending",
    shaded: true,
    initiallySelected: true,
  },
  {
    id: "000001",
    name: "Esther Howard",
    address: "979 Immanuel Ferry Suite 526",
    date: "3/4/16",
    status: "Pending",
    shaded: false,
    initiallySelected: false,
  },
  {
    id: "000001",
    name: "Jenny Wilson",
    address: "979 Immanuel Ferry Suite 526",
    date: "3/4/16",
    status: "Pending",
    shaded: false,
    initiallySelected: false,
  },
  {
    id: "000001",
    name: "Guy Hawkins",
    address: "979 Immanuel Ferry Suite 526",
    date: "7/27/13",
    status: "Pending",
    shaded: false,
    initiallySelected: false,
  },
  {
    id: "000001",
    name: "Jacob Jones",
    address: "979 Immanuel Ferry Suite 526",
    date: "5/27/15",
    status: "Pending",
    shaded: true,
    initiallySelected: true,
  },
  {
    id: "000001",
    name: "Ronald Richards",
    address: "979 Immanuel Ferry Suite 526",
    date: "7/11/19",
    status: "Pending",
    shaded: false,
    initiallySelected: false,
  },
  {
    id: "000001",
    name: "Devon Lane",
    address: "979 Immanuel Ferry Suite 526",
    date: "9/23/16",
    status: "Pending",
    shaded: false,
    initiallySelected: false,
  },
  {
    id: "000001",
    name: "Jerome Bell",
    address: "979 Immanuel Ferry Suite 526",
    date: "8/2/19",
    status: "Pending",
    shaded: false,
    initiallySelected: false,
  },
  {
    id: "000001",
    name: "Jerome Bell",
    address: "979 Immanuel Ferry Suite 526",
    date: "8/2/19",
    status: "Pending",
    shaded: false,
    initiallySelected: false,
  },
];

const VIOLET = "#7c3aed";

const headerCellClass =
  "bg-white shadow-[inset_0px_-1px_0px_#e1e1e1] pt-5 pb-[21px] px-5";
const bodyCellBaseClass =
  "pt-5 pb-[21px] px-5 shadow-[inset_0px_-1px_0px_#e1e1e1]";
const bodyCellLastClass = "pt-5 pb-[21px] px-5";
const shadedRowClass = "bg-grey-1";
const plainRowClass = "bg-white";

export const OrdersSection = (): JSX.Element => {
  const [selectedRows, setSelectedRows] = useState<boolean[]>(
    ordersData.map((row) => row.initiallySelected),
  );

  const allSelected = useMemo(
    () => selectedRows.every(Boolean),
    [selectedRows],
  );

  const someSelected = useMemo(
    () => selectedRows.some(Boolean) && !allSelected,
    [selectedRows, allSelected],
  );

  const toggleAllRows = () => {
    const nextValue = !allSelected;
    setSelectedRows(ordersData.map(() => nextValue));
  };

  const toggleRow = (index: number) => {
    setSelectedRows((prev) =>
      prev.map((value, currentIndex) =>
        currentIndex === index ? !value : value,
      ),
    );
  };

  return (
    <section className="flex flex-col w-[1212px] items-start relative self-stretch overflow-y-scroll bg-transparent">
      <header className="flex flex-col items-center justify-center gap-8 pt-8 pb-4 px-8 relative self-stretch w-full flex-[0_0_auto] bg-[#ffffff] border-b [border-bottom-style:solid] border-grayscale-100">
        <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
            {/* Order count */}
            <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto]">
              <div className="text-black text-[length:var(--medium-heading-h3-medium-font-size)] leading-[var(--medium-heading-h3-medium-line-height)] relative w-fit mt-[-1.00px] font-medium-heading-h3-medium font-[number:var(--medium-heading-h3-medium-font-weight)] tracking-[var(--medium-heading-h3-medium-letter-spacing)] whitespace-nowrap [font-style:var(--medium-heading-h3-medium-font-style)]">
                37
              </div>
              <div className="relative w-px h-5 bg-[#666666]" />
              <div className="inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
                <div className="relative self-stretch mt-[-1.00px] font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-black text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] [font-style:var(--regular-body-base-regular-font-style)]">
                  Orders
                </div>
                <div className="relative self-stretch font-regular-caption-small-regular font-[number:var(--regular-caption-small-regular-font-weight)] text-[#666666] text-[length:var(--regular-caption-small-regular-font-size)] tracking-[var(--regular-caption-small-regular-letter-spacing)] leading-[var(--regular-caption-small-regular-line-height)] [font-style:var(--regular-caption-small-regular-font-style)]">
                  Last 7 days
                </div>
              </div>
            </div>

            {/* Header actions */}
            <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
              <button
                type="button"
                aria-label="Notifications"
                className="inline-flex bg-grayscale-50 rounded-[60px] items-center gap-2 p-4 relative flex-[0_0_auto] overflow-hidden"
              >
                <div className="inline-flex items-center justify-center gap-2.5 p-0.5 flex-[0_0_auto] overflow-hidden relative rounded-md">
                  <FiBell className="relative w-6 h-6" />
                </div>
              </button>
              <button
                type="button"
                aria-label="Open cart"
                className="inline-flex bg-grayscale-50 rounded-2xl items-center gap-2 p-4 relative flex-[0_0_auto] overflow-hidden"
              >
                <div className="inline-flex items-center justify-center gap-2.5 p-0.5 flex-[0_0_auto] overflow-hidden relative rounded-md">
                  <FiShoppingCart className="relative w-6 h-6" />
                </div>
                <div className="text-grayscaleblack relative w-fit font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)]">
                  Cart
                </div>
              </button>
              <button
                type="button"
                aria-label="User menu for Tường"
                className="inline-flex items-center justify-center gap-2.5 p-2 flex-[0_0_auto] bg-[#ffffff] overflow-hidden relative rounded-[64px]"
              >
                <div className="w-10 h-10 aspect-[1] bg-[url(/user-avatar.png)] bg-cover bg-[50%_50%] relative rounded-[64px]" />
                <div className="relative w-fit font-regular-body-base-regular font-[number:var(--regular-body-base-regular-font-weight)] text-black text-[length:var(--regular-body-base-regular-font-size)] tracking-[var(--regular-body-base-regular-letter-spacing)] leading-[var(--regular-body-base-regular-line-height)] whitespace-nowrap [font-style:var(--regular-body-base-regular-font-style)]">
                  Tường
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-[38px] relative self-stretch w-full flex-[0_0_auto]">
            <h1 className="relative w-fit mt-[-1.00px] font-medium-heading-h3-medium font-[number:var(--medium-heading-h3-medium-font-weight)] text-black text-[length:var(--medium-heading-h3-medium-font-size)] tracking-[var(--medium-heading-h3-medium-letter-spacing)] leading-[var(--medium-heading-h3-medium-line-height)] whitespace-nowrap [font-style:var(--medium-heading-h3-medium-font-style)]">
              Orders
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center gap-4 p-8 relative flex-1 self-stretch w-full grow">
        <div className="flex items-start relative flex-1 self-stretch w-full grow mt-[-1.00px] ml-[-1.00px] mr-[-1.00px] bg-[#ffffff] rounded-xl overflow-hidden border border-solid border-grey-2">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {/* Select all */}
                  <th className={`w-[62px] ${headerCellClass}`} scope="col">
                    <div className="flex items-center justify-center">
                      <label className="relative inline-flex h-[22px] w-[22px] cursor-pointer items-center justify-center">
                        <input
                          type="checkbox"
                          aria-label="Select all orders"
                          checked={allSelected}
                          onChange={toggleAllRows}
                          className="peer sr-only"
                        />
                        <span
                          className={`relative block h-[22px] w-[22px] rounded-md border-2 border-solid ${
                            allSelected
                              ? "border-[#7c3aed] bg-[#7c3aed]"
                              : someSelected
                                ? "border-[#7c3aed] bg-white"
                                : "border-grey-2 bg-white"
                          }`}
                        >
                          {allSelected ? (
                            <svg
                              viewBox="0 0 22 22"
                              className="absolute inset-0 h-[22px] w-[22px]"
                              aria-hidden="true"
                            >
                              <path
                                d="M6 11.5L9.2 14.5L16 7.5"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : someSelected ? (
                            <span className="absolute left-1/2 top-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7c3aed]" />
                          ) : null}
                        </span>
                      </label>
                    </div>
                  </th>

                  <th className={`w-40 ${headerCellClass}`} scope="col">
                    <div className="flex items-center justify-center gap-2.5">
                      <div className="relative w-fit mt-[-1.00px] font-h1 font-[number:var(--h1-font-weight)] text-grey-3 text-[length:var(--h1-font-size)] tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] [font-style:var(--h1-font-style)]">
                        ID
                      </div>
                    </div>
                  </th>
                  <th className={`w-[363px] ${headerCellClass}`} scope="col">
                    <div className="flex items-center justify-start gap-2.5">
                      <div className="relative w-fit mt-[-1.00px] font-h1 font-[number:var(--h1-font-weight)] text-grey-3 text-[length:var(--h1-font-size)] tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] [font-style:var(--h1-font-style)]">
                        Name
                      </div>
                    </div>
                  </th>
                  <th className={headerCellClass} scope="col">
                    <div className="flex items-center justify-start gap-2.5">
                      <div className="flex-1 relative mt-[-1.00px] font-h1 font-[number:var(--h1-font-weight)] text-grey-3 text-[length:var(--h1-font-size)] tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] [font-style:var(--h1-font-style)]">
                        Address
                      </div>
                    </div>
                  </th>
                  <th className={`w-[125px] ${headerCellClass}`} scope="col">
                    <div className="flex items-center justify-start gap-2.5">
                      <div className="flex-1 relative mt-[-1.00px] font-h1 font-[number:var(--h1-font-weight)] text-grey-3 text-[length:var(--h1-font-size)] tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] [font-style:var(--h1-font-style)]">
                        Date
                      </div>
                    </div>
                  </th>
                  <th className={`w-[175px] ${headerCellClass}`} scope="col">
                    <div className="flex items-center justify-center gap-2.5">
                      <div className="w-[89px] text-center relative mt-[-1.00px] font-h1 font-[number:var(--h1-font-weight)] text-grey-3 text-[length:var(--h1-font-size)] tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] [font-style:var(--h1-font-style)]">
                        Status
                      </div>
                    </div>
                  </th>
                  <th className={`w-16 ${headerCellClass}`} scope="col">
                    <span className="sr-only">Info</span>
                  </th>
                  <th className={`w-16 ${headerCellClass}`} scope="col">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {ordersData.map((order, index) => {
                  const rowBgClass = order.shaded ? shadedRowClass : plainRowClass;
                  const isLastRow = index === ordersData.length - 1;
                  const cellClass = isLastRow ? bodyCellLastClass : bodyCellBaseClass;

                  return (
                    <tr
                      key={`${order.id}-${order.name}-${index}`}
                      className={rowBgClass}
                    >
                      {/* Checkbox */}
                      <td className={`${cellClass} ${rowBgClass}`}>
                        <div className="flex items-center justify-center">
                          <label className="relative inline-flex h-[22px] w-[22px] cursor-pointer items-center justify-center">
                            <input
                              type="checkbox"
                              aria-label={`Select order ${order.id} for ${order.name}`}
                              checked={selectedRows[index]}
                              onChange={() => toggleRow(index)}
                              className="peer sr-only"
                            />
                            <span
                              className={`relative block h-[22px] w-[22px] rounded-md border-2 border-solid ${
                                selectedRows[index]
                                  ? "border-[#7c3aed] bg-[#7c3aed]"
                                  : "border-grey-2 bg-white"
                              }`}
                            >
                              {selectedRows[index] ? (
                                <svg
                                  viewBox="0 0 22 22"
                                  className="absolute inset-0 h-[22px] w-[22px]"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M6 11.5L9.2 14.5L16 7.5"
                                    fill="none"
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : null}
                            </span>
                          </label>
                        </div>
                      </td>

                      {/* ID */}
                      <td className={`${cellClass} ${rowBgClass}`}>
                        <div className="inline-flex flex-col items-start justify-center gap-2.5 relative flex-[0_0_auto]">
                          <div className="relative w-fit mt-[-1.00px] font-3 font-[number:var(--3-font-weight)] text-grey-4 text-[length:var(--3-font-size)] tracking-[var(--3-letter-spacing)] leading-[var(--3-line-height)] [font-style:var(--3-font-style)]">
                            {order.id}
                          </div>
                        </div>
                      </td>

                      {/* Name */}
                      <td className={`${cellClass} ${rowBgClass} w-[363px]`}>
                        <div className="flex flex-col items-start justify-center gap-2.5 relative w-full">
                          <div className="relative self-stretch mt-[-1.00px] font-3 font-[number:var(--3-font-weight)] text-grey-4 text-[length:var(--3-font-size)] tracking-[var(--3-letter-spacing)] leading-[var(--3-line-height)] [font-style:var(--3-font-style)]">
                            {order.name}
                          </div>
                        </div>
                      </td>

                      {/* Address */}
                      <td className={`${cellClass} ${rowBgClass}`}>
                        <div className="flex flex-col items-start justify-center gap-2.5 relative w-full">
                          <p className="relative self-stretch mt-[-1.00px] font-3 font-[number:var(--3-font-weight)] text-grey-4 text-[length:var(--3-font-size)] tracking-[var(--3-letter-spacing)] leading-[var(--3-line-height)] [font-style:var(--3-font-style)]">
                            {order.address}
                          </p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className={`${cellClass} ${rowBgClass} w-[125px]`}>
                        <div className="flex flex-col items-start justify-center gap-2.5 relative flex-1 grow">
                          <div className="relative self-stretch mt-[-1.00px] font-3 font-[number:var(--3-font-weight)] text-grey-4 text-[length:var(--3-font-size)] tracking-[var(--3-letter-spacing)] leading-[var(--3-line-height)] [font-style:var(--3-font-style)]">
                            {order.date}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className={`${cellClass} ${rowBgClass} w-[175px]`}>
                        <div className="flex flex-col items-center justify-center gap-2.5">
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 relative flex-[0_0_auto] bg-statusbggrey rounded-[54px]">
                            <div className="relative w-fit mt-[-1.00px] font-h4 font-[number:var(--h4-font-weight)] text-black text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)]">
                              {order.status}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Info */}
                      <td className={`${cellClass} ${rowBgClass}`}>
                        <div className="inline-flex items-start gap-2.5">
                          <button
                            type="button"
                            aria-label={`View details for order ${order.id} - ${order.name}`}
                            className="inline-flex items-start gap-2.5"
                          >
                            <FiInfo className="relative w-6 h-6" />
                          </button>
                        </div>
                      </td>

                      {/* Delete */}
                      <td className={`${cellClass} ${rowBgClass}`}>
                        <div className="inline-flex items-start gap-2.5">
                          <button
                            type="button"
                            aria-label={`Delete order ${order.id} - ${order.name}`}
                            className="inline-flex items-start gap-2.5"
                          >
                            <FiTrash2 className="relative w-6 h-6" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <nav
          aria-label="Pagination"
          className="inline-flex items-center gap-2.5 px-2.5 py-0 relative flex-[0_0_auto] bg-[#ffffff] rounded-[64px] overflow-hidden shadow-shadow"
        >
          <button
            type="button"
            aria-label="Previous page"
            className="inline-flex flex-col items-center justify-center gap-2.5 p-4 relative flex-[0_0_auto] rounded-[40px]"
          >
            <FiChevronLeft className="relative w-4 h-6" />
          </button>
          <button
            type="button"
            aria-current="page"
            className="px-4 py-2.5 bg-primary-900 rounded-[40px] inline-flex flex-col items-center justify-center gap-2.5 relative flex-[0_0_auto]"
          >
            <div className="flex items-center text-[#ffffff] text-[length:var(--medium-body-base-medium-font-size)] leading-[var(--medium-body-base-medium-line-height)] relative w-fit mt-[-1.00px] font-medium-body-base-medium font-[number:var(--medium-body-base-medium-font-weight)] tracking-[var(--medium-body-base-medium-letter-spacing)] whitespace-nowrap [font-style:var(--medium-body-base-medium-font-style)]">
              1
            </div>
          </button>
          <button
            type="button"
            aria-label="Go to page 2"
            className="p-4 rounded-2xl inline-flex flex-col items-center justify-center gap-2.5 relative flex-[0_0_auto]"
          >
            <div className="relative flex items-center w-fit mt-[-1.00px] font-medium-body-base-medium font-[number:var(--medium-body-base-medium-font-weight)] text-black text-[length:var(--medium-body-base-medium-font-size)] tracking-[var(--medium-body-base-medium-letter-spacing)] leading-[var(--medium-body-base-medium-line-height)] whitespace-nowrap [font-style:var(--medium-body-base-medium-font-style)]">
              2
            </div>
          </button>
          <button
            type="button"
            aria-label="Go to page 3"
            className="p-4 rounded-2xl inline-flex flex-col items-center justify-center gap-2.5 relative flex-[0_0_auto]"
          >
            <div className="relative flex items-center w-fit mt-[-1.00px] font-medium-body-base-medium font-[number:var(--medium-body-base-medium-font-weight)] text-black text-[length:var(--medium-body-base-medium-font-size)] tracking-[var(--medium-body-base-medium-letter-spacing)] leading-[var(--medium-body-base-medium-line-height)] whitespace-nowrap [font-style:var(--medium-body-base-medium-font-style)]">
              3
            </div>
          </button>
          <button
            type="button"
            aria-label="Next page"
            className="inline-flex flex-col items-center justify-center gap-2.5 p-4 relative flex-[0_0_auto] rounded-[40px]"
          >
            <FiChevronRight className="relative w-4 h-6" />
          </button>
        </nav>
      </div>
    </section>
  );
};