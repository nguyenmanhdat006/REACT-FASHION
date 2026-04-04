import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import Card from '@/components/ui/Card';
import Table from '@/components/data-display/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/form/Input';
import Modal from '@/components/overlay/Modal';
import { productService } from '@/services/product/productService';
import { ProductStatus, type Brand, type Category, type Product } from '@/types/product/product';

type AdminTab = 'products' | 'categories' | 'brands';

interface ProductFormState {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  brandId: string;
  status: ProductStatus;
  published: boolean;
  featured: boolean;
  stockQuantity: string;
  sku: string;
}

interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  active: boolean;
  displayOrder: string;
}

interface BrandFormState {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  active: boolean;
}

const DEFAULT_PRODUCT_FORM: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  price: '',
  compareAtPrice: '',
  categoryId: '',
  brandId: '',
  status: ProductStatus.DRAFT,
  published: false,
  featured: false,
  stockQuantity: '0',
  sku: '',
};

const DEFAULT_CATEGORY_FORM: CategoryFormState = {
  name: '',
  slug: '',
  description: '',
  parentId: '',
  active: true,
  displayOrder: '0',
};

const DEFAULT_BRAND_FORM: BrandFormState = {
  name: '',
  slug: '',
  description: '',
  logoUrl: '',
  active: true,
};

const AdminDashboard: React.FC = () => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [productPage, setProductPage] = useState(0);
  const [productSize] = useState(10);
  const [productTotalElements, setProductTotalElements] = useState(0);
  const [productTotalPages, setProductTotalPages] = useState(0);
  const [productsLoading, setProductsLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);

  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'true' | 'false'>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(DEFAULT_PRODUCT_FORM);
  const [productSubmitting, setProductSubmitting] = useState(false);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(DEFAULT_CATEGORY_FORM);
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandForm, setBrandForm] = useState<BrandFormState>(DEFAULT_BRAND_FORM);
  const [brandSubmitting, setBrandSubmitting] = useState(false);

  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);
  const [syncingSearch, setSyncingSearch] = useState(false);

  const hasSearchFilters = useMemo(() => {
    return (
      keyword.trim().length > 0 ||
      categoryFilter.length > 0 ||
      brandFilter.length > 0 ||
      minPrice.length > 0 ||
      maxPrice.length > 0 ||
      featuredFilter !== 'all'
    );
  }, [brandFilter, categoryFilter, featuredFilter, keyword, maxPrice, minPrice]);

  const loadProducts = async (page: number) => {
    setProductsLoading(true);

    try {
      const baseParams = {
        page,
        size: productSize,
        sortBy,
        sortDirection,
      };

      const response = hasSearchFilters
        ? await productService.searchProducts({
            ...baseParams,
            keyword: keyword.trim() || undefined,
            categoryId: categoryFilter || undefined,
            brandId: brandFilter || undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            featured:
              featuredFilter === 'all' ? undefined : featuredFilter === 'true',
          })
        : await productService.getProducts(baseParams);

      setProducts(response.content);
      setProductPage(response.page);
      setProductTotalElements(response.totalElements);
      setProductTotalPages(response.totalPages);
    } catch {
      toast.error('Khong the tai danh sach san pham');
    } finally {
      setProductsLoading(false);
    }
  };

  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await productService.getCategories();
      setCategories(response);
    } catch {
      toast.error('Khong the tai danh muc');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadBrands = async () => {
    setBrandsLoading(true);
    try {
      const response = await productService.getBrands();
      setBrands(response);
    } catch {
      toast.error('Khong the tai thuong hieu');
    } finally {
      setBrandsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.all([loadCategories(), loadBrands()]);
  }, []);

  useEffect(() => {
    void loadProducts(productPage);
  }, [hasSearchFilters, productPage, productSize, sortBy, sortDirection]);

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm(DEFAULT_PRODUCT_FORM);
  };

  const openCreateProductModal = () => {
    resetProductForm();
    setProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
      categoryId: product.category?.id || '',
      brandId: product.brand?.id || '',
      status: product.status,
      published: Boolean(product.published),
      featured: Boolean(product.featured),
      stockQuantity: String(product.stockQuantity),
      sku: product.sku || '',
    });
    setProductModalOpen(true);
  };

  const handleSubmitProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productForm.categoryId || !productForm.brandId) {
      toast.error('Vui long chon day du danh muc va thuong hieu');
      return;
    }

    setProductSubmitting(true);
    try {
      const payload = {
        name: productForm.name.trim(),
        slug: productForm.slug.trim(),
        description: productForm.description.trim(),
        shortDescription: productForm.shortDescription.trim() || undefined,
        price: Number(productForm.price),
        compareAtPrice: productForm.compareAtPrice
          ? Number(productForm.compareAtPrice)
          : undefined,
        categoryId: productForm.categoryId,
        brandId: productForm.brandId,
        status: productForm.status,
        published: productForm.published,
        featured: productForm.featured,
        stockQuantity: Number(productForm.stockQuantity),
        sku: productForm.sku.trim() || undefined,
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        toast.success('Cap nhat san pham thanh cong');
      } else {
        await productService.createProduct(payload);
        toast.success('Tao san pham thanh cong');
      }

      setProductModalOpen(false);
      resetProductForm();
      await loadProducts(0);
    } catch {
      toast.error('Luu san pham that bai');
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Ban co chac chan muon xoa san pham nay?')) {
      return;
    }

    try {
      await productService.deleteProduct(id);
      toast.success('Xoa san pham thanh cong');
      await loadProducts(productPage);
    } catch {
      toast.error('Xoa san pham that bai');
    }
  };

  const handleOpenImagePicker = (productId: string) => {
    setUploadingProductId(productId);
    imageInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadingProductId) {
      return;
    }

    try {
      await productService.uploadProductImage(uploadingProductId, file);
      toast.success('Upload anh thanh cong');
      await loadProducts(productPage);
    } catch {
      toast.error('Upload anh that bai');
    } finally {
      event.target.value = '';
      setUploadingProductId(null);
    }
  };

  const handleSyncElasticsearch = async () => {
    setSyncingSearch(true);
    try {
      await productService.syncAllProductsToElasticsearch();
      toast.success('Dong bo Elasticsearch thanh cong');
    } catch {
      toast.error('Dong bo Elasticsearch that bai');
    } finally {
      setSyncingSearch(false);
    }
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm(DEFAULT_CATEGORY_FORM);
  };

  const openCreateCategoryModal = () => {
    resetCategoryForm();
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId || '',
      active: category.active ?? true,
      displayOrder: String(category.displayOrder ?? 0),
    });
    setCategoryModalOpen(true);
  };

  const handleSubmitCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCategorySubmitting(true);
    try {
      const payload = {
        name: categoryForm.name.trim(),
        slug: categoryForm.slug.trim(),
        description: categoryForm.description.trim() || undefined,
        parentId: categoryForm.parentId || null,
        active: categoryForm.active,
        displayOrder: Number(categoryForm.displayOrder || '0'),
      };

      if (editingCategory) {
        await productService.updateCategory(editingCategory.id, payload);
        toast.success('Cap nhat danh muc thanh cong');
      } else {
        await productService.createCategory(payload);
        toast.success('Tao danh muc thanh cong');
      }

      setCategoryModalOpen(false);
      resetCategoryForm();
      await loadCategories();
    } catch {
      toast.error('Luu danh muc that bai');
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Ban co chac chan muon xoa danh muc nay?')) {
      return;
    }

    try {
      await productService.deleteCategory(id);
      toast.success('Xoa danh muc thanh cong');
      await loadCategories();
    } catch {
      toast.error('Xoa danh muc that bai');
    }
  };

  const resetBrandForm = () => {
    setEditingBrand(null);
    setBrandForm(DEFAULT_BRAND_FORM);
  };

  const openCreateBrandModal = () => {
    resetBrandForm();
    setBrandModalOpen(true);
  };

  const openEditBrandModal = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandForm({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      logoUrl: brand.logoUrl || '',
      active: brand.active ?? true,
    });
    setBrandModalOpen(true);
  };

  const handleSubmitBrand = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBrandSubmitting(true);
    try {
      const payload = {
        name: brandForm.name.trim(),
        slug: brandForm.slug.trim(),
        description: brandForm.description.trim() || undefined,
        logoUrl: brandForm.logoUrl.trim() || undefined,
        active: brandForm.active,
      };

      if (editingBrand) {
        await productService.updateBrand(editingBrand.id, payload);
        toast.success('Cap nhat thuong hieu thanh cong');
      } else {
        await productService.createBrand(payload);
        toast.success('Tao thuong hieu thanh cong');
      }

      setBrandModalOpen(false);
      resetBrandForm();
      await loadBrands();
    } catch {
      toast.error('Luu thuong hieu that bai');
    } finally {
      setBrandSubmitting(false);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!window.confirm('Ban co chac chan muon xoa thuong hieu nay?')) {
      return;
    }

    try {
      await productService.deleteBrand(id);
      toast.success('Xoa thuong hieu thanh cong');
      await loadBrands();
    } catch {
      toast.error('Xoa thuong hieu that bai');
    }
  };

  const productColumns = [
    {
      key: 'name',
      header: 'San pham',
      render: (item: Product) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
          <p className="text-xs text-gray-500">/{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Danh muc',
      render: (item: Product) => item.category?.name || '-',
    },
    {
      key: 'brand',
      header: 'Thuong hieu',
      render: (item: Product) => item.brand?.name || '-',
    },
    {
      key: 'price',
      header: 'Gia',
      render: (item: Product) => `$${item.price.toFixed(2)}`,
    },
    {
      key: 'stockQuantity',
      header: 'Ton kho',
      render: (item: Product) => item.stockQuantity,
    },
    {
      key: 'status',
      header: 'Trang thai',
      render: (item: Product) => (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
          {item.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Hanh dong',
      render: (item: Product) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditProductModal(item)}>
            Sua
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleOpenImagePicker(item.id)}>
            Upload anh
          </Button>
          <Button size="sm" variant="danger" onClick={() => void handleDeleteProduct(item.id)}>
            Xoa
          </Button>
        </div>
      ),
    },
  ];

  const categoryColumns = [
    {
      key: 'name',
      header: 'Danh muc',
      render: (item: Category) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
          <p className="text-xs text-gray-500">/{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'active',
      header: 'Kich hoat',
      render: (item: Category) => (item.active ? 'Co' : 'Khong'),
    },
    {
      key: 'actions',
      header: 'Hanh dong',
      render: (item: Category) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditCategoryModal(item)}>
            Sua
          </Button>
          <Button size="sm" variant="danger" onClick={() => void handleDeleteCategory(item.id)}>
            Xoa
          </Button>
        </div>
      ),
    },
  ];

  const brandColumns = [
    {
      key: 'name',
      header: 'Thuong hieu',
      render: (item: Brand) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
          <p className="text-xs text-gray-500">/{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'active',
      header: 'Kich hoat',
      render: (item: Brand) => (item.active ? 'Co' : 'Khong'),
    },
    {
      key: 'actions',
      header: 'Hanh dong',
      render: (item: Brand) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditBrandModal(item)}>
            Sua
          </Button>
          <Button size="sm" variant="danger" onClick={() => void handleDeleteBrand(item.id)}>
            Xoa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - React Fashion</title>
      </Helmet>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Products">
            <p className="text-2xl font-bold text-primary-600">{productTotalElements}</p>
          </Card>
          <Card title="Categories">
            <p className="text-2xl font-bold text-primary-600">{categories.length}</p>
          </Card>
          <Card title="Brands">
            <p className="text-2xl font-bold text-primary-600">{brands.length}</p>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === 'products' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('products')}
          >
            Products
          </Button>
          <Button
            variant={activeTab === 'categories' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </Button>
          <Button
            variant={activeTab === 'brands' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('brands')}
          >
            Brands
          </Button>
        </div>

        {activeTab === 'products' && (
          <Card title="Product Management">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Input
                  label="Keyword"
                  value={keyword}
                  onChange={event => setKeyword(event.target.value)}
                  placeholder="Search by name or description"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={event => setCategoryFilter(event.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  >
                    <option value="">All categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Brand
                  </label>
                  <select
                    value={brandFilter}
                    onChange={event => setBrandFilter(event.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  >
                    <option value="">All brands</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Min price"
                  type="number"
                  value={minPrice}
                  onChange={event => setMinPrice(event.target.value)}
                />
                <Input
                  label="Max price"
                  type="number"
                  value={maxPrice}
                  onChange={event => setMaxPrice(event.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Featured
                  </label>
                  <select
                    value={featuredFilter}
                    onChange={event =>
                      setFeaturedFilter(event.target.value as 'all' | 'true' | 'false')
                    }
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  >
                    <option value="all">All</option>
                    <option value="true">Featured</option>
                    <option value="false">Not featured</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={event => setSortBy(event.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  >
                    <option value="createdAt">Created At</option>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="stockQuantity">Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Direction
                  </label>
                  <select
                    value={sortDirection}
                    onChange={event => setSortDirection(event.target.value as 'asc' | 'desc')}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  >
                    <option value="desc">DESC</option>
                    <option value="asc">ASC</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => void loadProducts(0)} isLoading={productsLoading}>
                  Apply filters
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setKeyword('');
                    setCategoryFilter('');
                    setBrandFilter('');
                    setMinPrice('');
                    setMaxPrice('');
                    setFeaturedFilter('all');
                    setSortBy('createdAt');
                    setSortDirection('desc');
                    void loadProducts(0);
                  }}
                >
                  Reset
                </Button>
                <Button variant="outline" onClick={openCreateProductModal}>
                  New product
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => void handleSyncElasticsearch()}
                  isLoading={syncingSearch}
                >
                  Sync Elasticsearch
                </Button>
              </div>

              <Table
                data={products}
                columns={productColumns}
                emptyMessage={productsLoading ? 'Loading products...' : 'No products found'}
              />

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Page {productPage + 1} / {Math.max(productTotalPages, 1)} - {productTotalElements}{' '}
                  products
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={productPage === 0 || productsLoading}
                    onClick={() => setProductPage(prev => Math.max(prev - 1, 0))}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={productPage + 1 >= productTotalPages || productsLoading}
                    onClick={() => setProductPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'categories' && (
          <Card title="Category Management">
            <div className="space-y-4">
              <Button variant="outline" onClick={openCreateCategoryModal}>
                New category
              </Button>
              <Table
                data={categories}
                columns={categoryColumns}
                emptyMessage={categoriesLoading ? 'Loading categories...' : 'No categories found'}
              />
            </div>
          </Card>
        )}

        {activeTab === 'brands' && (
          <Card title="Brand Management">
            <div className="space-y-4">
              <Button variant="outline" onClick={openCreateBrandModal}>
                New brand
              </Button>
              <Table
                data={brands}
                columns={brandColumns}
                emptyMessage={brandsLoading ? 'Loading brands...' : 'No brands found'}
              />
            </div>
          </Card>
        )}

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={event => void handleFileChange(event)}
        />

        <Modal
          isOpen={productModalOpen}
          onClose={() => {
            setProductModalOpen(false);
            resetProductForm();
          }}
          title={editingProduct ? 'Edit product' : 'Create product'}
          size="lg"
        >
          <form onSubmit={event => void handleSubmitProduct(event)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Name"
                value={productForm.name}
                onChange={event =>
                  setProductForm(prev => ({ ...prev, name: event.target.value }))
                }
                required
              />
              <Input
                label="Slug"
                value={productForm.slug}
                onChange={event =>
                  setProductForm(prev => ({ ...prev, slug: event.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={productForm.description}
                onChange={event =>
                  setProductForm(prev => ({ ...prev, description: event.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                rows={4}
                required
              />
            </div>

            <Input
              label="Short description"
              value={productForm.shortDescription}
              onChange={event =>
                setProductForm(prev => ({ ...prev, shortDescription: event.target.value }))
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label="Price"
                type="number"
                value={productForm.price}
                onChange={event =>
                  setProductForm(prev => ({ ...prev, price: event.target.value }))
                }
                required
              />
              <Input
                label="Compare at price"
                type="number"
                value={productForm.compareAtPrice}
                onChange={event =>
                  setProductForm(prev => ({ ...prev, compareAtPrice: event.target.value }))
                }
              />
              <Input
                label="Stock quantity"
                type="number"
                value={productForm.stockQuantity}
                onChange={event =>
                  setProductForm(prev => ({ ...prev, stockQuantity: event.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={productForm.categoryId}
                  onChange={event =>
                    setProductForm(prev => ({ ...prev, categoryId: event.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Brand
                </label>
                <select
                  value={productForm.brandId}
                  onChange={event =>
                    setProductForm(prev => ({ ...prev, brandId: event.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  required
                >
                  <option value="">Select brand</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={productForm.status}
                  onChange={event =>
                    setProductForm(prev => ({
                      ...prev,
                      status: event.target.value as ProductStatus,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                >
                  <option value={ProductStatus.DRAFT}>DRAFT</option>
                  <option value={ProductStatus.PUBLISHED}>PUBLISHED</option>
                  <option value={ProductStatus.ARCHIVED}>ARCHIVED</option>
                  <option value={ProductStatus.OUT_OF_STOCK}>OUT_OF_STOCK</option>
                </select>
              </div>
              <Input
                label="SKU"
                value={productForm.sku}
                onChange={event =>
                  setProductForm(prev => ({ ...prev, sku: event.target.value }))
                }
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={productForm.published}
                  onChange={event =>
                    setProductForm(prev => ({ ...prev, published: event.target.checked }))
                  }
                />
                Published
              </label>

              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={event =>
                    setProductForm(prev => ({ ...prev, featured: event.target.checked }))
                  }
                />
                Featured
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setProductModalOpen(false);
                  resetProductForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={productSubmitting}>
                {editingProduct ? 'Save changes' : 'Create product'}
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={categoryModalOpen}
          onClose={() => {
            setCategoryModalOpen(false);
            resetCategoryForm();
          }}
          title={editingCategory ? 'Edit category' : 'Create category'}
        >
          <form onSubmit={event => void handleSubmitCategory(event)} className="space-y-4">
            <Input
              label="Name"
              value={categoryForm.name}
              onChange={event =>
                setCategoryForm(prev => ({ ...prev, name: event.target.value }))
              }
              required
            />
            <Input
              label="Slug"
              value={categoryForm.slug}
              onChange={event =>
                setCategoryForm(prev => ({ ...prev, slug: event.target.value }))
              }
              required
            />
            <Input
              label="Description"
              value={categoryForm.description}
              onChange={event =>
                setCategoryForm(prev => ({ ...prev, description: event.target.value }))
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Parent category
                </label>
                <select
                  value={categoryForm.parentId}
                  onChange={event =>
                    setCategoryForm(prev => ({ ...prev, parentId: event.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                >
                  <option value="">None</option>
                  {categories
                    .filter(category => category.id !== editingCategory?.id)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
              <Input
                label="Display order"
                type="number"
                value={categoryForm.displayOrder}
                onChange={event =>
                  setCategoryForm(prev => ({ ...prev, displayOrder: event.target.value }))
                }
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={categoryForm.active}
                onChange={event =>
                  setCategoryForm(prev => ({ ...prev, active: event.target.checked }))
                }
              />
              Active
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setCategoryModalOpen(false);
                  resetCategoryForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={categorySubmitting}>
                {editingCategory ? 'Save changes' : 'Create category'}
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={brandModalOpen}
          onClose={() => {
            setBrandModalOpen(false);
            resetBrandForm();
          }}
          title={editingBrand ? 'Edit brand' : 'Create brand'}
        >
          <form onSubmit={event => void handleSubmitBrand(event)} className="space-y-4">
            <Input
              label="Name"
              value={brandForm.name}
              onChange={event =>
                setBrandForm(prev => ({ ...prev, name: event.target.value }))
              }
              required
            />
            <Input
              label="Slug"
              value={brandForm.slug}
              onChange={event =>
                setBrandForm(prev => ({ ...prev, slug: event.target.value }))
              }
              required
            />
            <Input
              label="Description"
              value={brandForm.description}
              onChange={event =>
                setBrandForm(prev => ({ ...prev, description: event.target.value }))
              }
            />
            <Input
              label="Logo URL"
              value={brandForm.logoUrl}
              onChange={event =>
                setBrandForm(prev => ({ ...prev, logoUrl: event.target.value }))
              }
            />

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={brandForm.active}
                onChange={event =>
                  setBrandForm(prev => ({ ...prev, active: event.target.checked }))
                }
              />
              Active
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setBrandModalOpen(false);
                  resetBrandForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={brandSubmitting}>
                {editingBrand ? 'Save changes' : 'Create brand'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default AdminDashboard;
