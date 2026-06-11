import { ProductStatus, type Brand, type Category, type Product } from '@/types/product/product';
import { RESERVED_IMAGE_FILES } from '@/constants/images';

export const MOCK_IMAGE_FILES = [
  '142ff6464265cc363bc4259176eb4aa3.jpg',
  '18fce6a693f14f209e4c5b8718c7b8b3.jpg',
  '2164f1ee2b6a236aea160f5c3012a58b.jpg',
  '2825461b70687c7f9268ba26f3f19e97.jpg',
  '412c92b97939ec0dd50b63e94b869473.jpg',
  '448ff644dea50d9fbc46fd7d4ecf7299.jpg',
  '46af54cdc9a9edda3f59d65c6b65bd98.jpg',
  '598fb723fe6b1e295fb08f90708f66b9.jpg',
  '63a7a935023f5b5b60267186e11ed76e.jpg',
  '7f6970e1a95a78da126656230ec7954b.jpg',
  '88fbb11204d0000bc6cd7aa314030b3a.jpg',
  'a29fe122ff6ca3f26d2ae76f5aaf52b4.jpg',
  'ab6761610000e5eb5f8ecdf749f805691a999711.jpeg',
  'a969277b98cc0b773ffac3b2f4f5c288.jpg',
  'afc25bfa093895ca09c47c858607a986.jpg',
  'c55657c8c6844a1dd4b0032c3fd84534.jpg',
  'c5d88f08c02e003fc4a817c89242dc48.jpg',
  'd0b7f63402d272d23a5d55e60f8ca436.jpg',
  'da9cf868f77fd66605aa1d4067949c3e.jpg',
] as const;

export const mockImageUrl = (filename: string): string => `/images/${filename}`;

const RESERVED_IMAGE_FILE_SET = new Set<string>(RESERVED_IMAGE_FILES);

/** Product catalog only — excludes banner / promo / avatar / UI fallback images. */
export const MOCK_CATALOG_IMAGE_FILES = MOCK_IMAGE_FILES.filter(
  file => !RESERVED_IMAGE_FILE_SET.has(file),
);

const shuffledCatalogAssignments = (count: number): string[] => {
  const pool = [...MOCK_CATALOG_IMAGE_FILES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = (i * 17 + 5) % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return Array.from({ length: count }, (_, index) => pool[index % pool.length]!);
};

const withShuffledCatalogImages = (seeds: ProductSeed[]): ProductSeed[] => {
  const assignments = shuffledCatalogAssignments(seeds.length);
  return seeds.map((seed, index) => ({
    ...seed,
    imageFile: assignments[index]!,
  }));
};

type ProductSeed = {
  id: string;
  name: string;
  slug: string;
  imageFile: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number;
  stockQuantity: number;
  featured: boolean;
  categoryId: string;
  brandId: string;
  sku: string;
  createdAt: string;
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'c-1',
    name: 'Women',
    slug: 'women',
    description: 'Contemporary womenswear and statement pieces',
    productCount: 11,
    active: true,
    displayOrder: 1,
  },
  {
    id: 'c-2',
    name: 'Men',
    slug: 'men',
    description: 'Urban menswear from minimalist to streetwear',
    productCount: 8,
    active: true,
    displayOrder: 2,
  },
  {
    id: 'c-3',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Sneakers, boots, and everyday footwear',
    productCount: 0,
    active: true,
    displayOrder: 3,
  },
  {
    id: 'c-4',
    name: 'Bags',
    slug: 'bags',
    description: 'Totes, shoulder bags, and utility packs',
    productCount: 0,
    active: true,
    displayOrder: 4,
  },
  {
    id: 'c-5',
    name: 'Kids',
    slug: 'kids',
    description: 'Youth and kids fashion',
    productCount: 0,
    active: true,
    displayOrder: 5,
  },
  {
    id: 'c-6',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Jewelry, belts, and finishing touches',
    productCount: 0,
    active: true,
    displayOrder: 6,
  },
  {
    id: 'c-7',
    name: 'Sale',
    slug: 'sale',
    description: 'Limited-time markdowns',
    productCount: 0,
    active: false,
    displayOrder: 7,
  },
  {
    id: 'c-8',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Latest drops and editorial picks',
    productCount: 19,
    active: true,
    displayOrder: 8,
  },
];

export const MOCK_BRANDS: Brand[] = [
  {
    id: 'b-1',
    name: 'UrbanMuse',
    slug: 'urbanmuse',
    description: 'Urban streetwear with clean silhouettes',
    active: true,
  },
  {
    id: 'b-2',
    name: 'NorthLane',
    slug: 'northlane',
    description: 'Outdoor-inspired essentials',
    active: true,
  },
  {
    id: 'b-3',
    name: 'KicksLab',
    slug: 'kickslab',
    description: 'Sneakers and performance footwear',
    active: true,
  },
  {
    id: 'b-4',
    name: 'Mellow',
    slug: 'mellow',
    description: 'Minimal basics and soft tailoring',
    active: true,
  },
  {
    id: 'b-5',
    name: 'LuxeLine',
    slug: 'luxeline',
    description: 'Premium fashion and editorial looks',
    active: true,
  },
  {
    id: 'b-6',
    name: 'EcoWear',
    slug: 'ecowear',
    description: 'Sustainable apparel',
    active: false,
  },
  {
    id: 'b-7',
    name: 'Studio Nine',
    slug: 'studio-nine',
    description: 'Designer collabs and runway edits',
    active: true,
  },
  {
    id: 'b-8',
    name: 'PeakForm',
    slug: 'peakform',
    description: 'Athleisure and track-inspired sets',
    active: true,
  },
];

const categoryById = (id: string): Category =>
  MOCK_CATEGORIES.find(category => category.id === id) ?? MOCK_CATEGORIES[0];

const brandById = (id: string): Brand =>
  MOCK_BRANDS.find(brand => brand.id === id) ?? MOCK_BRANDS[0];

const PRODUCT_SEEDS_RAW: ProductSeed[] = [
  {
    id: 'p-1',
    name: 'Oversized Canvas Work Jacket',
    slug: 'oversized-canvas-work-jacket',
    imageFile: '142ff6464265cc363bc4259176eb4aa3.jpg',
    description:
      'Dark brown canvas work jacket with silver zip closure, relaxed dropped shoulders, and side welt pockets. Layer over a henley for an urban night-out look.',
    shortDescription: 'Relaxed canvas work jacket with zip front.',
    price: 85,
    salePrice: 72,
    stockQuantity: 48,
    featured: true,
    categoryId: 'c-2',
    brandId: 'b-2',
    sku: 'NL-WJ-001',
    createdAt: '2026-02-10T09:00:00Z',
  },
  {
    id: 'p-2',
    name: 'White Essential Street Set',
    slug: 'white-essential-street-set',
    imageFile: '18fce6a693f14f209e4c5b8718c7b8b3.jpg',
    description:
      'Monochrome all-white outfit pairing a relaxed crew-neck tee with straight-leg trousers and a paisley bandana accent. Clean K-fashion summer styling.',
    shortDescription: 'All-white tee and trouser street set.',
    price: 68,
    salePrice: 54,
    stockQuantity: 96,
    featured: true,
    categoryId: 'c-2',
    brandId: 'b-4',
    sku: 'ML-WS-002',
    createdAt: '2026-02-11T09:00:00Z',
  },
  {
    id: 'p-3',
    name: 'Red Square-Neck Crop Top',
    slug: 'red-square-neck-crop-top',
    imageFile: '2164f1ee2b6a236aea160f5c3012a58b.jpg',
    description:
      'Vibrant red cropped top with a wide square neckline and short sleeves. Styled with loose white pants and a white cap for playful streetwear energy.',
    shortDescription: 'Bold red crop top with square neckline.',
    price: 42,
    salePrice: 35,
    stockQuantity: 120,
    featured: true,
    categoryId: 'c-1',
    brandId: 'b-1',
    sku: 'UM-CT-003',
    createdAt: '2026-02-12T09:00:00Z',
  },
  {
    id: 'p-4',
    name: 'HopHo Cropped Varsity Sweatshirt',
    slug: 'hopho-cropped-varsity-sweatshirt',
    imageFile: '2825461b70687c7f9268ba26f3f19e97.jpg',
    description:
      'Royal blue and white varsity sweatshirt with oversized sleeves, ribbed cuffs, and a bold HopHo chest graphic. Cropped fit with an off-shoulder styling option.',
    shortDescription: 'Cropped varsity sweatshirt with contrast sleeves.',
    price: 58,
    salePrice: 45,
    stockQuantity: 72,
    featured: true,
    categoryId: 'c-1',
    brandId: 'b-1',
    sku: 'UM-VS-004',
    createdAt: '2026-02-13T09:00:00Z',
  },
  {
    id: 'p-5',
    name: 'Hamm Kumo Track Set',
    slug: 'hamm-kumo-track-set',
    imageFile: '412c92b97939ec0dd50b63e94b869473.jpg',
    description:
      'Monochrome athleisure set with an oversized track jacket, side-stripe wide-leg pants, and sporty bralette. Finished with a logo cap and chunky mesh sneakers.',
    shortDescription: 'Black track jacket and wide-leg pant set.',
    price: 98,
    salePrice: 82,
    stockQuantity: 55,
    featured: true,
    categoryId: 'c-1',
    brandId: 'b-8',
    sku: 'PF-TS-005',
    createdAt: '2026-02-14T09:00:00Z',
  },
  {
    id: 'p-6',
    name: 'Distressed Oversized Denim Jacket',
    slug: 'distressed-oversized-denim-jacket',
    imageFile: '448ff644dea50d9fbc46fd7d4ecf7299.jpg',
    description:
      'Washed black denim jacket with paint-splatter detailing, chest flap pockets, and intentional fraying. Pairs with black cargo pants for grunge streetwear.',
    shortDescription: 'Oversized distressed denim jacket.',
    price: 89,
    salePrice: 74,
    stockQuantity: 64,
    featured: true,
    categoryId: 'c-2',
    brandId: 'b-1',
    sku: 'UM-DJ-006',
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'p-7',
    name: 'Star Print Wide-Leg Jeans',
    slug: 'star-print-wide-leg-jeans',
    imageFile: '46af54cdc9a9edda3f59d65c6b65bd98.jpg',
    description:
      'Light-wash wide-leg jeans with ruffled waist overlay and bold white star graphics. Y2K streetwear statement piece with matching ribbed tube top styling.',
    shortDescription: 'Ruffled Y2K star-print wide-leg jeans.',
    price: 92,
    salePrice: 78,
    stockQuantity: 44,
    featured: false,
    categoryId: 'c-1',
    brandId: 'b-7',
    sku: 'SN-JN-007',
    createdAt: '2026-02-16T09:00:00Z',
  },
  {
    id: 'p-8',
    name: 'Vintage Plaid Utility Jacket',
    slug: 'vintage-plaid-utility-jacket',
    imageFile: '598fb723fe6b1e295fb08f90708f66b9.jpg',
    description:
      'Earthy brown and charcoal plaid utility jacket with oversized fit, front zip, and flap chest pockets. Layered over black wide-leg jeans for grunge-chic styling.',
    shortDescription: 'Retro plaid utility jacket with relaxed fit.',
    price: 79,
    salePrice: 66,
    stockQuantity: 38,
    featured: false,
    categoryId: 'c-2',
    brandId: 'b-2',
    sku: 'NL-PJ-008',
    createdAt: '2026-02-17T09:00:00Z',
  },
  {
    id: 'p-9',
    name: 'Pink Plaid Co-ord Set',
    slug: 'pink-plaid-coord-set',
    imageFile: '63a7a935023f5b5b60267186e11ed76e.jpg',
    description:
      'Y2K co-ord featuring a pink plaid halter top and distressed patchwork wide-leg jeans with matching plaid belt. Includes star-studded shoulder bag styling.',
    shortDescription: 'Pink plaid halter top and patchwork jeans.',
    price: 105,
    salePrice: 88,
    stockQuantity: 36,
    featured: true,
    categoryId: 'c-1',
    brandId: 'b-7',
    sku: 'SN-CS-009',
    createdAt: '2026-02-18T09:00:00Z',
  },
  {
    id: 'p-10',
    name: 'Ribbed Crop Top & Denim Shorts',
    slug: 'ribbed-crop-top-denim-shorts',
    imageFile: '7f6970e1a95a78da126656230ec7954b.jpg',
    description:
      'Black ribbed high-neck crop top paired with charcoal distressed denim shorts. Minimal streetwear essentials with layered silver jewelry.',
    shortDescription: 'Black crop top and distressed denim shorts.',
    price: 54,
    salePrice: 42,
    stockQuantity: 88,
    featured: false,
    categoryId: 'c-1',
    brandId: 'b-4',
    sku: 'ML-SS-010',
    createdAt: '2026-02-19T09:00:00Z',
  },
  {
    id: 'p-11',
    name: 'Minimalist Black Coach Jacket',
    slug: 'minimalist-black-coach-jacket',
    imageFile: '88fbb11204d0000bc6cd7aa314030b3a.jpg',
    description:
      'Clean black coach jacket over a white polo with charcoal wide-leg pleated trousers and white leather sneakers. Contemporary K-fashion minimalism.',
    shortDescription: 'Lightweight black coach jacket look.',
    price: 75,
    salePrice: 62,
    stockQuantity: 70,
    featured: true,
    categoryId: 'c-2',
    brandId: 'b-4',
    sku: 'ML-CJ-011',
    createdAt: '2026-02-20T09:00:00Z',
  },
  {
    id: 'p-12',
    name: 'Navy Gold-Button Blazer',
    slug: 'navy-gold-button-blazer',
    imageFile: 'a29fe122ff6ca3f26d2ae76f5aaf52b4.jpg',
    description:
      'Single-breasted navy blazer with gold cuff buttons, paired with a striped dress shirt and burgundy repp tie. Smart business look with youthful edge.',
    shortDescription: 'Navy blazer with gold cuff accents.',
    price: 120,
    salePrice: 98,
    stockQuantity: 42,
    featured: true,
    categoryId: 'c-2',
    brandId: 'b-5',
    sku: 'LL-BZ-012',
    createdAt: '2026-02-21T09:00:00Z',
  },
  {
    id: 'p-13',
    name: 'Embellished High-Neck Blouse',
    slug: 'embellished-high-neck-blouse',
    imageFile: 'ab6761610000e5eb5f8ecdf749f805691a999711.jpeg',
    description:
      'Cream high-neck blouse with delicate floral embroidery on textured fabric. Long sleeves with buttoned cuffs and a relaxed yet refined silhouette.',
    shortDescription: 'Artisan cream blouse with embroidery.',
    price: 165,
    salePrice: 138,
    stockQuantity: 28,
    featured: true,
    categoryId: 'c-1',
    brandId: 'b-5',
    sku: 'LL-BL-013',
    createdAt: '2026-02-22T09:00:00Z',
  },
  {
    id: 'p-14',
    name: 'Burgundy Editorial Power Suit',
    slug: 'burgundy-editorial-power-suit',
    imageFile: 'a969277b98cc0b773ffac3b2f4f5c288.jpg',
    description:
      'Deep burgundy oversized blazer and wide-leg pleated trousers with striped shirt and accessorized tie. High-fashion editorial power dressing.',
    shortDescription: 'Burgundy oversized blazer suit set.',
    price: 185,
    salePrice: 159,
    stockQuantity: 22,
    featured: true,
    categoryId: 'c-1',
    brandId: 'b-7',
    sku: 'SN-PS-014',
    createdAt: '2026-02-23T09:00:00Z',
  },
  {
    id: 'p-15',
    name: 'Charcoal Oversized Power Suit',
    slug: 'charcoal-oversized-power-suit',
    imageFile: 'afc25bfa093895ca09c47c858607a986.jpg',
    description:
      'Charcoal oversized single-breasted blazer with matching high-waisted pleated trousers. Modern boss-girl tailoring with minimalist black belt detail.',
    shortDescription: 'Charcoal oversized blazer and trouser set.',
    price: 148,
    salePrice: 125,
    stockQuantity: 34,
    featured: true,
    categoryId: 'c-1',
    brandId: 'b-5',
    sku: 'LL-CS-015',
    createdAt: '2026-02-24T09:00:00Z',
  },
  {
    id: 'p-16',
    name: 'Glossy Burgundy Two-Piece Set',
    slug: 'glossy-burgundy-two-piece-set',
    imageFile: 'c55657c8c6844a1dd4b0032c3fd84534.jpg',
    description:
      'High-shine burgundy crop top and matching shorts with built-in belt. Fingerless gloves and over-the-knee boots complete the cyberpunk streetwear look.',
    shortDescription: 'Shiny burgundy crop top and shorts set.',
    price: 95,
    salePrice: 79,
    stockQuantity: 40,
    featured: false,
    categoryId: 'c-1',
    brandId: 'b-7',
    sku: 'SN-GB-016',
    createdAt: '2026-02-25T09:00:00Z',
  },
  {
    id: 'p-17',
    name: 'Full Denim Canadian Tuxedo',
    slug: 'full-denim-canadian-tuxedo',
    imageFile: 'c5d88f08c02e003fc4a817c89242dc48.jpg',
    description:
      'Matching medium-wash denim trucker jacket and wide-leg jeans with subtle distressing. Styled with chunky black leather boots for modern street edge.',
    shortDescription: 'Matching denim jacket and wide-leg jeans.',
    price: 112,
    salePrice: 94,
    stockQuantity: 52,
    featured: true,
    categoryId: 'c-2',
    brandId: 'b-1',
    sku: 'UM-DN-017',
    createdAt: '2026-02-26T09:00:00Z',
  },
  {
    id: 'p-18',
    name: 'Office Siren Cropped Blazer',
    slug: 'office-siren-cropped-blazer',
    imageFile: 'd0b7f63402d272d23a5d55e60f8ca436.jpg',
    description:
      'Oversized black blazer layered over a cropped white button-down with high-waisted black trousers and thin tie. Modern office-siren business chic.',
    shortDescription: 'Cropped shirt and oversized noir blazer.',
    price: 132,
    salePrice: 109,
    stockQuantity: 46,
    featured: true,
    categoryId: 'c-1',
    brandId: 'b-5',
    sku: 'LL-OS-018',
    createdAt: '2026-02-27T09:00:00Z',
  },
  {
    id: 'p-19',
    name: 'Abstract Wave Zip Shirt',
    slug: 'abstract-wave-zip-shirt',
    imageFile: 'da9cf868f77fd66605aa1d4067949c3e.jpg',
    description:
      'Black zip-up shirt with asymmetrical white wave patterns and matching layered-panel wide-leg trousers. Edgy techwear-inspired street look.',
    shortDescription: 'Wave-print zip shirt with panel trousers.',
    price: 88,
    salePrice: 73,
    stockQuantity: 58,
    featured: false,
    categoryId: 'c-2',
    brandId: 'b-1',
    sku: 'UM-AW-019',
    createdAt: '2026-02-28T09:00:00Z',
  },
];

const PRODUCT_SEEDS = withShuffledCatalogImages(PRODUCT_SEEDS_RAW);

export const buildProductFromSeed = (seed: ProductSeed): Product => {
  const imageUrl = mockImageUrl(seed.imageFile);

  return {
    id: seed.id,
    name: seed.name,
    slug: seed.slug,
    description: seed.description,
    shortDescription: seed.shortDescription,
    price: seed.price,
    compareAtPrice: seed.price,
    salePrice: seed.salePrice,
    stockQuantity: seed.stockQuantity,
    sku: seed.sku,
    status: ProductStatus.PUBLISHED,
    published: true,
    featured: seed.featured,
    category: categoryById(seed.categoryId),
    brand: brandById(seed.brandId),
    images: [
      {
        id: `img-${seed.id}`,
        imageUrl,
        altText: seed.name,
        isPrimary: true,
        displayOrder: 1,
      },
    ],
    createdAt: seed.createdAt,
    updatedAt: '2026-06-01T09:00:00Z',
  };
};

export const MOCK_PRODUCTS: Product[] = PRODUCT_SEEDS.map(buildProductFromSeed);

export const findMockProductById = (productId: string): Product | undefined =>
  MOCK_PRODUCTS.find(product => product.id === productId);

export const findMockProductImageUrl = (productId: string): string =>
  findMockProductById(productId)?.images?.[0]?.imageUrl ?? '';
