import {
  ProductStatus,
  type Product,
  type ProductDocument,
  type ProductImage,
} from '@/types/product/product';

const parseProductStatus = (raw: string | null | undefined): ProductStatus => {
  const s = typeof raw === 'string' ? raw.trim().toUpperCase() : '';
  if (s === ProductStatus.DRAFT) return ProductStatus.DRAFT;
  if (s === ProductStatus.PUBLISHED) return ProductStatus.PUBLISHED;
  if (s === ProductStatus.ARCHIVED) return ProductStatus.ARCHIVED;
  if (s === ProductStatus.OUT_OF_STOCK) return ProductStatus.OUT_OF_STOCK;
  return ProductStatus.DRAFT;
};

/** Map Elasticsearch `ProductDocument` into `Product` for screens that reuse product-shaped rows. */
export function productDocumentToProduct(doc: ProductDocument): Product {
  const images: ProductImage[] = (doc.imageUrls ?? [])
    .filter((u): u is string => Boolean(u?.trim()))
    .map((imageUrl, index) => ({
      imageUrl,
      isPrimary: index === 0,
      displayOrder: index,
    }));

  const category =
    doc.categoryId || doc.categoryName
      ? {
          id: doc.categoryId ?? '',
          name: doc.categoryName ?? '',
          slug: doc.categorySlug ?? '',
        }
      : null;

  const brand =
    doc.brandId || doc.brandName
      ? {
          id: doc.brandId ?? '',
          name: doc.brandName ?? '',
          slug: doc.brandSlug ?? '',
        }
      : null;

  const now = new Date().toISOString();

  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? null,
    shortDescription: doc.shortDescription ?? null,
    price: doc.price ?? 0,
    compareAtPrice: null,
    costPrice: null,
    stockQuantity: doc.stockQuantity ?? null,
    sku: doc.sku ?? null,
    status: parseProductStatus(doc.status),
    published: doc.published ?? null,
    featured: doc.featured ?? null,
    category: category && (category.id || category.name) ? category : null,
    brand: brand && (brand.id || brand.name) ? brand : null,
    images,
    variants: [],
    createdAt: doc.createdAt ?? now,
    updatedAt: doc.updatedAt ?? undefined,
    publishedAt: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
  };
}
