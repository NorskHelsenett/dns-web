import {
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  rowExpandingFeature,
  columnGroupingFeature,
  createSortedRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createExpandedRowModel,
  sortFns,
  columnSizingFeature,
} from "@tanstack/react-table";

export const tableFeaturesConfig = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  rowExpandingFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  sortedRowModel: createSortedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  columnSizingFeature,
});

export type AppFeatures = typeof tableFeaturesConfig;
