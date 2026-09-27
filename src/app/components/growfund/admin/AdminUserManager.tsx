"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import CardBox from "@/app/components/shared/CardBox";
import DatePresetSelect from "@/app/components/growfund/shared/DatePresetSelect";
import ListPagination from "@/app/components/growfund/shared/ListPagination";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Icon } from "@iconify/react";

import {
  formatDateParam,
  getDateRange,
  type DateRangeKey,
} from "@/lib/dashboard/dateRanges";

import { adminApi } from "./adminApi";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type UserRole =
  | "administrator"
  | "growfund_donor"
  | "growfund_fundraiser"
  | "subscriber"
  | string;

interface GrowfundUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;

  registered_date?: string;

  // Fallbacks in case the API changes later.
  user_registered?: string;
  registered?: string;
  registration_date?: string;

  [key: string]: unknown;
}

interface UsersResponse {
  data: GrowfundUser[];
  count: number;
  total: number;
  overall?: number;
  current_page: number;
  per_page: number;
  has_more: boolean;
}

type SortOrder = "ASC" | "DESC";

type SortField =
  | "ID"
  | "user_login"
  | "display_name"
  | "user_email"
  | "user_registered";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function formatRole(role: string) {
  const names: Record<string, string> = {
    administrator: "Administrator",
    growfund_donor: "Donor",
    growfund_fundraiser: "Fundraiser",
    subscriber: "Subscriber",
  };

  return (
    names[role] ||
    role
      .replace(/^growfund_/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function roleVariant(role: string) {
  switch (role) {
    case "growfund_donor":
      return "lightSuccess";

    case "growfund_fundraiser":
      return "lightPrimary";

    case "administrator":
      return "lightWarning";

    case "subscriber":
      return "lightSecondary";

    default:
      return "lightSecondary";
  }
}

function getRegistrationDate(user: GrowfundUser) {
  return (
    user.registered_date ||
    user.user_registered ||
    user.registered ||
    user.registration_date ||
    undefined
  );
}

function formatUserDate(value?: string) {
  if (!value) return "—";

  // WordPress normally returns:
  // 2026-09-26 05:44:32
  //
  // Convert it into a safer JS date format.
  const normalized = value.includes(" ")
    ? value.replace(" ", "T")
    : value;

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name?: string, username?: string) {
  const value = name?.trim() || username?.trim() || "?";

  const words = value.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return value.substring(0, 2).toUpperCase();
}

/* -------------------------------------------------------------------------- */
/*                              Admin User Manager                            */
/* -------------------------------------------------------------------------- */

export default function AdminUserManager() {
  const [users, setUsers] = useState<GrowfundUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* -------------------------------- Pagination ------------------------------- */

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [total, setTotal] = useState(0);
  const [overall, setOverall] = useState(0);

  /* --------------------------------- Sorting -------------------------------- */

  const [orderby, setOrderby] =
    useState<SortField>("user_registered");

  const [order, setOrder] =
    useState<SortOrder>("DESC");

  /* --------------------------------- Filters -------------------------------- */

  const [role, setRole] = useState("");

  const [dateRange, setDateRange] =
    useState<DateRangeKey>("all");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /*
   * The users endpoint currently does not expose a search parameter,
   * so this searches only the currently loaded page.
   */
  const [search, setSearch] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                                Date values                                 */
  /* -------------------------------------------------------------------------- */

  const effectiveDates = useMemo(() => {
    if (dateRange === "custom") {
      return {
        startDate,
        endDate,
      };
    }

    if (dateRange === "all") {
      return {
        startDate: "",
        endDate: "",
      };
    }

    const range = getDateRange(dateRange);

    return {
      startDate: range.start
        ? formatDateParam(range.start)
        : "",
      endDate: range.end
        ? formatDateParam(range.end)
        : "",
    };
  }, [dateRange, startDate, endDate]);

  /* -------------------------------------------------------------------------- */
  /*                                Fetch users                                 */
  /* -------------------------------------------------------------------------- */

  const loadUsers = useCallback(
    async (refresh = false) => {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          per_page: String(perPage),
          orderby,
          order,
        });

        /*
         * Your backend parameter is "roles".
         *
         * This currently sends it as an array.
         * Since you confirmed role filtering works, leave this as-is.
         */
        if (role) {
          params.append("roles[]", role);
        }

        if (effectiveDates.startDate) {
          params.set(
            "start_date",
            effectiveDates.startDate
          );
        }

        if (effectiveDates.endDate) {
          params.set(
            "end_date",
            effectiveDates.endDate
          );
        }

        const result: UsersResponse =
          await adminApi(
            `users/paginated?${params.toString()}`
          );

        setUsers(
          Array.isArray(result.data)
            ? result.data
            : []
        );

        setTotal(
          Number(result.total ?? 0)
        );

        setOverall(
          Number(
            result.overall ??
              result.total ??
              0
          )
        );
      } catch (err) {
        console.error(
          "Failed to load users:",
          err
        );

        setUsers([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load users."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      page,
      perPage,
      orderby,
      order,
      role,
      effectiveDates.startDate,
      effectiveDates.endDate,
    ]
  );

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  /* -------------------------------------------------------------------------- */
  /*                           Current-page searching                           */
  /* -------------------------------------------------------------------------- */

  const visibleUsers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        String(user.id).includes(query) ||
        user.name
          ?.toLowerCase()
          .includes(query) ||
        user.username
          ?.toLowerCase()
          .includes(query) ||
        user.email
          ?.toLowerCase()
          .includes(query) ||
        user.role
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [users, search]);

  /* -------------------------------------------------------------------------- */
  /*                                 Pagination                                 */
  /* -------------------------------------------------------------------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(total / perPage)
  );

  function changePage(nextPage: number) {
    if (
      nextPage < 1 ||
      nextPage > totalPages
    ) {
      return;
    }

    setPage(nextPage);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Sorting                                  */
  /* -------------------------------------------------------------------------- */

  function handleSort(field: SortField) {
    if (orderby === field) {
      setOrder((current) =>
        current === "ASC"
          ? "DESC"
          : "ASC"
      );
    } else {
      setOrderby(field);
      setOrder("ASC");
    }

    setPage(1);
  }

  function SortIcon({
    field,
  }: {
    field: SortField;
  }) {
    if (orderby !== field) {
      return (
        <Icon
          icon="solar:sort-vertical-line-duotone"
          className="text-base text-darklink"
        />
      );
    }

    return (
      <Icon
        icon={
          order === "ASC"
            ? "solar:alt-arrow-up-linear"
            : "solar:alt-arrow-down-linear"
        }
        className="text-base text-primary"
      />
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Filters                                   */
  /* -------------------------------------------------------------------------- */

  const hasActiveFilters =
    role !== "" ||
    search.trim() !== "" ||
    dateRange !== "all" ||
    startDate !== "" ||
    endDate !== "";

  function clearDateFilter() {
    setDateRange("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  }

  function clearAllFilters() {
    setRole("");
    setSearch("");
    setDateRange("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <CardBox className="w-full !max-w-none">
      {/* -------------------------------------------------------------- */}
      {/* Header                                                         */}
      {/* -------------------------------------------------------------- */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h5 className="card-title">
            Users
          </h5>

          <p className="mt-1 text-sm text-darklink">
            View registered users, account roles and registration dates.
          </p>
        </div>

        <Button
          variant="outline"
          disabled={refreshing}
          onClick={() =>
            void loadUsers(true)
          }
        >
          <Icon
            icon="solar:refresh-line-duotone"
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </Button>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Summary                                                        */}
      {/* -------------------------------------------------------------- */}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <div className="rounded-xl border border-ld p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-darklink">
          Total Users
        </p>

        <h4 className="mt-1 text-2xl font-semibold">
          {overall.toLocaleString()}
        </h4>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lightprimary text-primary">
        <Icon
          icon="solar:users-group-rounded-line-duotone"
          className="text-2xl"
        />
      </div>
    </div>
  </div>
</div>
      {/* -------------------------------------------------------------- */}
      {/* Filters                                                        */}
      {/* -------------------------------------------------------------- */}

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_240px_150px]">
        {/* Search */}

        <div className="relative">
          <Icon
            icon="solar:magnifer-line-duotone"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-darklink"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search current page"
            className="w-full rounded-md border border-ld bg-transparent py-2.5 pl-10 pr-3 outline-none focus:border-primary"
          />
        </div>

        {/* Role */}

        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            setPage(1);
          }}
          className="rounded-md border border-ld bg-transparent px-3 py-2.5 outline-none focus:border-primary"
        >
          <option value="">
            All roles
          </option>

          <option value="growfund_donor">
            Donors
          </option>

          <option value="growfund_fundraiser">
            Fundraisers
          </option>

          <option value="administrator">
            Administrators
          </option>

          <option value="subscriber">
            Subscribers
          </option>
        </select>

        {/* Date selector */}

        <DatePresetSelect
          value={dateRange}
          onChange={(value) => {
            setDateRange(value);
            setPage(1);
          }}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(value) => {
            setStartDate(value);
            setPage(1);
          }}
          onEndDateChange={(value) => {
            setEndDate(value);
            setPage(1);
          }}
        />

        {/* Page size */}

        <select
          value={perPage}
          onChange={(event) => {
            setPerPage(
              Number(event.target.value)
            );

            setPage(1);
          }}
          className="rounded-md border border-ld bg-transparent px-3 py-2.5 outline-none focus:border-primary"
        >
          <option value={10}>
            10 per page
          </option>

          <option value={25}>
            25 per page
          </option>

          <option value={50}>
            50 per page
          </option>

          <option value={100}>
            100 per page
          </option>
        </select>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Active filters                                                 */}
      {/* -------------------------------------------------------------- */}

      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">
            Active filters:
          </span>

          {role && (
            <button
              type="button"
              onClick={() => {
                setRole("");
                setPage(1);
              }}
              className="rounded-full border border-ld px-3 py-1 text-xs hover:bg-lightgray dark:hover:bg-darkgray"
            >
              Role: {formatRole(role)} ×
            </button>
          )}

          {search.trim() && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="rounded-full border border-ld px-3 py-1 text-xs hover:bg-lightgray dark:hover:bg-darkgray"
            >
              Search: {search.trim()} ×
            </button>
          )}

          {(dateRange !== "all" ||
            startDate ||
            endDate) && (
            <button
              type="button"
              onClick={clearDateFilter}
              className="rounded-full border border-ld px-3 py-1 text-xs hover:bg-lightgray dark:hover:bg-darkgray"
            >
              {dateRange === "custom"
                ? `Date: ${
                    startDate || "…"
                  } – ${
                    endDate || "…"
                  }`
                : `Date: ${dateRange.replaceAll(
                    "_",
                    " "
                  )}`}{" "}
              ×
            </button>
          )}

          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------- */}
      {/* Error                                                          */}
      {/* -------------------------------------------------------------- */}

      {error && (
        <div className="mt-4 rounded-md bg-lighterror px-4 py-3 text-sm text-error">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                void loadUsers()
              }
              className="font-medium hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------- */}
      {/* Table                                                          */}
      {/* -------------------------------------------------------------- */}

      <div className="mt-5 overflow-x-auto">
        <Table className="admin-users-table">
          <TableHeader>
            <TableRow>
              {/* ID */}

              <TableHead>
                <button
                  type="button"
                  onClick={() =>
                    handleSort("ID")
                  }
                  className="flex items-center gap-1.5 hover:text-primary"
                >
                  ID
                  <SortIcon field="ID" />
                </button>
              </TableHead>

              {/* User */}

              <TableHead>
                <button
                  type="button"
                  onClick={() =>
                    handleSort(
                      "display_name"
                    )
                  }
                  className="flex items-center gap-1.5 hover:text-primary"
                >
                  User
                  <SortIcon field="display_name" />
                </button>
              </TableHead>

              {/* Username */}

              <TableHead>
                <button
                  type="button"
                  onClick={() =>
                    handleSort(
                      "user_login"
                    )
                  }
                  className="flex items-center gap-1.5 hover:text-primary"
                >
                  Username
                  <SortIcon field="user_login" />
                </button>
              </TableHead>

              {/* Email */}

              <TableHead>
                <button
                  type="button"
                  onClick={() =>
                    handleSort(
                      "user_email"
                    )
                  }
                  className="flex items-center gap-1.5 hover:text-primary"
                >
                  Email
                  <SortIcon field="user_email" />
                </button>
              </TableHead>

              <TableHead>
                Role
              </TableHead>

              {/* Registered */}

              <TableHead>
                <button
                  type="button"
                  onClick={() =>
                    handleSort(
                      "user_registered"
                    )
                  }
                  className="flex items-center gap-1.5 hover:text-primary"
                >
                  Registered
                  <SortIcon field="user_registered" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading */}

            {loading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-darklink">
                    <Icon
                      icon="solar:refresh-line-duotone"
                      className="animate-spin text-xl"
                    />

                    Loading users…
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Empty */}

            {!loading &&
              !error &&
              visibleUsers.length ===
                0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-darklink"
                  >
                    {search.trim()
                      ? "No users on this page match your search."
                      : hasActiveFilters
                        ? "No users match the selected filters."
                        : "No users found."}
                  </TableCell>
                </TableRow>
              )}

            {/* Rows */}

            {!loading &&
              !error &&
              visibleUsers.map(
                (user) => (
                  <TableRow
                    key={user.id}
                  >
                    {/* ID */}

                    <TableCell className="text-darklink">
                      #{user.id}
                    </TableCell>

                    {/* User */}

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lightprimary text-xs font-semibold text-primary">
                          {getInitials(
                            user.name,
                            user.username
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="font-medium">
                            {user.name ||
                              "Unnamed user"}
                          </div>

                          <div className="text-xs text-darklink">
                            User #{user.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Username */}

                    <TableCell>
                      {user.username ||
                        "—"}
                    </TableCell>

                    {/* Email */}

                    <TableCell>
                      {user.email ? (
                        <a
                          href={`mailto:${user.email}`}
                          className="hover:text-primary hover:underline"
                        >
                          {user.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    {/* Role */}

                    <TableCell>
                      <Badge
                        variant={
                          roleVariant(
                            user.role
                          ) as any
                        }
                      >
                        {formatRole(
                          user.role
                        )}
                      </Badge>
                    </TableCell>

                    {/* Registered */}

                    <TableCell className="whitespace-nowrap">
                      {formatUserDate(
                        getRegistrationDate(
                          user
                        )
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Pagination                                                     */}
      {/* -------------------------------------------------------------- */}

      {!loading &&
        !error &&
        total > 0 && (
          <ListPagination
            page={page}
            totalPages={totalPages}
            totalRecords={total}
            pageSize={perPage}
            recordLabel="users"
            onPageChange={changePage}
          />
        )}

      {/* Search clarification */}

      {!loading &&
        users.length > 0 && (
          <p className="mt-3 text-xs text-darklink">
            Search filters the users currently
            loaded on this page. Role and date
            filters are applied to the full user
            list.
          </p>
        )}
    </CardBox>
  );
}