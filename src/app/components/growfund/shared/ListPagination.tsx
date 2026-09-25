"use client";

import { Button } from "@/components/ui/button";

type ListPaginationProps = {
  page: number;
  totalPages: number;
  totalRecords: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  recordLabel?: string;
};

export default function ListPagination({
  page,
  totalPages,
  totalRecords,
recordLabel = "records",
  pageSize = 10,
  onPageChange,
}: ListPaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);

  // Keep the pagination compact when there are many pages.
  const getPageNumbers = () => {
    const pages: number[] = [];

    let start = Math.max(1, page - 2);
    let end = Math.min(safeTotalPages, page + 2);

    if (page <= 3) {
      end = Math.min(5, safeTotalPages);
    }

    if (page >= safeTotalPages - 2) {
      start = Math.max(1, safeTotalPages - 4);
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-darklink">
        Total {recordLabel}: {totalRecords} · Page {page} of {safeTotalPages} ·{" "}
        {pageSize} items per page
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            size="sm"
            variant={pageNumber === page ? "default" : "outline"}
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? "page" : undefined}
          >
            {pageNumber}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          disabled={page >= safeTotalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}