import type { Control } from 'react-hook-form';

import type { AdminAddProductFormValues } from '../types';

import AdminAddProductMediaSection from './AdminAddProductMediaSection';
import AdminAddProductQuickActionsSection from './AdminAddProductQuickActionsSection';

type AdminAddProductLeftSectionProps = {
  control: Control<AdminAddProductFormValues>;
  visible: boolean;
};

export default function AdminAddProductLeftSection({
  control,
  visible,
}: AdminAddProductLeftSectionProps) {
  return (
    <div className="col-span-12 flex flex-col gap-4 lg:col-span-6 self-stretch">
      <AdminAddProductMediaSection />
      <AdminAddProductQuickActionsSection control={control} visible={visible} />
    </div>
  );
}
