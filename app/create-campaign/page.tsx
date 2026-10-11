"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import ThemeShell from "@/components/theme/ThemeShell";
import { authFetch } from "@/lib/client-auth-fetch";

type Category = {
  id: number;
  name: string;
  slug: string;
  parent: number;
};

type LocationOption = {
  value: string;
  label: string;
};

type Uploaded = {
  id: string;
  url: string;
  filename: string;
};

const input =
  "mt-2 w-full rounded-xl border border-[#e0e6eb] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#01A14B] focus:ring-4 focus:ring-[#01A14B]/10";

const label =
  "block text-sm font-bold text-[#111c2d]";

export default function CreateCampaignPage() {
  console.log("### CORRECT CREATE CAMPAIGN PAGE ###");

  const router = useRouter();
  const [step, setStep] = useState(1);

  const [token, setToken] = useState("");

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [locations, setLocations] =
    useState<LocationOption[]>([]);

  const [loadingOptions, setLoadingOptions] =
    useState(false);

  const [busy, setBusy] = useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");

  const [images, setImages] =
    useState<Uploaded[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    story: "",
    category: "",
    sub_category: "",
    location: "",
    goal_amount: "",
    end_date: "",
    min_donation_amount: "5",
    max_donation_amount: "10000",
    suggested: "10,25,50,100",
    confirmation_title: "",
    confirmation_description: "",
  });

  const set = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /*
   * Load campaign categories and GrowFund locations.
   */
  useEffect(() => {
    const accessToken =
      localStorage.getItem("access_token") || "";

    setToken(accessToken);

    if (!accessToken) {
      return;
    }

    setLoadingOptions(true);
    setError("");

    Promise.all([
      /*
       * Load categories.
       */
      authFetch("/api/campaigns/categories", {
        cache: "no-store",
      }).then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load campaign categories."
          );
        }

        return data;
      }),

      /*
       * Load locations.
       */
      authFetch(
        "/api/campaigns/locations?include_rest_of_the_world=true",
        {
          cache: "no-store",
        }
      ).then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load GrowFund locations."
          );
        }

        return data;
      }),
    ])
      .then(([categoryData, locationData]) => {
        /*
         * ----------------------------------------
         * CATEGORIES
         * ----------------------------------------
         */
        const rawCategories = Array.isArray(
          categoryData?.data
        )
          ? categoryData.data
          : [];

        const normalizedCategories =
          rawCategories
            .map((category: any) => ({
              id: Number(
                category.id ??
                  category.term_id ??
                  category.value
              ),

              name: String(
                category.name ??
                  category.label ??
                  category.title ??
                  ""
              ),

              slug: String(
                category.slug ?? ""
              ),

              parent: Number(
                category.parent ??
                  category.parent_id ??
                  0
              ),
            }))
            .filter(
              (category: Category) =>
                Boolean(
                  category.id &&
                    category.name
                )
            );

        setCategories(
          normalizedCategories
        );

        /*
         * ----------------------------------------
         * LOCATIONS
         * ----------------------------------------
         *
         * Actual API structure:
         *
         * {
         *   success: true,
         *   data: [
         *     {
         *       value: "AF",
         *       label: "Afghanistan",
         *       states: [
         *         {
         *           value: "3901",
         *           label: "Badakhshan"
         *         }
         *       ]
         *     }
         *   ]
         * }
         *
         * GrowFund expects the selected value:
         *
         * country code + ":" + state ID
         *
         * Example:
         *
         * AF:3901
         * SO:929
         */
        const countries = Array.isArray(
          locationData?.data
        )
          ? locationData.data
          : [];

        const locationOptions: LocationOption[] =
          [];

        for (const country of countries) {
          const countryCode = String(
            country?.value ?? ""
          ).trim();

          const countryName = String(
            country?.label ?? ""
          ).trim();

          /*
           * Skip the API's initial
           * "Select Country" entry.
           */
          if (
            !countryCode ||
            !countryName
          ) {
            continue;
          }

          const states = Array.isArray(
            country?.states
          )
            ? country.states
            : [];

          /*
           * Countries with states / regions.
           */
          for (const state of states) {
            const stateId = String(
              state?.value ?? ""
            ).trim();

            const stateName = String(
              state?.label ?? ""
            ).trim();

            if (
              !stateId ||
              !stateName
            ) {
              continue;
            }

            locationOptions.push({
              value: `${countryCode}:${stateId}`,
              label: `${countryName} — ${stateName}`,
            });
          }
        }

        /*
         * Sort alphabetically by the
         * readable country/state label.
         */
        locationOptions.sort(
          (a, b) =>
            a.label.localeCompare(
              b.label
            )
        );

        setLocations(
          locationOptions
        );

        /*
         * Temporary useful debug message.
         * It doesn't expose any authentication
         * information.
         */
        console.log(
          "[create-campaign] GrowFund locations loaded:",
          locationOptions.length
        );

        if (
          locationOptions.length === 0
        ) {
          console.warn(
            "[create-campaign] GrowFund returned the locations request, but no country/state options were created."
          );
        }
      })
      .catch((caughtError) => {
        console.error(
          "[create-campaign] Unable to load campaign options:",
          caughtError
        );

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load campaign options."
        );
      })
      .finally(() => {
        setLoadingOptions(false);
      });
  }, []);

  /*
   * Main/root categories.
   */
  const parents = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.parent === 0
      ),
    [categories]
  );

  /*
   * Subcategories belonging to
   * the currently selected category.
   */
  const children = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.parent ===
          Number(form.category)
      ),
    [categories, form.category]
  );

  /*
   * Upload campaign images.
   */
  async function upload(
    files: FileList | null
  ) {
    if (
      !files?.length ||
      !token
    ) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData =
        new FormData();

      Array.from(files).forEach(
        (file) => {
          formData.append(
            "images[]",
            file
          );
        }
      );

      const response =
        await authFetch(
          "/api/campaigns/media",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Image upload failed."
        );
      }

      setImages((current) => [
        ...current,
        ...(data.images || []),
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  /*
   * Validate each campaign creation step.
   */
  function validate(
    currentStep: number
  ) {
    if (
      currentStep === 1 &&
      (
        !form.title.trim() ||
        !form.description.trim() ||
        !form.location.trim() ||
        !form.category
      )
    ) {
      setError(
        "Complete the required campaign details before continuing."
      );

      return false;
    }

    if (
      currentStep === 2 &&
      (
        !form.goal_amount ||
        Number(form.goal_amount) <= 0
      )
    ) {
      setError(
        "Enter a fundraising goal greater than zero."
      );

      return false;
    }


    setError("");

    return true;
  }

  /*
   * Submit the finished campaign.
   */
  async function submit(
    event: FormEvent
  ) {
    event.preventDefault();

    if (!token) {
      setError(
        "Please sign in with a fundraiser account first."
      );

      return;
    }

    if (!validate(1) || !validate(2)) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const suggested =
        form.suggested
          .split(",")
          .map((value) =>
            Number(value.trim())
          )
          .filter(
            (value) =>
              value > 0
          )
          .map(
            (
              amount,
              index
            ) => ({
              amount,
              is_default:
                index === 1,
              description: "",
            })
          );

      const payload = {
        title:
          form.title,

        description:
          form.description,

        story:
          form.story,

        images:
          images.map(
            (image) =>
              Number(image.id)
          ),

        category:
          Number(
            form.category
          ),

        sub_category:
          form.sub_category
            ? Number(
                form.sub_category
              )
            : 0,

        /*
         * This is now something like:
         *
         * AF:3901
         * SO:929
         */
        location:
          form.location,

        end_date:
          form.end_date
            ? `${form.end_date} 23:59:59`
            : undefined,

        has_goal:
          true,

        goal_type:
          "raised-amount",

        goal_amount:
          Number(
            form.goal_amount
          ),

        reaching_action:
          "close",

        allow_custom_donation:
          true,

        min_donation_amount:
          form.min_donation_amount,

        max_donation_amount:
          form.max_donation_amount,

        suggested_option_type:
          "amount-only",

        suggested_options:
          suggested,

        confirmation_title:
          form.confirmation_title,

        confirmation_description:
          form.confirmation_description,

        status:
          "pending",

        tags:
          [],

        collaborators:
          [],

       show_collaborator_list:
  false,

is_featured:
  false,

faqs: [],
};
const response = await authFetch(
  "/api/campaigns/create",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }
);

const data = await response.json();

console.log(
  "[create-campaign] Next API response:",
  data
);

if (!response.ok || data?.success === false) {
  throw new Error(
    data?.message ||
      Object.values(data?.data?.details || {})
        .flat()
        .join(" ") ||
      "Campaign creation failed."
  );
}

const campaignId = Number(data?.id);

if (!Number.isFinite(campaignId) || campaignId <= 0) {
  throw new Error(
    "Campaign creation did not return a valid campaign ID."
  );
}

router.push(
  `/dashboard/campaigns/${campaignId}/edit`
);

router.refresh();

return;

} catch (caughtError) {
  setError(
    caughtError instanceof Error
      ? caughtError.message
      : "Campaign creation failed."
  );
} finally {
  setBusy(false);
}
  }

  /*
   * Not signed in.
   */
  if (!token) {
    return (
      <ThemeShell>
        <main className="container-1218 py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-[#e0e6eb] bg-[#f8fafd] p-8 text-center">
            <h1 className="text-3xl font-extrabold">
              Create a campaign
            </h1>

            <p className="mt-3 text-[#5a6a85]">
              Sign in with your
              fundraiser account
              before starting a
              campaign.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-[#01A14B] px-6 py-3 font-bold text-white"
            >
              Sign in
            </Link>
          </div>
        </main>
      </ThemeShell>
    );
  }

  /*
   * Campaign successfully submitted.
   */
  

  return (
    <ThemeShell>
      <main className="bg-[#f8fafd] py-10">
        <div className="container-1218">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wider text-[#01A14B]">
              Fundraise on
              Hiilbox
            </p>

            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Create your
              campaign
            </h1>

            <p className="mt-2 text-[#5a6a85]">
              Add your campaign details,
              set your goal, and customize
              the donor confirmation message.
            </p>
          </div>

          <div className="mb-7 grid grid-cols-3 gap-2">
            {[
              "Basics",
              "Goal",
              "Donation confirmation",
            ].map(
              (
                stepLabel,
                index
              ) => (
                <button
                  type="button"
                  key={
                    stepLabel
                  }
                  onClick={() => {
                    setError("");
                    setStep(index + 1);
                  }}
                  className={`rounded-xl px-3 py-3 text-center text-xs font-bold sm:text-sm ${
                    step >=
                    index + 1
                      ? "bg-[#01A14B] text-white"
                      : "bg-white text-[#5a6a85]"
                  }`}
                >
                  {index + 1}.{" "}
                  {
                    stepLabel
                  }
                </button>
              )
            )}
          </div>

          <form
            onSubmit={
              submit
            }
            className="rounded-3xl border border-[#e0e6eb] bg-white p-6 shadow-sm sm:p-8"
          >
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/*
             * STEP 1
             * Campaign basics.
             */}
            {step === 1 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    className={
                      label
                    }
                  >
                    Campaign
                    title *
                  </label>

                  <input
                    className={
                      input
                    }
                    value={
                      form.title
                    }
                    onChange={(
                      event
                    ) =>
                      set(
                        "title",
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Help us build..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    className={
                      label
                    }
                  >
                    Short
                    description *
                  </label>

                  <textarea
                    className={
                      input
                    }
                    rows={3}
                    value={
                      form.description
                    }
                    onChange={(
                      event
                    ) =>
                      set(
                        "description",
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="A clear summary of what you are raising money for."
                  />
                </div>

                <div>
                  <label
                    className={
                      label
                    }
                  >
                    Category *
                  </label>

                  <select
                    className={
                      input
                    }
                    value={
                      form.category
                    }
                    onChange={(
                      event
                    ) => {
                      set(
                        "category",
                        event
                          .target
                          .value
                      );

                      set(
                        "sub_category",
                        ""
                      );
                    }}
                  >
                    <option value="">
                      Choose
                      category
                    </option>

                    {parents.map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    className={
                      label
                    }
                  >
                    Subcategory
                  </label>

                  <select
                    className={
                      input
                    }
                    value={
                      form.sub_category
                    }
                    onChange={(
                      event
                    ) =>
                      set(
                        "sub_category",
                        event
                          .target
                          .value
                      )
                    }
                  >
                    <option value="">
                      None
                    </option>

                    {children.map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    className={
                      label
                    }
                  >
                    Location *
                  </label>

                  <select
                    className={
                      input
                    }
                    value={
                      form.location
                    }
                    onChange={(
                      event
                    ) =>
                      set(
                        "location",
                        event
                          .target
                          .value
                      )
                    }
                    disabled={
                      loadingOptions
                    }
                  >
                    <option value="">
                      {loadingOptions
                        ? "Loading GrowFund locations…"
                        : locations.length >
                            0
                          ? "Choose location"
                          : "No locations available"}
                    </option>

                    {locations.map(
                      (
                        location
                      ) => (
                        <option
                          key={
                            location.value
                          }
                          value={
                            location.value
                          }
                        >
                          {
                            location.label
                          }
                        </option>
                      )
                    )}
                  </select>

                  <p className="mt-2 text-xs text-[#5a6a85]">
                    The campaign
                    stores
                    GrowFund&apos;s
                    location value
                    (for example{" "}
                    <strong>
                      SO:929
                    </strong>
                    ) while you
                    choose the
                    readable
                    country/state
                    name.
                  </p>

                  {!loadingOptions &&
                    locations.length >
                      0 && (
                      <p className="mt-1 text-xs text-[#5a6a85]">
                        {
                          locations.length
                        }{" "}
                        locations
                        loaded.
                      </p>
                    )}
                </div>
              </div>
            )}

            {/*
             * STEP 2
             * Fundraising goal.
             */}
            {step === 2 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    className={
                      label
                    }
                  >
                    Fundraising
                    goal (USD) *
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    className={
                      input
                    }
                    value={
                      form.goal_amount
                    }
                    onChange={(
                      event
                    ) => {
                      const value = event.target.value;
                      setForm((current) => ({
                        ...current,
                        goal_amount: value,
                        max_donation_amount: value,
                      }));
                    }}
                  />
                </div>

                <div>
                  <label
                    className={
                      label
                    }
                  >
                    End date
                  </label>

                  <input
                    type="date"
                    className={
                      input
                    }
                    value={
                      form.end_date
                    }
                    onChange={(
                      event
                    ) =>
                      set(
                        "end_date",
                        event
                          .target
                          .value
                      )
                    }
                  />
                </div>

                <div>
                  <label
                    className={
                      label
                    }
                  >
                    Minimum
                    donation
                    (USD)
                  </label>

                  <input
                    type="number"
                    min="1"
                    className={
                      input
                    }
                    value={
                      form.min_donation_amount
                    }
                    onChange={(
                      event
                    ) =>
                      set(
                        "min_donation_amount",
                        event
                          .target
                          .value
                      )
                    }
                  />
                </div>

                <div>
                  <label
                    className={
                      label
                    }
                  >
                    Maximum
                    donation
                    (USD)
                  </label>

                  <input
                    type="number"
                    min="1"
                    className={
                      input
                    }
                    value={
                      form.goal_amount
                    }
                    readOnly

                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    className={
                      label
                    }
                  >
                    Suggested
                    donation
                    amounts
                  </label>

                  <input
                    className={
                      input
                    }
                    value={
                      form.suggested
                    }
                    onChange={(
                      event
                    ) =>
                      set(
                        "suggested",
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="10,25,50,100"
                  />

                  <p className="mt-2 text-xs text-[#5a6a85]">
                    Comma-separated
                    USD amounts.
                  </p>
                </div>
              </div>
            )}

            {/*
             * STEP 3
             * Donation confirmation.
             */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className={label}>
                    Confirmation title
                  </label>
                  <input
                    className={input}
                    value={form.confirmation_title}
                    onChange={(event) =>
                      set("confirmation_title", event.target.value)
                    }
                    placeholder="Thank you for your donation!"
                  />
                </div>

                <div>
                  <label className={label}>
                    Confirmation message
                  </label>
                  <textarea
                    className={input}
                    rows={6}
                    value={form.confirmation_description}
                    onChange={(event) =>
                      set("confirmation_description", event.target.value)
                    }
                    placeholder="Write the message donors will see after donating."
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-[#e0e6eb] pt-6">
              <button
                type="button"
                disabled={
                  step === 1 ||
                  busy
                }
                onClick={() => {
                  setError("");

                  setStep(
                    (
                      current
                    ) =>
                      Math.max(
                        1,
                        current -
                          1
                      )
                  );
                }}
                className="rounded-xl border border-[#e0e6eb] px-5 py-3 font-bold disabled:opacity-40"
              >
                Back
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      validate(
                        step
                      )
                    ) {
                      setStep(
                        (
                          current
                        ) =>
                          current +
                          1
                      );
                    }
                  }}
                  className="rounded-xl bg-[#01A14B] px-6 py-3 font-bold text-white"
                >
                  Continue
                </button>
              ) : (
                <button
                  disabled={
                    busy ||
                    uploading
                  }
                  className="rounded-xl bg-[#01A14B] px-6 py-3 font-bold text-white disabled:opacity-50"
                >
                  {busy
                    ? "Submitting..."
                    : "Submit campaign"}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </ThemeShell>
  );
}