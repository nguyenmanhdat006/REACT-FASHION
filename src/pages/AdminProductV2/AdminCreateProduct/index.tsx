import { Helmet } from 'react-helmet-async';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type JSX,
  type MouseEvent,
} from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import type { SelectOption } from '@/components/FormField';
import { ROUTESV2 } from '@/constants';
import { useStorage } from '@/hooks/storage/useStorage';
import { useProducts } from '@/hooks/product/useProducts';
import { useAppSelector } from '@/store/hooks';

import AdminProductV2Form from '@/forms/AdminProductV2';
import type { AdminProductV2FormValues, AdminProductV2UploadIntent } from '@/forms/AdminProductV2/types';
import {
  adminAddProductFormToCreateRequest,
  adminAddProductSubmitSchema,
} from './adminAddProductPayload';
import { BRAND_OPTIONS, CATEGORY_OPTIONS } from '@/forms/AdminProductV2/constants';
import type { Category } from '@/types/product/product';

export type { AdminAddProductFormValues, AdminProductV2FormValues } from './types';

function flattenCategories(nodes: Category[]): SelectOption[] {
  const out: SelectOption[] = [];
  const walk = (list: Category[]) => {
    for (const c of list) {
      out.push({ value: c.id, label: c.name });
      if (c.children?.length) walk(c.children);
    }
  };
  walk(nodes);
  return out;
}

export default function AdminCreateProduct(): JSX.Element {
  const navigate = useNavigate();
  const { loadMeta, createProduct } = useProducts();
  const { uploadFile, isUploading } = useStorage();
  const { activeBrands, activeCategories, metaLoading, metaError } = useAppSelector(
    s => s.products
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const uploadIntentRef = useRef<AdminProductV2UploadIntent>({ kind: 'append' });

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    setCoverIndex(c => {
      if (productImages.length === 0) return 0;
      return Math.min(c, productImages.length - 1);
    });
  }, [productImages]);

  const brandOptions = useMemo((): SelectOption[] => {
    if (activeBrands.length > 0) {
      return activeBrands.map(b => ({ value: b.id, label: b.name }));
    }
    if (metaError) {
      return BRAND_OPTIONS;
    }
    return [];
  }, [activeBrands, metaError]);

  const categoryOptions = useMemo((): SelectOption[] => {
    const fromApi = flattenCategories(activeCategories);
    if (fromApi.length > 0) return fromApi;
    if (metaError) {
      return CATEGORY_OPTIONS;
    }
    return [];
  }, [activeCategories, metaError]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdminProductV2FormValues>({
    defaultValues: {
      name: '',
      status: '',
      brand: '',
      category: '',
      subcategory: '',
      price: '',
      discount: '',
      description: '',
      shortDescription: '',
      sku: '',
      stockQuantity: '',
      visible: true,
      featured: false,
    },
  });

  const visible = watch('visible');
  const featured = watch('featured');

  const otherIndices = useMemo(
    () => productImages.map((_, i) => i).filter(i => i !== coverIndex),
    [productImages, coverIndex]
  );

  const othersUrls = useMemo(
    () => otherIndices.map(i => productImages[i]),
    [otherIndices, productImages]
  );

  const galleryPreview1 = othersUrls[0] ?? null;
  const galleryPreview2 = othersUrls[1] ?? null;
  const galleryPreview3 = othersUrls[2] ?? null;
  const galleryMoreBeyondThirdCount = Math.max(0, othersUrls.length - 3);

  const coverUrl =
    productImages.length > 0
      ? productImages[Math.min(coverIndex, productImages.length - 1)]
      : null;

  const requestUpload = useCallback((intent: AdminProductV2UploadIntent) => {
    uploadIntentRef.current = intent;
    mainFileInputRef.current?.click();
  }, []);

  const onMainFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setUploadingFile(true);
    const result = await uploadFile(file);
    setUploadingFile(false);
    if (!result?.url) return;
    const intent = uploadIntentRef.current;
    if (intent.kind === 'append') {
      setProductImages(prev => [...prev, result.url]);
      return;
    }
    if (intent.kind === 'cover') {
      setProductImages(prev => {
        if (prev.length === 0) return [result.url];
        const next = [...prev];
        next[coverIndex] = result.url;
        return next;
      });
      return;
    }
    setProductImages(prev => {
      const next = [...prev];
      next[intent.index] = result.url;
      return next;
    });
  };

  const uploadBusy = isUploading || uploadingFile;
  const formBusy = isSubmitting || metaLoading || uploadBusy;

  const handleCoverClick = (e: MouseEvent) => {
    if (uploadBusy) return;
    if (e.shiftKey) {
      setCoverIndex(0);
      return;
    }
    requestUpload({ kind: 'cover' });
  };

  const handleGalleryCellClick = (which: 0 | 1, e: MouseEvent) => {
    if (uploadBusy) return;
    if (e.shiftKey) {
      const idx = otherIndices[which];
      if (idx !== undefined) setCoverIndex(idx);
      return;
    }
    const idx = otherIndices[which];
    if (idx === undefined) requestUpload({ kind: 'append' });
    else requestUpload({ kind: 'replace', index: idx });
  };

  const handleDashedPlusClick = () => requestUpload({ kind: 'append' });

  const modalUploadSingle = useCallback(
    async (file: File): Promise<string | null> => {
      if (!file.type.startsWith('image/')) return null;
      setUploadingFile(true);
      const res = await uploadFile(file);
      setUploadingFile(false);
      return res?.url ?? null;
    },
    [uploadFile]
  );

  const onSubmit = async (values: AdminProductV2FormValues) => {
    const parsed = adminAddProductSubmitSchema.safeParse(values);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast.error(first?.message ?? 'Validation failed');
      return;
    }
    setIsSubmitting(true);
    const ok = await createProduct(
      adminAddProductFormToCreateRequest(values, {
        imageUrls: [...productImages],
        coverIndex,
      })
    );
    setIsSubmitting(false);
    if (ok) {
      navigate(ROUTESV2.ADMIN_PRODUCTS);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add product — Admin</title>
      </Helmet>

      <input
        ref={mainFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={onMainFileChange}
      />

      <div className="w-full text-foreground">
        <AdminProductV2Form
          mode="create"
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          control={control}
          errors={errors}
          visible={visible}
          featured={featured}
          coverUrl={coverUrl}
          galleryPreview1={galleryPreview1}
          galleryPreview2={galleryPreview2}
          galleryPreview3={galleryPreview3}
          galleryMoreBeyondThirdCount={galleryMoreBeyondThirdCount}
          uploadBusy={uploadBusy}
          galleryModalOpen={galleryModalOpen}
          onOpenGalleryModal={() => setGalleryModalOpen(true)}
          onCloseGalleryModal={() => setGalleryModalOpen(false)}
          productImages={productImages}
          coverIndex={coverIndex}
          onChangeProductImages={setProductImages}
          onChangeCoverIndex={setCoverIndex}
          onCoverClick={handleCoverClick}
          onGalleryCellClick={handleGalleryCellClick}
          onDashedPlusClick={handleDashedPlusClick}
          onModalUploadFile={modalUploadSingle}
          brandOptions={brandOptions}
          categoryOptions={categoryOptions}
          busy={formBusy}
        />
      </div>
    </>
  );
}
