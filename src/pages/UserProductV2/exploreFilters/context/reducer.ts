import { DEFAULT_EXPLORE_FILTERS } from '../constants';
import type { ExploreFilters } from '../constants';

import * as actionTypes from './types';

export type ExploreFilterUiState = {
  isPanelOpen: boolean;
  draft: ExploreFilters;
};

export const initialState: ExploreFilterUiState = {
  isPanelOpen: false,
  draft: DEFAULT_EXPLORE_FILTERS,
};

type ExploreFilterAction =
  | { type: typeof actionTypes.OPEN_PANEL }
  | { type: typeof actionTypes.CLOSE_PANEL }
  | { type: typeof actionTypes.SET_DRAFT; payload: ExploreFilters }
  | { type: typeof actionTypes.PATCH_DRAFT; payload: Partial<ExploreFilters> };

export function exploreFilterUiReducer(
  state: ExploreFilterUiState,
  action: ExploreFilterAction,
): ExploreFilterUiState {
  switch (action.type) {
    case actionTypes.OPEN_PANEL:
      return { ...state, isPanelOpen: true };
    case actionTypes.CLOSE_PANEL:
      return { ...state, isPanelOpen: false };
    case actionTypes.SET_DRAFT:
      return { ...state, draft: action.payload };
    case actionTypes.PATCH_DRAFT:
      return { ...state, draft: { ...state.draft, ...action.payload } };
    default:
      return state;
  }
}
