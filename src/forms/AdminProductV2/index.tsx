import type { JSX } from 'react';
import { useWatch } from 'react-hook-form';

import AdminProductDetailSection from './components/AdminProductDetailSection';
import AdminProductGalleryModal from './components/AdminProductGalleryModal';
import AdminProductMediaSection from './components/AdminProductMediaSection';
import AdminProductQuickActionsSection from './components/AdminProductQuickActionsSection';
import type { AdminProductV2FormMode } from './types';
import { useAdminProductV2Form } from './useAdminProductV2Form';

export type AdminProductV2FormProps = {
  mode: AdminProductV2FormMode;
  productId?: string;
  onSuccess?: () => void;
  className?: string;
};

export default function AdminProductV2Form({
  mode,
  productId,
  onSuccess,
  className,
}: AdminProductV2FormProps): JSX.Element {
  const {
    readOnly,
    register,
    control,
    errors,
    handleSubmit,
    brandOptions,
    categoryOptions,
    busy,
    media,
  } = useAdminProductV2Form({ mode, productId, onSuccess });

  const fieldsLocked = readOnly || busy;
  const uploadLocked = readOnly || media.uploadBusy;
  const visible = useWatch({ control, name: 'visible' }) ?? false;
  const featured = useWatch({ control, name: 'featured' }) ?? false;

  return (
    <>
      {!readOnly ? (
        <input
          ref={media.mainFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          aria-hidden
          tabIndex={-1}
          onChange={media.onMainFileChange}
        />
      ) : null}

      <form
        onSubmit={readOnly ? e => e.preventDefault() : handleSubmit}
        noValidate
        className={className ?? 'grid grid-cols-12 gap-4'}
      >
        <div className="col-span-12 flex flex-col gap-4 self-stretch lg:col-span-6">
          <AdminProductMediaSection
            media={media}
            readOnly={readOnly}
            uploadLocked={uploadLocked}
          />
          {!readOnly ? (
            <AdminProductGalleryModal media={media} uploadLocked={uploadLocked} />
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
    </>
  );
}
