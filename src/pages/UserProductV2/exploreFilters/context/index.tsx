import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type JSX,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import { ROUTES } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  resetExploreAppliedFilters,
  setExploreAppliedFilters,
} from '@/store/slices/productsSlice';
import { fetchExploreProductsThunk } from '@/store/thunks/productThunks';

import { DEFAULT_EXPLORE_FILTERS } from '../constants';
import type { ExploreFilters, ExploreQuickSegment } from '../constants';
import { ExploreFilterChips } from '../ExploreFilterChips';
import { ExploreFilterPanel } from '../ExploreFilterPanel';
import {
  isExploreProductsPath,
  removeExploreFilterChip,
  validateExploreDraft,
} from '../exploreFilterModel';

import exploreFilterUiActions from './actions';
import { exploreFilterUiReducer, initialState, type ExploreFilterUiState } from './reducer';
import exploreFilterSelectors from './selectors';

const EXPLORE_ROUTES = {
  products: ROUTES.PRODUCTS,
  productsClothing: ROUTES.PRODUCTS_CLOTHING,
  productsDeal: ROUTES.PRODUCTS_DEAL,
  productsInspirations: ROUTES.PRODUCTS_INSPIRATIONS,
};

type ExploreFilterContextTuple = [ExploreFilterUiState, Dispatch<{ type: string; payload?: unknown }>];

const ExploreFilterContext = createContext<ExploreFilterContextTuple | undefined>(undefined);

function useExploreFilterContextInternal() {
  const location = useLocation();
  const [uiState, uiDispatch] = useExploreFilterContextTuple();
  const reduxDispatch = useAppDispatch();
  const applied = useAppSelector((s) => s.products.exploreAppliedFilters);
  const uiActions = exploreFilterUiActions(uiDispatch);
  const selectors = exploreFilterSelectors(applied);

  const commitApplied = useCallback(
    (next: ExploreFilters) => {
      reduxDispatch(setExploreAppliedFilters(next));
      void reduxDispatch(fetchExploreProductsThunk());
    },
    [reduxDispatch],
  );

  const exploreFilterAction = useMemo(
    () => ({
      panel: {
        open: () => {
          if (!isExploreProductsPath(location.pathname, EXPLORE_ROUTES)) return;
          uiActions.draft.set(applied);
          uiActions.panel.open();
        },
        close: () => uiActions.panel.close(),
      },
      filters: {
        patchDraft: (patch: Partial<ExploreFilters>) => uiActions.draft.patch(patch),
        apply: () => {
          const error = validateExploreDraft(uiState.draft);
          if (error) {
            toast.error(error);
            return;
          }
          commitApplied(uiState.draft);
          uiActions.panel.close();
        },
        clearDraftInPanel: () => {
          uiActions.draft.set({
            ...DEFAULT_EXPLORE_FILTERS,
            segment: uiState.draft.segment,
          });
        },
        clearAll: () => {
          reduxDispatch(resetExploreAppliedFilters());
          uiActions.draft.set(DEFAULT_EXPLORE_FILTERS);
          void reduxDispatch(fetchExploreProductsThunk());
        },
        removeChip: (chipId: string) => {
          const next = removeExploreFilterChip(applied, chipId);
          commitApplied(next);
          uiActions.draft.set(next);
        },
      },
      quickSegment: {
        set: (segment: ExploreQuickSegment) => {
          const next = { ...applied, segment };
          commitApplied(next);
          uiActions.draft.set(next);
        },
      },
    }),
    [applied, commitApplied, location.pathname, reduxDispatch, uiActions, uiState.draft],
  );

  return {
    state: uiState,
    applied,
    exploreFilterAction,
    exploreFilterSelector: selectors,
    activeFilterCount: selectors.activeFilterCount(),
    chips: selectors.chips(),
    quickSegment: selectors.quickSegment(),
  };
}

function ExploreFilterPanelHost(): JSX.Element | null {
  const location = useLocation();
  const { state, exploreFilterAction } = useExploreFilterContext();
  const onExploreRoute = isExploreProductsPath(location.pathname, EXPLORE_ROUTES);

  useEffect(() => {
    if (!state.isPanelOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [state.isPanelOpen]);

  if (!onExploreRoute && !state.isPanelOpen) return null;

  return createPortal(
    <ExploreFilterPanel
      open={state.isPanelOpen && onExploreRoute}
      draft={state.draft}
      onClose={exploreFilterAction.panel.close}
      onDraftChange={exploreFilterAction.filters.patchDraft}
      onApply={exploreFilterAction.filters.apply}
      onClearAll={exploreFilterAction.filters.clearDraftInPanel}
    />,
    document.body,
  );
}

function ExploreRoutePanelGuard(): null {
  const location = useLocation();
  const [, uiDispatch] = useExploreFilterContextTuple();

  useEffect(() => {
    if (!isExploreProductsPath(location.pathname, EXPLORE_ROUTES)) {
      uiDispatch({ type: 'exploreFilter/CLOSE_PANEL' });
    }
  }, [location.pathname, uiDispatch]);

  return null;
}

function useExploreFilterContextTuple(): ExploreFilterContextTuple {
  const context = useContext(ExploreFilterContext);
  if (context === undefined) {
    throw new Error('useExploreFilterContext must be used within ExploreFilterProvider');
  }
  return context;
}

export function ExploreFilterProvider({ children }: { children: ReactNode }): JSX.Element {
  const [uiState, uiDispatch] = useReducer(exploreFilterUiReducer, initialState);
  const value = useMemo(() => [uiState, uiDispatch] as ExploreFilterContextTuple, [uiState]);

  return (
    <ExploreFilterContext.Provider value={value}>
      <ExploreRoutePanelGuard />
      {children}
      <ExploreFilterPanelHost />
    </ExploreFilterContext.Provider>
  );
}

export function ExploreActiveFilterChipsRow(): JSX.Element | null {
  const location = useLocation();
  const { chips, exploreFilterAction } = useExploreFilterContext();

  if (!isExploreProductsPath(location.pathname, EXPLORE_ROUTES)) return null;

  return (
    <ExploreFilterChips
      chips={chips}
      onRemove={exploreFilterAction.filters.removeChip}
      onClearAll={exploreFilterAction.filters.clearAll}
    />
  );
}

export function useExploreFilterContext() {
  return useExploreFilterContextInternal();
}

export function useExploreFilterContextOptional() {
  const context = useContext(ExploreFilterContext);
  if (context === undefined) return null;
  return useExploreFilterContextInternal();
}
