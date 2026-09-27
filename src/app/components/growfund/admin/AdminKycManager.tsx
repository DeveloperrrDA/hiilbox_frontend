"use client";

import { useCallback, useEffect, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import ListPagination from "@/app/components/growfund/shared/ListPagination";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import {
  dateRangeParams,
  type DateRangeKey,
} from "@/lib/dashboard/dateRanges";
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

  gfcm_kyc_consent?: string;

  gfcm_kyc_id_number?: string;
  gfcm_kyc_id_upload?: string;

  gfcm_kyc_fundraiser_id?: string;
  gfcm_kyc_fundraiser_id_number?: string;
  gfcm_kyc_auth_id?: string;
  gfcm_kyc_auth_id_number?: string;

  gfcm_kyc_contact_name?: string;
  gfcm_kyc_contact_phone?: string;
  gfcm_kyc_contact_address?: string;
  gfcm_kyc_contact_city?: string;

  gfcm_kyc_beneficiary_name?: string;
  gfcm_kyc_beneficiary_contact?: string;
  gfcm_kyc_beneficiary_relation?: string;

  gfcm_kyc_org_name?: string;
  gfcm_kyc_org_reg_number?: string;
  gfcm_kyc_org_type?: string;
  gfcm_kyc_org_website?: string;
  gfcm_kyc_org_cert?: string;

  gfcm_kyc_rep_name?: string;
  gfcm_kyc_rep_role?: string;
  gfcm_kyc_rep_phone?: string;
  gfcm_kyc_rep_address?: string;
  gfcm_kyc_rep_city?: string;

  gfcm_kyc_payout_method?: string;
  gfcm_kyc_payout_currency?: string;
  gfcm_kyc_payout_currency_org?: string;

  gfcm_kyc_bank_name?: string;
  gfcm_kyc_bank_account_name?: string;
  gfcm_kyc_bank_account_number?: string;

  gfcm_kyc_mobile_provider?: string;
  gfcm_kyc_mobile_name?: string;
  gfcm_kyc_mobile_number?: string;

  gfcm_kyc_recipient_type?: string;
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

  const [growfundStatus, setGrowfundStatus] = useState("all");
  const [kycStatus, setKycStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRangeKey>("all");
   const [selectedKyc, setSelectedKyc] = useState<KycRow | null>(null);
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

if (growfundStatus !== "all") {
  query.set("growfund_status", growfundStatus);
}

if (kycStatus !== "all") {
  query.set("kyc_status", kycStatus);
}

const rangeParams = dateRangeParams(dateRange);

if (rangeParams.start_date) {
  query.set("start_date", rangeParams.start_date);
}

if (rangeParams.end_date) {
  query.set("end_date", rangeParams.end_date);
}

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
}, [page, growfundStatus, kycStatus, dateRange]);

  useEffect(() => {
    void load();
  }, [load]);
useEffect(() => {
  setPage(1);
}, [growfundStatus, kycStatus, dateRange]);
  return (
    <CardBox>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Fundraiser KYC</h2>
        <p className="text-sm text-darklink">
          Review KYC submissions from GrowFund fundraisers.
        </p>
      </div>
<div className="mb-5 grid gap-3 md:grid-cols-3">
  <select
    value={growfundStatus}
    onChange={(e) => setGrowfundStatus(e.target.value)}
    className="rounded-md border border-ld bg-transparent px-3 py-2.5"
  >
    <option value="all">All GrowFund statuses</option>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
    <option value="rejected">Rejected</option>
    <option value="approved">Approved</option>
    <option value="pending">Pending</option>
  </select>

  <select
    value={kycStatus}
    onChange={(e) => setKycStatus(e.target.value)}
    className="rounded-md border border-ld bg-transparent px-3 py-2.5"
  >
    <option value="all">All KYC statuses</option>
    <option value="pending">Pending</option>
    <option value="submitted">Submitted</option>
  </select>

  <DatePresetSelect
    value={dateRange}
    onChange={setDateRange}
  />
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
  <button
    type="button"
    onClick={() => setSelectedKyc(row)}
    className="font-medium text-primary hover:underline"
  >
    {fullName || `User #${row.user_id}`}
  </button>
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
     {selectedKyc && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
    onClick={() => setSelectedKyc(null)}
  >
    <div
      className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-darkgray"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">KYC Details</h3>

          <p className="mt-1 text-sm text-darklink">
            {`${selectedKyc.first_name ?? ""} ${
              selectedKyc.last_name ?? ""
            }`.trim() || `User #${selectedKyc.user_id}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelectedKyc(null)}
          className="rounded-md border border-ld px-3 py-1.5 text-sm"
        >
          Close
        </button>
      </div>

     <div className="max-h-[70vh] overflow-y-auto pr-2">
  <div className="grid gap-6 sm:grid-cols-2">

    {/* Basic Information */}
    <div className="rounded-lg border border-ld p-4">
      <h4 className="mb-3 font-semibold">Basic Information</h4>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-darklink">User ID</p>
          <p className="font-medium">#{selectedKyc.user_id}</p>
        </div>

        <div>
          <p className="text-xs text-darklink">Email</p>
          <p className="font-medium">
            {formatValue(selectedKyc.email)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Fundraiser Type</p>
          <p className="font-medium capitalize">
            {formatValue(selectedKyc.gfcm_kyc_type).replaceAll("_", " ")}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Recipient Type</p>
          <p className="font-medium capitalize">
            {formatValue(selectedKyc.gfcm_kyc_recipient_type).replaceAll(
              "_",
              " "
            )}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Submitted</p>
          <p className="font-medium">
            {formatValue(selectedKyc.submitted_date)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Consent</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_consent)}
          </p>
        </div>
      </div>
    </div>

    {/* Status */}
    <div className="rounded-lg border border-ld p-4">
      <h4 className="mb-3 font-semibold">Status</h4>

      <div className="space-y-4 text-sm">
        <div>
          <p className="mb-1 text-xs text-darklink">KYC Status</p>
          <Badge variant={statusVariant(selectedKyc.kyc_status)}>
            {formatValue(selectedKyc.kyc_status)}
          </Badge>
        </div>

        <div>
          <p className="mb-1 text-xs text-darklink">
            GrowFund Status
          </p>
          <Badge variant={statusVariant(selectedKyc.growfund_status)}>
            {formatValue(selectedKyc.growfund_status)}
          </Badge>
        </div>
      </div>
    </div>

    {/* Identification */}
    <div className="rounded-lg border border-ld p-4">
      <h4 className="mb-3 font-semibold">Identification</h4>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-darklink">ID Number</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_id_number)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Fundraiser ID</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_fundraiser_id)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">
            Fundraiser ID Number
          </p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_fundraiser_id_number)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Authorization ID</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_auth_id)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">
            Authorization ID Number
          </p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_auth_id_number)}
          </p>
        </div>

        {selectedKyc.gfcm_kyc_id_upload && (
          <div>
            <p className="mb-1 text-xs text-darklink">
              Uploaded ID
            </p>

            <a
              href={selectedKyc.gfcm_kyc_id_upload}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary hover:underline"
            >
              View uploaded ID
            </a>
          </div>
        )}
      </div>
    </div>

    {/* Contact Information */}
    <div className="rounded-lg border border-ld p-4">
      <h4 className="mb-3 font-semibold">Contact Information</h4>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-darklink">Contact Name</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_contact_name)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Phone</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_contact_phone)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Address</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_contact_address)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">City</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_contact_city)}
          </p>
        </div>
      </div>
    </div>

    {/* Beneficiary */}
    <div className="rounded-lg border border-ld p-4">
      <h4 className="mb-3 font-semibold">Beneficiary</h4>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-darklink">Name</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_beneficiary_name)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Contact</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_beneficiary_contact)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Relationship</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_beneficiary_relation)}
          </p>
        </div>
      </div>
    </div>

    {/* Organization */}
    <div className="rounded-lg border border-ld p-4">
      <h4 className="mb-3 font-semibold">Organization</h4>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-darklink">Organization Name</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_org_name)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">
            Registration Number
          </p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_org_reg_number)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Organization Type</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_org_type)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Website</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_org_website)}
          </p>
        </div>

        {selectedKyc.gfcm_kyc_org_cert && (
          <div>
            <p className="mb-1 text-xs text-darklink">
              Organization Certificate
            </p>

            <a
              href={selectedKyc.gfcm_kyc_org_cert}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary hover:underline"
            >
              View organization certificate
            </a>
          </div>
        )}
      </div>
    </div>

    {/* Organization Representative */}
    <div className="rounded-lg border border-ld p-4">
      <h4 className="mb-3 font-semibold">
        Organization Representative
      </h4>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-darklink">Name</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_rep_name)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Role</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_rep_role)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Phone</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_rep_phone)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Address</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_rep_address)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">City</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_rep_city)}
          </p>
        </div>
      </div>
    </div>

    {/* Payout Information */}
    <div className="rounded-lg border border-ld p-4">
      <h4 className="mb-3 font-semibold">Payout Information</h4>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-darklink">Method</p>
          <p className="font-medium capitalize">
            {formatValue(selectedKyc.gfcm_kyc_payout_method).replaceAll(
              "_",
              " "
            )}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Currency</p>
          <p className="font-medium">
            {formatValue(
              selectedKyc.gfcm_kyc_payout_currency ||
                selectedKyc.gfcm_kyc_payout_currency_org
            )}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Bank</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_bank_name)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Account Name</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_bank_account_name)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Account Number</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_bank_account_number)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Mobile Provider</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_mobile_provider)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Mobile Name</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_mobile_name)}
          </p>
        </div>

        <div>
          <p className="text-xs text-darklink">Mobile Number</p>
          <p className="font-medium">
            {formatValue(selectedKyc.gfcm_kyc_mobile_number)}
          </p>
        </div>
      </div>
    </div>

  </div>
</div>
    </div>
  </div>
)}
    </CardBox>
  );
}