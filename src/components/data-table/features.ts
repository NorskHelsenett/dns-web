import {
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  rowExpandingFeature,
  createSortedRowModel,
  createPaginatedRowModel,
  createExpandedRowModel,
  sortFns,
  columnSizingFeature,
} from "@tanstack/react-table";

export const tableFeaturesConfig = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  rowExpandingFeature,
  sortedRowModel: createSortedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  columnSizingFeature,
});

export type AppFeatures = typeof tableFeaturesConfig;
