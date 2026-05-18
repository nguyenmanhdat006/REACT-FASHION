import {
  buildExploreFilterChips,
  countActiveExploreFilters,
} from '../exploreFilterModel';
import type { ExploreFilters } from '../constants';

const exploreFilterSelectors = (applied: ExploreFilters) => ({
  chips: () => buildExploreFilterChips(applied),
  activeFilterCount: () => countActiveExploreFilters(applied),
  quickSegment: () => applied.segment,
});

export default exploreFilterSelectors;
