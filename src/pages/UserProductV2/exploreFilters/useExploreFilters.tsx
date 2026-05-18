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

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  resetExploreAppliedFilters,
  setExploreAppliedFilters,
} from '@/store/slices/productsSlice';
import { fetchBrandsThunk, fetchCategoriesThunk, fetchExploreProductsThunk } from '@/store/thunks';
import { DEFAULT_LIST_QUERY } from '@/types/common/common';

import {
  DEFAULT_EXPLORE_FILTERS,
  isExploreProductsPath,
  type ExploreFilters,
  type ExploreQuickSegment,
} from './constants';
import { ExploreFilterChips } from './ExploreFilterChips';
import { ExploreFilterPanel } from './ExploreFilterPanel';
import {
  buildExploreFilterChips,
  removeExploreFilterChip,
  toSelectOptions,
  validateExploreDraft,
} from './exploreFilterUtils';

const CATALOG_QUERY = { ...DEFAULT_LIST_QUERY, page: 0, size: 100, activeOnly: true as const };

type ExploreFiltersContextValue = {
  isPanelOpen: boolean;
  draft: ExploreFilters;
  applied: ExploreFilters;
  chips: ReturnType<typeof buildExploreFilterChips>;
  activeFilterCount: number;
  quickSegment: ExploreQuickSegment;
  categoryOptions: { value: string; label: string }[];
  brandOptions: { value: string; label: string }[];
  onExploreRoute: boolean;
  openPanel: () => void;
  closePanel: () => void;
  patchDraft: (patch: Partial<ExploreFilters>) => void;
  applyDraft: () => void;
  clearDraftInPanel: () => void;
  clearAllFilters: () => void;
  removeChip: (chipId: string) => void;
  setQuickSegment: (segment: ExploreQuickSegment) => void;
};

const ExploreFiltersContext = createContext<ExploreFiltersContextValue | null>(null);

function useExploreFiltersContext(): ExploreFiltersContextValue {
  const ctx = useContext(ExploreFiltersContext);
  if (!ctx) {
    throw new Error('useExploreFilters must be used within ExploreFilterProvider');
  }
  return ctx;
}

export function ExploreFilterProvider({ children }: { children: ReactNode }): JSX.Element {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const onExploreRoute = isExploreProductsPath(location.pathname);

  const applied = useAppSelector((s) => s.products.exploreAppliedFilters);
  const categories = useAppSelector((s) => s.categories.items);
  const brands = useAppSelector((s) => s.brands.items);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [draft, setDraft] = useState<ExploreFilters>(DEFAULT_EXPLORE_FILTERS);

  const labels = useMemo(
    () => ({
      categoryName: (id: string) => categories.find((c) => c.id === id)?.name,
      brandName: (id: string) => brands.find((b) => b.id === id)?.name,
    }),
    [categories, brands],
  );

  const chips = useMemo(() => buildExploreFilterChips(applied, labels), [applied, labels]);
  const categoryOptions = useMemo(() => toSelectOptions(categories, 'All categories'), [categories]);
  const brandOptions = useMemo(() => toSelectOptions(brands, 'All brands'), [brands]);

  const applyFilters = useCallback(
    (next: ExploreFilters) => {
      dispatch(setExploreAppliedFilters(next));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!onExploreRoute) {
      setIsPanelOpen(false);
      return;
    }
    void dispatch(fetchCategoriesThunk(CATALOG_QUERY));
    void dispatch(fetchBrandsThunk(CATALOG_QUERY));
  }, [dispatch, onExploreRoute]);

  useEffect(() => {
    if (!onExploreRoute) return;
    void dispatch(fetchExploreProductsThunk());
  }, [applied, categories.length, dispatch, onExploreRoute]);

  const openPanel = useCallback(() => {
    if (!onExploreRoute) return;
    setDraft(applied);
    setIsPanelOpen(true);
  }, [applied, onExploreRoute]);

  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const patchDraft = useCallback((patch: Partial<ExploreFilters>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const applyDraft = useCallback(() => {
    const error = validateExploreDraft(draft);
    if (error) {
      toast.error(error);
      return;
    }
    applyFilters(draft);
    setIsPanelOpen(false);
  }, [applyFilters, draft]);

  const clearDraftInPanel = useCallback(() => {
    setDraft((prev) => ({
      ...DEFAULT_EXPLORE_FILTERS,
      segment: prev.segment,
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    dispatch(resetExploreAppliedFilters());
    setDraft(DEFAULT_EXPLORE_FILTERS);
  }, [dispatch]);

  const removeChip = useCallback(
    (chipId: string) => {
      const next = removeExploreFilterChip(applied, chipId);
      applyFilters(next);
      setDraft(next);
    },
    [applied, applyFilters],
  );

  const setQuickSegment = useCallback(
    (segment: ExploreQuickSegment) => {
      const next = { ...applied, segment };
      applyFilters(next);
      setDraft(next);
    },
    [applied, applyFilters],
  );

  useEffect(() => {
    if (!isPanelOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isPanelOpen]);

  const value = useMemo<ExploreFiltersContextValue>(
    () => ({
      isPanelOpen,
      draft,
      applied,
      chips,
      activeFilterCount: chips.length,
      quickSegment: applied.segment,
      categoryOptions,
      brandOptions,
      onExploreRoute,
      openPanel,
      closePanel,
      patchDraft,
      applyDraft,
      clearDraftInPanel,
      clearAllFilters,
      removeChip,
      setQuickSegment,
    }),
    [
      isPanelOpen,
      draft,
      applied,
      chips,
      categoryOptions,
      brandOptions,
      onExploreRoute,
      openPanel,
      closePanel,
      patchDraft,
      applyDraft,
      clearDraftInPanel,
      clearAllFilters,
      removeChip,
      setQuickSegment,
    ],
  );

  return (
    <ExploreFiltersContext.Provider value={value}>
      {children}
      {createPortal(
        <ExploreFilterPanel
          open={isPanelOpen && onExploreRoute}
          draft={draft}
          categoryOptions={categoryOptions}
          brandOptions={brandOptions}
          onClose={closePanel}
          onDraftChange={patchDraft}
          onApply={applyDraft}
          onClearAll={clearDraftInPanel}
        />,
        document.body,
      )}
    </ExploreFiltersContext.Provider>
  );
}

export function useExploreFilters(): ExploreFiltersContextValue {
  return useExploreFiltersContext();
}

export function ExploreActiveFilterChipsRow(): JSX.Element | null {
  const { chips, onExploreRoute, removeChip, clearAllFilters } = useExploreFiltersContext();
  if (!onExploreRoute) return null;
  return (
    <ExploreFilterChips chips={chips} onRemove={removeChip} onClearAll={clearAllFilters} />
  );
}
