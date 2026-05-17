import { MoreVertical } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type TableRowActionsMenuTriggerProps = {
  label: string;
};

function TableRowActionsMenuTrigger({ label }: TableRowActionsMenuTriggerProps) {
  return (
    <DropdownMenuTrigger
      type="button"
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
        'text-muted-foreground',
      )}
      aria-label={label}
    >
      <MoreVertical className="size-4" />
    </DropdownMenuTrigger>
  );
}

export default TableRowActionsMenuTrigger;
