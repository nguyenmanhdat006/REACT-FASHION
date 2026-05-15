import type { Control } from 'react-hook-form';

import type { AdminAddProductFormValues } from '../types';

import AdminAddProductMediaSection from './AdminAddProductMediaSection';
import AdminAddProductQuickActionsSection from './AdminAddProductQuickActionsSection';

type AdminAddProductLeftSectionProps = {
  control: Control<AdminAddProductFormValues>;
  visible: boolean;
  featured: boolean;
  slotUrls: readonly (string | null)[];
  coverSlotIndex: number;
  uploadingSlotIndex: number | null;
  onFileForSlot: (slotIndex: number, file: File) => void;
  onSetCoverSlot: (slotIndex: number) => void;
};

export default function AdminAddProductLeftSection({
  control,
  visible,
  featured,
  slotUrls,
  coverSlotIndex,
  uploadingSlotIndex,
  onFileForSlot,
  onSetCoverSlot,
}: AdminAddProductLeftSectionProps) {
  return (
    <div className="col-span-12 flex flex-col gap-4 self-stretch lg:col-span-6">
      <AdminAddProductMediaSection
        slotUrls={slotUrls}
        coverSlotIndex={coverSlotIndex}
        uploadingSlotIndex={uploadingSlotIndex}
        onFileForSlot={onFileForSlot}
        onSetCoverSlot={onSetCoverSlot}
      />
      <AdminAddProductQuickActionsSection
        control={control}
        visible={visible}
        featured={featured}
      />
    </div>
  );
}
