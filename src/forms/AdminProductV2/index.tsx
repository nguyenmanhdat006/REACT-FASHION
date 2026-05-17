import type { FormEventHandler, JSX, MouseEvent } from 'react';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import type { SelectOption } from '@/components/FormField';
import AdminProductFormDetailsSection from './components/AdminAddProductDetailsSection';
import AdminProductFormLeftSection from './components/AdminAddProductLeftSection';

import type { AdminProductV2FormMode, AdminProductV2FormValues } from './types';

export type {
  AdminProductV2FormMode,
  AdminProductV2FormValues,
  AdminProductV2FormMediaInput,
  AdminProductV2UploadIntent,
  ProductV2FormMode,
  ProductV2FormValues,
} from './types';

export type AdminProductV2FormProps = {
  mode: AdminProductV2FormMode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<AdminProductV2FormValues>;
  control: Control<AdminProductV2FormValues>;
  errors: FieldErrors<AdminProductV2FormValues>;
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
  busy?: boolean;
  className?: string;
};

/** @deprecated Use AdminProductV2FormProps */
export type ProductV2FormProps = AdminProductV2FormProps;

export default function AdminProductV2Form({
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
}: AdminProductV2FormProps): JSX.Element {
  const readOnly = mode === 'read';
  const fieldsLocked = readOnly || busy;
  const uploadLocked = readOnly || uploadBusy;

  return (
    <form
      onSubmit={readOnly ? e => e.preventDefault() : onSubmit}
      noValidate
      className={className ?? 'grid grid-cols-12 gap-4'}
    >
      <AdminProductFormLeftSection
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
      <AdminProductFormDetailsSection
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
