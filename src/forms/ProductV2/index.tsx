import type { FormEventHandler, JSX, MouseEvent } from 'react';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import type { SelectOption } from '@/components/FormField';
import AdminAddProductDetailsSection from '@/pages/productV2/AdminAddProduct/sections/AdminAddProductDetailsSection';
import AdminAddProductLeftSection from '@/pages/productV2/AdminAddProduct/sections/AdminAddProductLeftSection';

import type { ProductV2FormMode, ProductV2FormValues } from './types';

export type { ProductV2FormMode, ProductV2FormValues } from './types';

export type ProductV2FormProps = {
  mode: ProductV2FormMode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<ProductV2FormValues>;
  control: Control<ProductV2FormValues>;
  errors: FieldErrors<ProductV2FormValues>;
  visible: boolean;
  featured: boolean;
  coverUrl: string | null;
  galleryPreview1: string | null;
  galleryPreview2: string | null;
  galleryPreview3: string | null;
  galleryMoreBeyondThirdCount: number;
  uploadBusy: boolean;
  galleryModalOpen: boolean;
  onOpenGalleryModal: () => void;
  onCloseGalleryModal: () => void;
  productImages: string[];
  coverIndex: number;
  onChangeProductImages: (next: string[]) => void;
  onChangeCoverIndex: (index: number) => void;
  onCoverClick: (e: MouseEvent) => void;
  onGalleryCellClick: (which: 0 | 1, e: MouseEvent) => void;
  onDashedPlusClick: () => void;
  onModalUploadFile: (file: File) => Promise<string | null>;
  brandOptions: SelectOption[];
  categoryOptions: SelectOption[];
  /** Disables inputs and hides submit (e.g. meta load, upload, parent submit). */
  busy?: boolean;
  className?: string;
};

export default function ProductV2Form({
  mode,
  onSubmit,
  register,
  control,
  errors,
  visible,
  featured,
  coverUrl,
  galleryPreview1,
  galleryPreview2,
  galleryPreview3,
  galleryMoreBeyondThirdCount,
  uploadBusy,
  galleryModalOpen,
  onOpenGalleryModal,
  onCloseGalleryModal,
  productImages,
  coverIndex,
  onChangeProductImages,
  onChangeCoverIndex,
  onCoverClick,
  onGalleryCellClick,
  onDashedPlusClick,
  onModalUploadFile,
  brandOptions,
  categoryOptions,
  busy = false,
  className,
}: ProductV2FormProps): JSX.Element {
  const readOnly = mode === 'read';
  const fieldsLocked = readOnly || busy;
  const uploadLocked = readOnly || uploadBusy;

  return (
    <form
      onSubmit={readOnly ? e => e.preventDefault() : onSubmit}
      noValidate
      className={className ?? 'grid grid-cols-12 gap-4'}
    >
      <AdminAddProductLeftSection
        control={control}
        visible={visible}
        featured={featured}
        coverUrl={coverUrl}
        galleryPreview1={galleryPreview1}
        galleryPreview2={galleryPreview2}
        galleryPreview3={galleryPreview3}
        galleryMoreBeyondThirdCount={galleryMoreBeyondThirdCount}
        uploadLocked={uploadLocked}
        readOnly={readOnly}
        galleryModalOpen={galleryModalOpen}
        onOpenGalleryModal={onOpenGalleryModal}
        onCloseGalleryModal={onCloseGalleryModal}
        productImages={productImages}
        coverIndex={coverIndex}
        onChangeProductImages={onChangeProductImages}
        onChangeCoverIndex={onChangeCoverIndex}
        onCoverClick={onCoverClick}
        onGalleryCellClick={onGalleryCellClick}
        onDashedPlusClick={onDashedPlusClick}
        onModalUploadFile={onModalUploadFile}
      />
      <AdminAddProductDetailsSection
        mode={mode}
        register={register}
        control={control}
        errors={errors}
        brandOptions={brandOptions}
        categoryOptions={categoryOptions}
        readOnly={readOnly}
        isSubmitting={fieldsLocked}
      />
    </form>
  );
}
