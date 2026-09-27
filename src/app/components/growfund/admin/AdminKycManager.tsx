"use client";

import { useCallback, useEffect, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import ListPagination from "@/app/components/growfund/shared/ListPagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminApi } from "./adminApi";

type KycRow = {
  user_id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  gfcm_kyc_type?: string;
  kyc_status?: string;
  growfund_status?: string;
  submitted_date?: string;
};

function statusVariant(status?: string) {
  const value = String(status ?? "").toLowerCase();

  if (value === "approved" || value === "active") {
    return "default" as const;
  }

  if (value === "rejected" || value === "declined") {
    return "destructive" as const;
  }

  return "secondary" as const;
}

function formatValue(value?: string) {
  const text = String(value ?? "").trim();
  return text || "—";
}

export default function AdminKycManager() {
  const [rows, setRows] = useState<KycRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams({
        page: String(page),
        per_page: "10",
        orderby: "user_registered",
        order: "DESC",
      });

      const response = await adminApi(
        `fundraiser/kyc/paginated?${query.toString()}`
      );

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      const total = Number(response?.total ?? response?.overall ?? data.length);
      const perPage = Number(response?.per_page ?? 10);

      setRows(data);
      setTotalRecords(total);
      setTotalPages(Math.max(1, Math.ceil(total / perPage)));
    } catch (err) {
      setRows([]);
      setTotalRecords(0);
      setTotalPages(1);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load KYC records."
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <CardBox>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Fundraiser KYC</h2>
        <p className="text-sm text-darklink">
          Review KYC submissions from GrowFund fundraisers.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-error/30 bg-error/10 p-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Fundraiser Type</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>GrowFund Status</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading KYC records...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No KYC records found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const fullName = `${row.first_name ?? ""} ${
                  row.last_name ?? ""
                }`.trim();

                return (
                  <TableRow key={row.user_id}>
                    <TableCell className="font-medium">
                      #{row.user_id}
                    </TableCell>

                    <TableCell>
                      {fullName || "—"}
                    </TableCell>

                    <TableCell>
                      {formatValue(row.email)}
                    </TableCell>

                    <TableCell>
                      {formatValue(row.gfcm_kyc_type).replaceAll("_", " ")}
                    </TableCell>

                    <TableCell>
                      <Badge variant={statusVariant(row.kyc_status)}>
                        {formatValue(row.kyc_status)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={statusVariant(row.growfund_status)}>
                        {formatValue(row.growfund_status)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {formatValue(row.submitted_date)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && !error && (
        <ListPagination
          page={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={10}
          recordLabel="KYC records"
          onPageChange={setPage}
        />
      )}
    </CardBox>
  );
}