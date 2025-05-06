import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

function TableComponent({ data, columns }) {
  const [pagination, setPagination] = useState({
    pageSize: 2,
    pageIndex: 0,
  });
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: false,
  });
  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page:
          </label>
          <select
            id="rows-per-page"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {[2, 4, 6, 8, 10].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center  gap-4">
          <PaginationPrevious
            onClick={() => table.previousPage()}
            className={`cursor-pointer ${
              !table.getCanPreviousPage()
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            Previous
          </PaginationPrevious>
          <span className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <PaginationNext
            className={`cursor-pointer ${
              !table.getCanNextPage() ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={() => table.nextPage()}
          >
            Next
          </PaginationNext>
        </div>
      </div>
    </>
  );
}

export default TableComponent;
