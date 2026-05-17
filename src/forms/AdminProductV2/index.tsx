import type { FormEventHandler, JSX } from 'react';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import type { SelectOption } from '@/components/FormField';

import AdminProductDetailSection from './components/AdminProductDetailSection';
import AdminProductGalleryModal from './components/AdminProductGalleryModal';
import AdminProductMediaSection from './components/AdminProductMediaSection';
import AdminProductQuickActionsSection from './components/AdminProductQuickActionsSection';
import type {
  AdminProductV2FormMedia,
  AdminProductV2FormMode,
  AdminProductV2FormValues,
} from './types';

export type {
  AdminProductV2FormMedia,
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
  media: AdminProductV2FormMedia;
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
  media,
  brandOptions,
  categoryOptions,
  busy = false,
  className,
}: AdminProductV2FormProps): JSX.Element {
  const readOnly = mode === 'read';
  const fieldsLocked = readOnly || busy;
  const uploadLocked = readOnly || media.uploadBusy;

  const visible = useWatch({ control, name: 'visible' }) ?? false;
  const featured = useWatch({ control, name: 'featured' }) ?? false;

  return (
    <form
      onSubmit={readOnly ? e => e.preventDefault() : onSubmit}
      noValidate
      className={className ?? 'grid grid-cols-12 gap-4'}
    >
      <div className="col-span-12 flex flex-col gap-4 self-stretch lg:col-span-6">
        <AdminProductMediaSection
          coverUrl={media.coverUrl}
          galleryPreview1={media.galleryPreview1}
          galleryPreview2={media.galleryPreview2}
          galleryPreview3={media.galleryPreview3}
          galleryMoreBeyondThirdCount={media.galleryMoreBeyondThirdCount}
          uploadLocked={uploadLocked}
          readOnly={readOnly}
          onCoverClick={media.onCoverClick}
          onGalleryCellClick={media.onGalleryCellClick}
          onMoreGalleryClick={media.onOpenGalleryModal}
          onDashedPlusClick={media.onDashedPlusClick}
        />
        {!readOnly ? (
          <AdminProductGalleryModal
            isOpen={media.galleryModalOpen}
            onClose={media.onCloseGalleryModal}
            imageUrls={media.productImages}
            coverIndex={media.coverIndex}
            onChangeImages={media.onChangeProductImages}
            onChangeCoverIndex={media.onChangeCoverIndex}
            isUploading={uploadLocked}
            onUploadFile={media.onModalUploadFile}
          />
        ) : null}
        <AdminProductQuickActionsSection
          control={control}
          visible={visible}
          featured={featured}
          readOnly={readOnly}
        />
      </div>

      <AdminProductDetailSection
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
