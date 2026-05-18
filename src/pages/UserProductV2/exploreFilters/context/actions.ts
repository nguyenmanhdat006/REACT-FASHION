import type { ExploreFilters } from '../constants';

import * as actionTypes from './types';

type UiDispatch = (action: {
  type: string;
  payload?: ExploreFilters | Partial<ExploreFilters>;
}) => void;

const exploreFilterUiActions = (dispatch: UiDispatch) => ({
  panel: {
    open: () => dispatch({ type: actionTypes.OPEN_PANEL }),
    close: () => dispatch({ type: actionTypes.CLOSE_PANEL }),
  },
  draft: {
    set: (filters: ExploreFilters) =>
      dispatch({ type: actionTypes.SET_DRAFT, payload: filters }),
    patch: (patch: Partial<ExploreFilters>) =>
      dispatch({ type: actionTypes.PATCH_DRAFT, payload: patch }),
  },
});

export default exploreFilterUiActions;
