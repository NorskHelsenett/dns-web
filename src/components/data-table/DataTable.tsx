import { useTable, type ColumnDef, type GroupingState, type Row, type RowData } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { tableFeaturesConfig, type AppFeatures } from "./features";
import { Fragment, type ReactNode } from "react";
import { cn } from "cn";

const shrinkColumns = new Set(["favorited", "expand", "timestamp"]);
const shrinkClass = (columnId: string) => (shrinkColumns.has(columnId) ? "w-px whitespace-nowrap" : "");

type DataTableProps<T extends RowData> = {
  columns: ColumnDef<AppFeatures, T>[];
  data: T[];
  getRowId: (row: T) => string;
  toolbar?: ReactNode;
  pageSize?: number;
  label?: string;
  grouping?: GroupingState;
  renderGroupHeader?: (row: Row<AppFeatures, T>) => ReactNode;
  renderRowDetails?: (row: T) => ReactNode;
  paginationResetKey?: string;
};

export function DataTable<T extends RowData>({ toolbar, paginationResetKey, ...props }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {toolbar}
      <DataTableContent key={paginationResetKey} {...props} />
    </div>
  );
}

function DataTableContent<T extends RowData>({
  columns, data, getRowId, pageSize: initialPageSize = 20,
  label, grouping, renderGroupHeader, renderRowDetails,
}: Omit<DataTableProps<T>, "toolbar" | "paginationResetKey">) {
  const { t } = useTranslation();
  const table = useTable(
    {
      features: tableFeaturesConfig,
      columns,
      data,
      getRowId,
      getRowCanExpand: (row) => !row.getIsGrouped() && renderRowDetails !== undefined,
      groupedColumnMode: false,
      paginateExpandedRows: false,
      initialState: {
        grouping: grouping ?? [],
        pagination: { pageIndex: 0, pageSize: initialPageSize },
      },
    },
    (state) => ({
      pagination: state.pagination,
      sorting: state.sorting,
      expanded: state.expanded,
      grouping: state.grouping,
    }),
  );

  const rows = table.getRowModel().rows;
  const { pageIndex, pageSize } = table.state.pagination;
  const total = table.getRowCount();
  const from = rows.length ? pageIndex * pageSize + 1 : 0;
  const to = pageIndex * pageSize + rows.length;

  function renderRow(row: Row<AppFeatures, T>): ReactNode {
    if (row.getIsGrouped()) {
      return (
        <Fragment key={row.id}>
          <tr className="border-b border-border bg-muted/40">
            <th scope="rowgroup" colSpan={columns.length} className="box-x-padding py-2 text-left text-xs font-medium text-muted-foreground">
              {renderGroupHeader ? renderGroupHeader(row) : String(row.groupingValue)}
            </th>
          </tr>
          {row.subRows.map(renderRow)}
        </Fragment>
      );
    }

    const details = row.getIsExpanded() ? renderRowDetails?.(row.original) : null;
    return (
      <Fragment key={row.id}>
        <tr className="h-16 border-b border-border last:border-b-0 hover:bg-muted/40">
          {row.getAllCells().map((cell) => (
            <td
              key={cell.id}
              className={cn("box-x-padding py-2 align-middle", shrinkClass(cell.column.id))}
            >
              <table.FlexRender cell={cell} />
            </td>
          ))}
        </tr>
        {details && (
          <tr className="border-b border-border bg-background/70">
            <td colSpan={columns.length} className="box-x-padding py-5">{details}</td>
          </tr>
        )}
      </Fragment>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table aria-label={label} className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="h-10 border-b border-border bg-muted/50 text-left">
                {group.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={
                        sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : canSort ? "none" : undefined
                      }
                      className={cn("box-x-padding text-xs font-semibold text-muted-foreground", shrinkClass(header.column.id))}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          <table.FlexRender header={header} />
                          {{
                            asc: <ArrowUp className="size-3.5" />,
                            desc: <ArrowDown className="size-3.5" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ChevronsUpDown className="size-3.5 opacity-50" />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="box-x-padding py-10 text-center text-muted-foreground">
                  {t("table.empty")}
                </td>
              </tr>
            ) : (
              rows.map(renderRow)
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border box-x-padding py-3 text-sm text-muted-foreground">
        <span className="tabular-nums">{t(table.state.grouping.length ? "table.showingGroups" : "table.showing", { from, to, total })}</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
            {t("table.previous")}
          </Button>
          <Button variant="outline" size="sm" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
            {t("table.next")}
          </Button>
        </div>
      </div>
    </>
  );
}