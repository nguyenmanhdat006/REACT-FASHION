import { useId, useState, useEffect, type JSX } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProductRow = {
  id: string;
  name: string;
  size: string;
  price: string;
  stockLeft: string;
  sold: string;
  category: string;
  image: string;
};

import dashboardService from '@/services/dashboard/dashboardService';
import type { TopProduct } from '@/types/dashboard';

const mapTopProduct = (p: TopProduct): ProductRow => ({
  id: p.productId,
  name: p.productName,
  size: p.size ? `Size: ${p.size}` : 'Size: -',
  price: `$${(p.price / 1000).toFixed(2)}`,
  stockLeft: `${p.stock} Items Left`,
  sold: `${p.totalSold} Sold`,
  category: p.category,
  image: p.imageUrl || '/product-image.png',
});

export const TopProductsTableSection = (): JSX.Element => {
  const selectAllId = useId();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const resp = await dashboardService.getTopProducts(10);
        if (mounted && resp?.data?.products) {
          setProducts(resp.data.products.map(mapTopProduct));
        }
      } catch (err) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const allSelected = products.length > 0 && selectedRows.length === products.length;
  const someSelected = selectedRows.length > 0 && !allSelected;

  const toggleAllRows = () => {
    setSelectedRows(allSelected ? [] : products.map((product) => product.id));
  };

  const toggleRow = (id: string) => {
    setSelectedRows((current) =>
      current.includes(id)
        ? current.filter((rowId) => rowId !== id)
        : [...current, id],
    );
  };

  return (
    <section className="w-full flex-col overflow-hidden rounded-2xl border border-[#e7e7ed] bg-white shadow-sm">
      
      {/* Header Section */}
      <div className="flex items-center border-b border-[#e7e7ed] bg-white px-8 py-4">
        <h2 className="text-lg font-semibold text-black">Top Products</h2>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto">
        <Table className="w-full min-w-[800px]">
          <TableHeader className="bg-white">
            <TableRow className="border-b border-[#e7e7ed] hover:bg-transparent">
              <TableHead className="w-12 px-4 text-center">
                <Checkbox
                  id={selectAllId}
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={toggleAllRows}
                  aria-label="Select all products"
                />
              </TableHead>
              <TableHead className="w-16"></TableHead>
              <TableHead className="w-[320px] font-semibold text-[#272833]">Product Name & Size</TableHead>
              <TableHead className="w-[150px] font-semibold text-[#272833]">Price</TableHead>
              <TableHead className="font-semibold text-[#272833]">Stock</TableHead>
              <TableHead className="text-center font-semibold text-[#272833]">Category</TableHead>
              <TableHead className="w-16 text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-6 text-center text-sm text-[#606060]">
                  No top products
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
              const isSelected = selectedRows.includes(product.id);

              return (
                <TableRow
                  key={product.id}
                  data-state={isSelected ? "selected" : undefined}
                  className="border-none hover:bg-neutral-50"
                >
                  {/* Cột Checkbox */}
                  <TableCell className="px-4 text-center align-middle">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleRow(product.id)}
                      aria-label={`Select ${product.name}`}
                    />
                  </TableCell>

                  {/* Cột Ảnh */}
                  <TableCell className="p-2 align-middle">
                    <div
                      className="mx-auto h-[60px] w-[60px] rounded-lg bg-cover bg-center bg-no-repeat shadow-sm"
                      style={{ backgroundImage: `url(${product.image})` }}
                      aria-hidden="true"
                    />
                  </TableCell>

                  {/* Cột Product Name & Size */}
                  <TableCell className="align-middle">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-normal text-black">{product.name}</span>
                      <span className="text-sm font-medium text-[#272833] opacity-70">{product.size}</span>
                    </div>
                  </TableCell>

                  {/* Cột Price */}
                  <TableCell className="align-middle text-base font-medium text-[#272833]">
                    {product.price}
                  </TableCell>

                  {/* Cột Stock */}
                  <TableCell className="align-middle">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-[#272833]">{product.stockLeft}</span>
                      <span className="text-sm font-medium text-[#272833] opacity-70">{product.sold}</span>
                    </div>
                  </TableCell>

                  {/* Cột Category (Dạng Badge) */}
                  <TableCell className="align-middle text-center">
                    <span className="inline-flex items-center rounded-sm border border-[#89a7e0] bg-white px-3 py-1 text-xs font-semibold tracking-wide text-[#2e5aac]">
                      {product.category}
                    </span>
                  </TableCell>

                  {/* Cột Action Icon */}
                  <TableCell className="align-middle text-center">
                    <button
                      type="button"
                      aria-label={`More actions for ${product.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
                    >
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};