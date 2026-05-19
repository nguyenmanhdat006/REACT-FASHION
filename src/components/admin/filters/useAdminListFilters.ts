import { useCallback, useMemo, useState } from 'react';

import {
  countAdminListFilters,
  clearAdminListFilters,
} from './adminListFilterUtils';
import {
  DEFAULT_ADMIN_LIST_FILTERS,
  type AdminListFilterPreset,
  type AdminListFilters,
} from './constants';

export function useAdminListFilters(preset: AdminListFilterPreset) {
  const [applied, setApplied] = useState<AdminListFilters>(DEFAULT_ADMIN_LIST_FILTERS);
  const [draft, setDraft] = useState<AdminListFilters>(DEFAULT_ADMIN_LIST_FILTERS);
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = useMemo(
    () => countAdminListFilters(preset, applied),
    [preset, applied],
  );

  const openPanel = useCallback(() => {
    setDraft(applied);
    setIsOpen(true);
  }, [applied]);

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const patchDraft = useCallback((patch: Partial<AdminListFilters>) => {
    setDraft(prev => ({ ...prev, ...patch }));
  }, []);

  const applyDraft = useCallback(() => {
    setApplied(draft);
    setIsOpen(false);
  }, [draft]);

  const clearAll = useCallback(() => {
    const cleared = clearAdminListFilters();
    setDraft(cleared);
    setApplied(cleared);
    setIsOpen(false);
  }, []);

  return {
    preset,
    applied,
    draft,
    isOpen,
    activeFilterCount,
    openPanel,
    closePanel,
    patchDraft,
    applyDraft,
    clearAll,
  };
}

export type UseAdminListFiltersReturn = ReturnType<typeof useAdminListFilters>;
