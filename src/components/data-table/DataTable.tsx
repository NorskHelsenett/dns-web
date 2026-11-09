import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { tableFeaturesConfig, type AppFeatures } from "./features";
import { Fragment, type ReactNode } from "react";

type DataTableProps<T extends RowData> = {
  columns: ColumnDef<AppFeatures, T>[];
  data: T[];
  getRowId: (row: T) => string;
  toolbar?: ReactNode;
  pageSize?: number;
  label?: string;
  getRowGroup?: (row: T) => string;
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
  label, getRowGroup, renderRowDetails,
}: Omit<DataTableProps<T>, "toolbar" | "paginationResetKey">) {
  const { t } = useTranslation();
  const table = useTable(
    {
      features: tableFeaturesConfig,
      columns,
      data,
      getRowId,
      getRowCanExpand: () => renderRowDetails !== undefined,
      initialState: { pagination: { pageIndex: 0, pageSize: initialPageSize } },
    },
    (state) => ({
      pagination: state.pagination,
      sorting: state.sorting,
      expanded: state.expanded,
    }),
  );

  const rows = table.getRowModel().rows;
  const { pageIndex, pageSize } = table.state.pagination;
  const total = table.getRowCount();
  const from = rows.length ? pageIndex * pageSize + 1 : 0;
  const to = pageIndex * pageSize + rows.length;

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
                      className={`box-x-padding text-xs font-semibold text-muted-foreground ${header.column.id === "favorited" ? "w-px" : ""}`}
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
              rows.map((row, index) => {
                const group = getRowGroup?.(row.original);
                const previousRow = rows[index - 1];
                const showGroup = group !== undefined &&
                  (!previousRow || group !== getRowGroup?.(previousRow.original));
                const details = row.getIsExpanded() ? renderRowDetails?.(row.original) : null;
                return (
                  <Fragment key={row.id}>
                    {showGroup && (
                      <tr className="border-b border-border bg-muted/40">
                        <th scope="rowgroup" colSpan={columns.length} className="box-x-padding py-2 text-left text-xs font-medium text-muted-foreground">
                          {group}
                        </th>
                      </tr>
                    )}
                    <tr className="h-16 border-b border-border last:border-b-0 hover:bg-muted/40">
                      {row.getAllCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`box-x-padding py-2 align-middle ${cell.column.id === "favorited" ? "w-px" : ""}`}
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
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border box-x-padding py-3 text-sm text-muted-foreground">
        <span className="tabular-nums">{t("table.showing", { from, to, total })}</span>
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