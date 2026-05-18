import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import { DEFAULT_EXPLORE_FILTERS } from './constants';
import { ExploreActiveFilterChips } from './ExploreActiveFilterChips';
import { ExploreFilterPanel } from './ExploreFilterPanel';
import {
  buildExploreFilterChips,
  cloneExploreFilters,
  countActiveExploreFilters,
  isExploreProductsPath,
  removeExploreFilterChip,
} from './exploreFilterUtils';
import type { ExploreFilterState, ExploreQuickSegment } from './types';

type ExploreFilterContextValue = {
  applied: ExploreFilterState;
  quickSegment: ExploreQuickSegment;
  activeFilterCount: number;
  chips: ReturnType<typeof buildExploreFilterChips>;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  setQuickSegment: (segment: ExploreQuickSegment) => void;
  removeChip: (chipId: string) => void;
  clearAllApplied: () => void;
};

const ExploreFilterContext = createContext<ExploreFilterContextValue | null>(null);

function validateDraft(draft: ExploreFilterState): string | null {
  const min = draft.minPrice?.trim();
  const max = draft.maxPrice?.trim();
  if (min && max && Number(min) > Number(max)) {
    return 'Minimum price must be less than or equal to maximum price';
  }
  if (min && Number(min) < 0) return 'Minimum price cannot be negative';
  if (max && Number(max) < 0) return 'Maximum price cannot be negative';
  return null;
}

export function ExploreFilterProvider({ children }: { children: ReactNode }): JSX.Element {
  const location = useLocation();
  const [applied, setApplied] = useState<ExploreFilterState>(DEFAULT_EXPLORE_FILTERS);
  const [draft, setDraft] = useState<ExploreFilterState>(DEFAULT_EXPLORE_FILTERS);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const onExploreRoute = isExploreProductsPath(location.pathname);

  useEffect(() => {
    if (!onExploreRoute) {
      setIsPanelOpen(false);
    }
  }, [onExploreRoute, location.pathname]);

  useEffect(() => {
    if (!isPanelOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPanelOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isPanelOpen]);

  const updateDraft = useCallback((patch: Partial<ExploreFilterState>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const openPanel = useCallback(() => {
    if (!isExploreProductsPath(location.pathname)) return;
    setDraft(cloneExploreFilters(applied));
    setIsPanelOpen(true);
  }, [applied, location.pathname]);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const applyFilters = useCallback(() => {
    const error = validateDraft(draft);
    if (error) {
      toast.error(error);
      return;
    }
    setApplied(cloneExploreFilters(draft));
    setIsPanelOpen(false);
  }, [draft]);

  const clearAllInPanel = useCallback(() => {
    setDraft((prev) => ({
      ...DEFAULT_EXPLORE_FILTERS,
      segment: prev.segment,
    }));
  }, []);

  const clearAllApplied = useCallback(() => {
    const reset = cloneExploreFilters(DEFAULT_EXPLORE_FILTERS);
    setApplied(reset);
    setDraft(reset);
  }, []);

  const setQuickSegment = useCallback((segment: ExploreQuickSegment) => {
    setApplied((prev) => ({ ...prev, segment }));
    setDraft((prev) => ({ ...prev, segment }));
  }, []);

  const removeChip = useCallback((chipId: string) => {
    setApplied((prev) => removeExploreFilterChip(prev, chipId));
    setDraft((prev) => removeExploreFilterChip(prev, chipId));
  }, []);

  const activeFilterCount = countActiveExploreFilters(applied);
  const chips = buildExploreFilterChips(applied);

  const value = useMemo(
    () => ({
      applied,
      quickSegment: applied.segment,
      activeFilterCount,
      chips,
      isPanelOpen,
      openPanel,
      closePanel,
      setQuickSegment,
      removeChip,
      clearAllApplied,
    }),
    [
      applied,
      activeFilterCount,
      chips,
      isPanelOpen,
      openPanel,
      closePanel,
      setQuickSegment,
      removeChip,
      clearAllApplied,
    ],
  );

  return (
    <ExploreFilterContext.Provider value={value}>
      {children}
      {createPortal(
        <ExploreFilterPanel
          open={isPanelOpen && onExploreRoute}
          draft={draft}
          onClose={closePanel}
          onDraftChange={updateDraft}
          onApply={applyFilters}
          onClearAll={clearAllInPanel}
        />,
        document.body,
      )}
    </ExploreFilterContext.Provider>
  );
}

export function ExploreActiveFilterChipsRow(): JSX.Element | null {
  const ctx = useExploreFilters();
  const location = useLocation();
  if (!isExploreProductsPath(location.pathname)) return null;

  return (
    <ExploreActiveFilterChips
      chips={ctx.chips}
      onRemove={ctx.removeChip}
      onClearAll={ctx.clearAllApplied}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- paired hook
export function useExploreFilters(): ExploreFilterContextValue {
  const ctx = useContext(ExploreFilterContext);
  if (!ctx) {
    throw new Error('useExploreFilters must be used within ExploreFilterProvider');
  }
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useExploreFiltersOptional(): ExploreFilterContextValue | null {
  return useContext(ExploreFilterContext);
}
