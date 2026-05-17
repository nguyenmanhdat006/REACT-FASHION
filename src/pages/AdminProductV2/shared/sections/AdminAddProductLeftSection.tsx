import type { Control } from 'react-hook-form';
import type { MouseEvent } from 'react';

import type { AdminProductV2FormValues } from '@/forms/AdminProductV2/types';

import AdminAddProductGalleryModal from './AdminAddProductGalleryModal';
import AdminAddProductMediaSection from './AdminAddProductMediaSection';
import AdminAddProductQuickActionsSection from './AdminAddProductQuickActionsSection';

type AdminAddProductLeftSectionProps = {
  control: Control<AdminProductV2FormValues>;
  readOnly?: boolean;
  visible: boolean;
  featured: boolean;
  coverUrl: string | null;
  galleryPreview1: string | null;
  galleryPreview2: string | null;
  galleryPreview3: string | null;
  galleryMoreBeyondThirdCount: number;
  uploadLocked: boolean;
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
};

export default function AdminAddProductLeftSection({
  control,
  readOnly = false,
  visible,
  featured,
  coverUrl,
  galleryPreview1,
  galleryPreview2,
  galleryPreview3,
  galleryMoreBeyondThirdCount,
  uploadLocked,
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
}: AdminAddProductLeftSectionProps) {
  return (
    <div className="col-span-12 flex flex-col gap-4 self-stretch lg:col-span-6">
      <AdminAddProductMediaSection
        coverUrl={coverUrl}
        galleryPreview1={galleryPreview1}
        galleryPreview2={galleryPreview2}
        galleryPreview3={galleryPreview3}
        galleryMoreBeyondThirdCount={galleryMoreBeyondThirdCount}
        uploadLocked={uploadLocked}
        readOnly={readOnly}
        onCoverClick={onCoverClick}
        onGalleryCellClick={onGalleryCellClick}
        onMoreGalleryClick={onOpenGalleryModal}
        onDashedPlusClick={onDashedPlusClick}
      />
      {!readOnly ? (
        <AdminAddProductGalleryModal
          isOpen={galleryModalOpen}
          onClose={onCloseGalleryModal}
          imageUrls={productImages}
          coverIndex={coverIndex}
          onChangeImages={onChangeProductImages}
          onChangeCoverIndex={onChangeCoverIndex}
          isUploading={uploadLocked}
          onUploadFile={onModalUploadFile}
        />
      ) : null}
      <AdminAddProductQuickActionsSection
        control={control}
        visible={visible}
        featured={featured}
        readOnly={readOnly}
      />
    </div>
  );
}
