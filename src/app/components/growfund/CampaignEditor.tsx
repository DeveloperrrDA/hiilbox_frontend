"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CardBox from "@/app/components/shared/CardBox";
import { Button } from "@/components/ui/button";

import { Icon } from "@iconify/react";
import { dashboardRole, savedDashboardUser } from "@/lib/dashboard/roles";

type Category = {
  id: number;
  name: string;
  parent: number;
};

type LocationOption = {
  value: string;
  label: string;
};

type PersonOption = {
  id: number;
  name: string;
  email: string;
  image?: string;
};

type UploadedMedia = {
  id: number;
  url: string;
  filename?: string;
};

type FormState = {
  title: string;
  description: string;
  story: string;

  category: string;
  sub_category: string;

  start_date: string;
  end_date: string;

  location: string;
  

  goal_amount: string;

  min_donation_amount: string;
  max_donation_amount: string;

  suggested: string;

  confirmation_title: string;
  confirmation_description: string;

  reaching_action: string;
  suggested_option_type: string;
  allow_custom_donation: string;

  is_featured: string;
  show_collaborator_list: string;
};

function readId(value: any) {
  return String(value?.id ?? value?.term_id ?? value ?? "");
}

function readDate(value: any) {
  if (!value) return "";
  const text = String(value);
  return text.length >= 10 ? text.slice(0, 10) : text;
}

export default function CampaignEditor({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [campaignStatus, setCampaignStatus] = useState("");
const [isPaused, setIsPaused] = useState(false);
const [isHidden, setIsHidden] = useState(false);
const [isEnded, setIsEnded] = useState(false);
const [actionBusy, setActionBusy] = useState(false);
const [selectedAction, setSelectedAction] = useState("");
  const [section, setSection] = useState<"basics" | "goal" | "options">("basics");
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  const [images, setImages] = useState<any[]>([]);
const [uploadingImages, setUploadingImages] = useState(false);

const [video, setVideo] = useState<any | null>(null);
const [videoUrl, setVideoUrl] = useState("");
const [uploadingVideo, setUploadingVideo] = useState(false);

const [fundraiser, setFundraiser] = useState<PersonOption | null>(null);

const [collaboratorOptions, setCollaboratorOptions] =
  useState<PersonOption[]>([]);

const [selectedCollaborators, setSelectedCollaborators] =
  useState<PersonOption[]>([]);

const [collaboratorSearch, setCollaboratorSearch] = useState("");
 const [form, setForm] = useState<FormState>({
  title: "",
  description: "",
  story: "",

  category: "",
  sub_category: "",

  start_date: "",
  end_date: "",

  location: "",
  

  goal_amount: "",

  min_donation_amount: "1",
  max_donation_amount: "10000",

  suggested: "10,25,50,100",

  confirmation_title: "",
  confirmation_description: "",

  reaching_action: "continue",
  suggested_option_type: "amount-only",
  allow_custom_donation: "true",

  is_featured: "false",
  show_collaborator_list: "false",
});

  const set = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token") || "";
    if (!accessToken) {
      setError("Please sign in to edit this campaign.");
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${accessToken}` };
    const isAdmin = dashboardRole(savedDashboardUser()) === "admin";
    const campaignEndpoint = isAdmin ? `/api/admin/growfund/campaigns/${id}` : `/api/dashboard/campaigns/${id}`;
Promise.all([
  fetch(campaignEndpoint, {
    headers,
    cache: "no-store",
  }).then(async (response) => {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Unable to load campaign."
      );
    }

    return data;
  }),

  fetch("/api/campaigns/categories", {
    headers,
    cache: "no-store",
  }).then((response) => response.json()),

  fetch(
    "/api/campaigns/locations?include_rest_of_the_world=true",
    {
      headers,
      cache: "no-store",
    }
  ).then((response) => response.json()),

  fetch(
    "/api/campaigns/collaborators?page=1&per_page=100",
    {
      headers,
      cache: "no-store",
    }
  ).then((response) => response.json()),
])
     .then(
  ([
    campaignResponse,
    categoryResponse,
    locationResponse,
    collaboratorResponse,
  ]) => {
        const campaign = campaignResponse?.data || {};

setCampaignStatus(
  String(campaign.status ?? "")
);

const flagIsTrue = (value: any) =>
  value === true ||
  value === 1 ||
  String(value ?? "").trim().toLowerCase() === "true" ||
  String(value ?? "").trim() === "1";

setIsPaused(flagIsTrue(campaign.is_paused));
setIsHidden(flagIsTrue(campaign.is_hidden));
setIsEnded(flagIsTrue(campaign.is_ended));

/*
 * ----------------------------------------
 * CATEGORIES + SUBCATEGORIES
 * ----------------------------------------
 */

const rawCategories = Array.isArray(categoryResponse?.data)
  ? categoryResponse.data
  : [];

const normalizedCategories: Category[] = [];

const addCategory = (
  item: any,
  fallbackParent = 0
) => {
  if (!item || typeof item !== "object") {
    return;
  }

  const categoryId = Number(
    item.id ??
      item.term_id ??
      item.value ??
      0
  );

  const categoryName = String(
    item.name ??
      item.label ??
      item.title ??
      ""
  ).trim();

  if (!categoryId || !categoryName) {
    return;
  }

  const parentId = Number(
    item.parent ??
      item.parent_id ??
      item.parent?.id ??
      fallbackParent ??
      0
  );

  if (
    !normalizedCategories.some(
      (category) => category.id === categoryId
    )
  ) {
    normalizedCategories.push({
      id: categoryId,
      name: categoryName,
      parent: parentId,
    });
  }

  const children = Array.isArray(item.children)
    ? item.children
    : Array.isArray(item.sub_categories)
      ? item.sub_categories
      : Array.isArray(item.subcategories)
        ? item.subcategories
        : [];

  for (const child of children) {
    addCategory(child, categoryId);
  }
};

for (const category of rawCategories) {
  addCategory(category);
}

setCategories(normalizedCategories);


/*
 * ----------------------------------------
 * LOCATIONS
 * ----------------------------------------
 *
 * GrowFund returns:
 *
 * {
 *   value: "AF",
 *   label: "Afghanistan",
 *   states: [
 *     {
 *       value: "3901",
 *       label: "Badakhshan"
 *     }
 *   ]
 * }
 *
 * GrowFund campaign location values use:
 *
 * AF:3901
 */

const countries = Array.isArray(
  locationResponse?.data
)
  ? locationResponse.data
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
 * Preserve the campaign's currently
 * saved location if GrowFund does not
 * return it in the dropdown response.
 */
if (
  campaign.location &&
  !locationOptions.some(
    (item) =>
      item.value ===
      String(campaign.location)
  )
) {
  locationOptions.push({
    value: String(campaign.location),
    label: String(
      campaign.location_label ??
        campaign.location
    ),
  });
}

locationOptions.sort(
  (a, b) =>
    a.label.localeCompare(
      b.label
    )
);

setLocations(
  locationOptions
);

const rawFundraiser =
  campaign.fundraiser ??
  campaign.author ??
  campaign.user ??
  null;

if (rawFundraiser) {
  setFundraiser({
    id: Number(
      rawFundraiser.id ??
        rawFundraiser.ID ??
        campaign.fundraiser_id ??
        campaign.author_id ??
        0
    ),

    name: String(
      rawFundraiser.name ??
        rawFundraiser.display_name ??
        rawFundraiser.full_name ??
        [
          rawFundraiser.first_name,
          rawFundraiser.last_name,
        ]
          .filter(Boolean)
          .join(" ") ??
        ""
    ),

    email: String(
      rawFundraiser.email ??
        rawFundraiser.user_email ??
        ""
    ),

    image: String(
      rawFundraiser.image ??
        rawFundraiser.avatar ??
        rawFundraiser.avatar_url ??
        ""
    ),
  });
}

const personFrom = (item: any): PersonOption => ({
  id: Number(
    item?.id ??
      item?.ID ??
      item?.user_id ??
      0
  ),

  name: String(
    item?.name ??
      item?.display_name ??
      item?.full_name ??
      [
        item?.first_name,
        item?.last_name,
      ]
        .filter(Boolean)
        .join(" ") ??
      item?.username ??
      ""
  ),

  email: String(
    item?.email ??
      item?.user_email ??
      ""
  ),

  image: String(
    item?.image ??
      item?.avatar ??
      item?.avatar_url ??
      ""
  ),
});

const collaboratorRows =
  collaboratorResponse?.data?.results ??
  collaboratorResponse?.data?.items ??
  collaboratorResponse?.data ??
  collaboratorResponse?.results ??
  collaboratorResponse?.items ??
  [];

const normalizedCollaborators = Array.isArray(
  collaboratorRows
)
  ? collaboratorRows
      .map(personFrom)
      .filter(
        (person: PersonOption) =>
          person.id > 0
      )
  : [];

setCollaboratorOptions(
  normalizedCollaborators
);

const campaignCollaborators = Array.isArray(
  campaign.collaborators
)
  ? campaign.collaborators
      .map(personFrom)
      .filter(
        (person: PersonOption) =>
          person.id > 0
      )
  : [];

setSelectedCollaborators(
  campaignCollaborators
);

const rawVideo = Array.isArray(campaign.video)
  ? campaign.video[0]
  : campaign.video;

if (rawVideo && typeof rawVideo === "object") {
  setVideo(rawVideo);
}

setVideoUrl(
  String(
    campaign.video_url ??
      rawVideo?.url ??
      ""
  )
);
        const suggestedOptions = Array.isArray(campaign.suggested_options)
          ? campaign.suggested_options
              .map((item: any) => Number(item?.amount ?? item))
              .filter((amount: number) => Number.isFinite(amount) && amount > 0)
              .join(",")
          : "10,25,50,100";

        setForm({
  title: String(
    campaign.title ?? ""
  ),

  description: String(
    campaign.description ?? ""
  ),

  story: String(
    campaign.story ??
      campaign.description ??
      ""
  ),

  category: readId(
    campaign.category ??
      campaign.category_id
  ),

  sub_category: readId(
    campaign.sub_category ??
      campaign.sub_category_id
  ),

  start_date: readDate(
    campaign.start_date ??
      campaign.launch_date
  ),

  end_date: readDate(
    campaign.end_date ??
      campaign.deadline
  ),

  location: String(
    campaign.location ?? ""
  ),

 

  goal_amount: String(
    campaign.goal_amount ??
      campaign.goal ??
      ""
  ),

  min_donation_amount: String(
  campaign.min_donation_amount ??
    "1"
),

  max_donation_amount: String(
    campaign.max_donation_amount ??
      "10000"
  ),

  suggested:
    suggestedOptions ||
    "10,25,50,100",

  confirmation_title: String(
    campaign.confirmation_title ??
      ""
  ),

  confirmation_description: String(
    campaign.confirmation_description ??
      ""
  ),

  reaching_action: String(
    campaign.reaching_action ??
      "continue"
  ),

  suggested_option_type: String(
    campaign.suggested_option_type ??
      "amount-only"
  ),

  allow_custom_donation: String(
    campaign.allow_custom_donation ??
      true
  ),

  is_featured: String(
    campaign.is_featured ??
      false
  ),

  show_collaborator_list: String(
    campaign.show_collaborator_list ??
      false
  ),
});
        const rawImages = Array.isArray(campaign.images) ? campaign.images : Array.isArray(campaign.gallery) ? campaign.gallery : [];
        setImages(rawImages);
        const rawFaqs = Array.isArray(campaign.faqs) ? campaign.faqs : [];
        setFaqs(rawFaqs.map((faq: any) => ({ question: String(faq?.question ?? faq?.title ?? ""), answer: String(faq?.answer ?? faq?.description ?? "") })));
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load campaign."))
      .finally(() => setLoading(false));
  }, [id]);

  const parents = useMemo(() => categories.filter((category) => category.parent === 0), [categories]);
  const children = useMemo(() => categories.filter((category) => category.parent === Number(form.category)), [categories, form.category]);

async function uploadMedia(
  files: FileList | null,
  kind: "images" | "video"
) {
  if (!files?.length) return;

  const accessToken =
    localStorage.getItem("access_token") || "";

  if (!accessToken) return;

  if (kind === "images") {
    setUploadingImages(true);
  } else {
    setUploadingVideo(true);
  }

  setError("");

  try {
    const body = new FormData();

    const selectedFiles =
      kind === "video"
        ? [files[0]]
        : Array.from(files);

    selectedFiles.forEach((file) => {
      body.append("images[]", file);
    });

    const response = await fetch(
      "/api/campaigns/media",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

        body,
      }
    );

    const data = await response
      .json()
      .catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message ||
          (kind === "video"
            ? "Video upload failed."
            : "Image upload failed.")
      );
    }

    const uploaded = Array.isArray(data?.images)
      ? data.images
      : Array.isArray(data?.data?.images)
        ? data.data.images
        : [];

    if (!uploaded.length) {
      throw new Error(
        kind === "video"
          ? "Video upload failed."
          : "Image upload failed."
      );
    }

    if (kind === "video") {
      setVideo(uploaded[0]);
      setVideoUrl("");
    } else {
      setImages((current) => [
        ...current,
        ...uploaded,
      ]);
    }
  } catch (reason) {
    setError(
      reason instanceof Error
        ? reason.message
        : kind === "video"
          ? "Video upload failed."
          : "Image upload failed."
    );
  } finally {
    if (kind === "images") {
      setUploadingImages(false);
    } else {
      setUploadingVideo(false);
    }
  }
}

  function validate(
  mode: "draft" | "publish"
) {
  const errors: Record<string, string> = {};

  const suggested = form.suggested
    .split(",")
    .map((value) => Number(value.trim()))
    .filter(
      (value) =>
        Number.isFinite(value) &&
        value > 0
    );

  if (mode === "publish") {
    if (!form.title.trim()) {
      errors.title =
        "Campaign title is required.";
    }

    if (!form.description.trim()) {
      errors.description =
        "Short description is required.";
    }

    if (!form.story.trim()) {
      errors.story =
        "Campaign story is required.";
    }

    if (!form.category) {
      errors.category =
        "Select a category.";
    }

    if (!form.location) {
      errors.location =
        "Select a location.";
    }

    if (
      !Number.isFinite(
        Number(form.goal_amount)
      ) ||
      Number(form.goal_amount) <= 0
    ) {
      errors.goal_amount =
        "Enter a goal greater than zero.";
    }

    if (!form.end_date) {
      errors.end_date =
        "Select an end date.";
    }

    if (!suggested.length) {
      errors.suggested =
        "Add at least one suggested donation amount.";
    }
  }

  const min = Number(
    form.min_donation_amount
  );

  const max = Number(
    form.max_donation_amount
  );

 if (
  form.min_donation_amount &&
  (!Number.isFinite(min) || min < 1)
) {
  errors.min_donation_amount =
    "Minimum donation must be at least $1.";
}

  if (
    form.max_donation_amount &&
    (!Number.isFinite(max) || max <= 0)
  ) {
    errors.max_donation_amount =
      "Enter a valid maximum donation.";
  }

  if (
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    max < min
  ) {
    errors.max_donation_amount =
      "Maximum donation must be at least the minimum.";
  }

  setFieldErrors(errors);

  return {
    valid:
      Object.keys(errors).length === 0,
    suggested,
  };
}
  async function saveCampaign(
  mode: "draft" | "publish"
) {
  const accessToken =
    localStorage.getItem("access_token") || "";

  if (!accessToken) {
    setError(
      "Please sign in to edit this campaign."
    );
    return;
  }

  const result = validate(mode);

  if (!result.valid) {
    return;
  }

  setSaving(true);
  setError("");

  try {
    const suggestedOptions =
      result.suggested.map(
        (amount, index) => ({
          amount,

          is_default:
            index ===
            Math.min(
              1,
              result.suggested.length - 1
            ),

          description: "",
        })
      );

  

    const payload: Record<string, any> = {
      title:
        form.title.trim() || "Untitled",

      description:
        form.description.trim(),

      story:
        form.story.trim(),

      category: form.category
        ? Number(form.category)
        : 0,

      location: form.location,

      start_date: form.start_date
        ? `${form.start_date} 00:00:00`
        : "",

      end_date: form.end_date
        ? `${form.end_date} 23:59:59`
        : "",

      

      has_goal: true,

      goal_type: "raised-amount",

      goal_amount:
        Number(form.goal_amount) || 0,

      reaching_action:
        form.reaching_action,

      allow_custom_donation:
        form.allow_custom_donation ===
        "true",

      min_donation_amount:
        form.min_donation_amount,

      max_donation_amount:
        form.max_donation_amount,

      suggested_option_type:
        form.suggested_option_type,

      suggested_options:
        suggestedOptions,

      images: images
        .map((image: any) =>
          Number(
            image?.id ??
              image?.media_id ??
              image
          )
        )
        .filter(
          (value: number) =>
            Number.isFinite(value) &&
            value > 0
        ),

      is_featured:
        form.is_featured === "true",

      collaborators:
        selectedCollaborators.map(
          (person) => person.id
        ),

      show_collaborator_list:
        form.show_collaborator_list ===
        "true",

      confirmation_title:
        form.confirmation_title.trim(),

      confirmation_description:
        form.confirmation_description.trim(),

      faqs: faqs.filter(
        (faq) =>
          faq.question.trim() ||
          faq.answer.trim()
      ),

      status:
        mode === "draft"
          ? "draft"
          : "published",
    };

    if (form.sub_category) {
      payload.sub_category =
        Number(form.sub_category);
    }

    if (fundraiser?.id) {
      payload.fundraiser_id =
        String(fundraiser.id);
    }

    if (video?.id) {
      payload.video = {
        id: Number(video.id),
      };
    }

    /*
     * Keep URL video separate from uploaded
     * media. The custom backend must persist
     * video_url before this field is enabled.
     */
    if (videoUrl.trim() && !video?.id) {
      payload.video_url =
        videoUrl.trim();
    }

    const response = await fetch(
      `/api/dashboard/campaigns/${id}`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (
        data?.details &&
        typeof data.details === "object"
      ) {
        const normalized: Record<
          string,
          string
        > = {};

        for (const [key, value] of Object.entries(
          data.details
        )) {
          normalized[key] =
            Array.isArray(value)
              ? value.join(" ")
              : String(value);
        }

        setFieldErrors(normalized);
      }

      throw new Error(
        data?.message ||
          "Unable to update campaign."
      );
    }

    sessionStorage.setItem(
      "growfund_campaign_updated",
      id
    );

    router.push(
      `/dashboard/campaigns/${id}/overview`
    );

    router.refresh();
  } catch (reason) {
    setError(
      reason instanceof Error
        ? reason.message
        : "Unable to update campaign."
    );
  } finally {
    setSaving(false);
  }
}
async function campaignAction(
  action: "pause" | "resume" | "ended" | "hidden" | "visible"
) {
  const accessToken =
    localStorage.getItem("access_token") || "";

  if (!accessToken || actionBusy) return;

  setActionBusy(true);
  setError("");

  try {
    const response = await fetch(
      `/api/admin/growfund/campaign/${id}/update-secondary-status`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action,
        }),
      }
    );

    const data = await response
      .json()
      .catch(() => null);

    if (!response.ok || data?.success === false) {
      throw new Error(
        data?.message ||
          "Unable to update campaign status."
      );
    }

    if (action === "pause") {
  setIsPaused(true);
}

if (action === "resume") {
  setIsPaused(false);
}

if (action === "hidden") {
  setIsHidden(true);
}

if (action === "visible") {
  setIsHidden(false);
}

if (action === "ended") {
  setIsEnded(true);
}

router.refresh();
  } catch (reason) {
    setError(
      reason instanceof Error
        ? reason.message
        : "Unable to update campaign status."
    );
  } finally {
    setActionBusy(false);
  }
}

async function deleteCampaign() {
  const accessToken =
    localStorage.getItem("access_token") || "";

  if (!accessToken || actionBusy) return;

  if (
    !window.confirm(
      "Move this campaign to trash?"
    )
  ) {
    return;
  }

  setActionBusy(true);
  setError("");

  try {
    const response = await fetch(
      `/api/admin/growfund/campaign/${id}/delete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    const data = await response
      .json()
      .catch(() => null);

    if (!response.ok || data?.success === false) {
      throw new Error(
        data?.message ||
          "Unable to delete campaign."
      );
    }

    router.push("/dashboard/campaigns");
    router.refresh();
  } catch (reason) {
    setError(
      reason instanceof Error
        ? reason.message
        : "Unable to delete campaign."
    );

    setActionBusy(false);
  }
}
async function applyCampaignAction() {
  if (!selectedAction || actionBusy) return;

  if (selectedAction === "delete") {
    await deleteCampaign();
    return;
  }

  await campaignAction(
    selectedAction as
      | "pause"
      | "resume"
      | "ended"
      | "hidden"
      | "visible"
  );

  setSelectedAction("");
}

async function submit(
  event: FormEvent
) {
  event.preventDefault();

  await saveCampaign("publish");
}
      

  if (loading) return <CardBox><div className="py-12 text-center text-darklink">Loading campaign…</div></CardBox>;

  const suggestedValues = form.suggested.split(",").map((v)=>v.trim()).filter(Boolean);
  const imageUrl=(image:any)=>String(image?.url??image?.src??image?.source_url??image?.sizes?.medium??"");

  return <form onSubmit={submit} className="min-h-screen bg-lightgray/40">
    <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-ld bg-white px-5 py-4 dark:bg-darkgray">
      <div className="flex items-center gap-3"><Button type="button" variant="ghost" size="sm" onClick={()=>router.push("/dashboard/campaigns")}><Icon icon="solar:arrow-left-linear"/></Button><h2 className="text-xl font-semibold">Edit Campaign</h2></div>
      <div className="flex items-center gap-2">{[["basics","Basic","solar:rocket-2-line-duotone"],["goal","Goal","solar:dollar-minimalistic-line-duotone"],["options","Options","solar:card-2-line-duotone"]].map(([key,label,icon])=><button key={key} type="button" onClick={()=>setSection(key as any)} className={`flex items-center gap-2 rounded-xl px-5 py-3 ${section===key?"bg-white text-success shadow-sm":"text-dark"}`}><Icon icon={icon}/>{label}</button>)}</div>
<div className="flex flex-wrap gap-2">
  <Button
    type="button"
    variant="outline"
    asChild
  >
    <Link href={`/campaign/${id}`}>
      Preview
      <Icon icon="solar:square-arrow-right-up-linear" />
    </Link>
  </Button>

  {campaignStatus.toLowerCase() === "draft" ? (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={
          saving ||
          uploadingImages ||
          uploadingVideo
        }
        onClick={() => void saveCampaign("draft")}
      >
        {saving ? "Saving…" : "Save as Draft"}
      </Button>

      <Button
        type="button"
        disabled={
          saving ||
          uploadingImages ||
          uploadingVideo
        }
        onClick={() => void saveCampaign("publish")}
      >
        {saving ? "Saving…" : "Publish"}
      </Button>
    </>
  ) : (
    <Button
      type="button"
      disabled={
        saving ||
        uploadingImages ||
        uploadingVideo
      }
      onClick={() => void saveCampaign("publish")}
    >
      {saving ? "Saving…" : "Save Changes"}
    </Button>
  )}
</div>    </div>
    <div className="mx-auto max-w-6xl p-5 lg:p-8">
      {error&&<div className="mb-5 rounded-md border border-error/30 bg-lighterror px-4 py-3 text-sm text-error">{error}</div>}
      <div className="mb-5 rounded-md border border-warning/30 bg-lightwarning px-4 py-3 text-sm text-warning">Saving campaign edits sends supported GrowFund changes for review. Current status: <strong>{campaignStatus||"unknown"}</strong>.</div>

      {section === "basics" && (
  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
    <CardBox>
      <div className="space-y-5">
        <Field
          label="Title"
          value={form.title}
          onChange={(value: string) =>
            set("title", value)
          }
          error={fieldErrors.title}
        />

        <TextArea
          label="Description"
          value={form.description}
          onChange={(value: string) =>
            set("description", value)
          }
          error={fieldErrors.description}
          rows={5}
        />

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-dark">
              Story
            </span>

            <label className="cursor-pointer rounded-md border border-ld px-3 py-2 text-xs font-medium hover:bg-lightgray">
              <Icon
                icon="solar:gallery-add-linear"
                className="mr-1 inline"
              />
              Add media

              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploadingImages}
                onChange={(event) =>
                  void uploadMedia(
                    event.target.files,
                    "images"
                  )
                }
              />
            </label>
          </div>

          <textarea
            rows={12}
            value={form.story}
            onChange={(event) =>
              set(
                "story",
                event.target.value
              )
            }
            className={`w-full rounded-md border bg-transparent px-3 py-2.5 outline-none focus:border-primary ${
              fieldErrors.story
                ? "border-error"
                : "border-ld"
            }`}
          />

          {fieldErrors.story && (
            <span className="mt-1 block text-xs text-error">
              {fieldErrors.story}
            </span>
          )}
        </div>

        <div className="border-t border-ld pt-5">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="font-medium">
                Campaign Images
              </div>

              <div className="text-xs text-darklink">
                The first image is used as
                the campaign cover.
              </div>
            </div>

            <label className="cursor-pointer rounded-md border border-ld px-3 py-2 text-sm font-medium hover:bg-lightgray">
              {uploadingImages
                ? "Uploading…"
                : "Upload images"}

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                disabled={uploadingImages}
                onChange={(event) =>
                  void uploadMedia(
                    event.target.files,
                    "images"
                  )
                }
              />
            </label>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map(
              (image: any, index: number) => {
                const url =
                  imageUrl(image);

                return (
                  <div
                    key={String(
                      image?.id ?? index
                    )}
                    className="relative overflow-hidden rounded-lg border border-ld"
                  >
                    {url ? (
                      <img
                        src={url}
                        alt=""
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-square bg-lightgray" />
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setImages((current) =>
                          current.filter(
                            (_, imageIndex) =>
                              imageIndex !==
                              index
                          )
                        )
                      }
                      className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white"
                    >
                      Remove
                    </button>

                    {index === 0 && (
                      <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                        Featured
                      </span>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </CardBox>

    <div className="space-y-5">
  <CardBox>
    <div className="mb-5 flex items-center gap-2 text-sm text-darklink">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lightsuccess">
        <span className="h-2 w-2 rounded-full bg-success" />
      </span>

      <span>
  {isEnded
    ? "Campaign has ended"
    : isPaused
      ? "Campaign is paused"
      : isHidden
        ? "Campaign is hidden"
        : "Actively receiving donations"}
</span>
    </div>

    <div className="mb-2 font-medium">
      Take an Action
    </div>

    <select
      value={selectedAction}
      onChange={(event) =>
        setSelectedAction(event.target.value)
      }
      disabled={actionBusy}
      className="w-full rounded-md border border-ld bg-transparent px-3 py-3 outline-none focus:border-primary disabled:opacity-60"
    >
      <option value="">
        Select an Action
      </option>

      {isPaused ? (
  <option value="resume">
    Resume Campaign
  </option>
) : (
  <option value="pause">
    Pause Campaign
  </option>
)}
     {!isEnded && (
  <option value="ended">
    End Campaign
  </option>
)}

{isHidden ? (
  <option value="visible">
    Show Campaign
  </option>
) : (
  <option value="hidden">
    Hide Campaign
  </option>
)}

      <option value="delete">
        Delete Campaign
      </option>
    </select>

    <Button
      type="button"
      className="mt-4 w-full"
      disabled={!selectedAction || actionBusy}
      onClick={() => void applyCampaignAction()}
    >
      {actionBusy ? "Updating…" : "Update"}
    </Button>
  </CardBox>

  <CardBox>
    <div>
      <div className="mb-2 font-medium">
        Video
      </div>

          <div className="text-xs text-darklink">
            Upload a campaign video or add
            a video/YouTube URL.
          </div>

          {video?.url && (
            <video
              controls
              src={video.url}
              className="mt-3 aspect-video w-full rounded-lg bg-black"
            />
          )}

          <label className="mt-3 block cursor-pointer rounded-md border border-ld px-3 py-2.5 text-center text-sm font-medium hover:bg-lightgray">
            {uploadingVideo
              ? "Uploading video…"
              : video
                ? "Replace video"
                : "Upload video"}

            <input
              type="file"
              accept="video/*"
              className="hidden"
              disabled={uploadingVideo}
              onChange={(event) =>
                void uploadMedia(
                  event.target.files,
                  "video"
                )
              }
            />
          </label>

          {video && (
            <button
              type="button"
              onClick={() =>
                setVideo(null)
              }
              className="mt-2 text-xs font-medium text-error"
            >
              Remove uploaded video
            </button>
          )}

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-ld" />
            <span className="text-xs text-darklink">
              OR
            </span>
            <div className="h-px flex-1 bg-ld" />
          </div>

          <Field
            label="Add from URL"
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(value: string) => {
              setVideoUrl(value);

              if (value.trim()) {
                setVideo(null);
              }
            }}
          />
        </div>

        <div className="my-5 border-t border-ld" />

        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block font-medium">
              Feature this campaign
            </span>

            <span className="text-xs text-darklink">
              Appears prominently on lists
              & pages.
            </span>
          </span>

          <input
            type="checkbox"
            checked={
              form.is_featured === "true"
            }
            onChange={(event) =>
              set(
                "is_featured",
                String(
                  event.target.checked
                )
              )
            }
            className="h-5 w-5"
          />
        </label>

        <div className="mt-5">
          <SelectField
            label="Category"
            value={form.category}
            onChange={(value: string) => {
              set("category", value);
              set("sub_category", "");
            }}
            error={fieldErrors.category}
          >
            <option value="">
              Select category
            </option>

            {parents.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-4">
          <SelectField
            label="Sub-Category"
            value={form.sub_category}
            onChange={(value: string) =>
              set(
                "sub_category",
                value
              )
            }
            disabled={
              !form.category ||
              !children.length
            }
          >
            <option value="">
              No sub-category
            </option>

            {children.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field
            label="Launch Date"
            type="date"
            value={form.start_date}
            onChange={(value: string) =>
              set(
                "start_date",
                value
              )
            }
          />

          <Field
            label="End Date"
            type="date"
            value={form.end_date}
            onChange={(value: string) =>
              set(
                "end_date",
                value
              )
            }
            error={fieldErrors.end_date}
          />
        </div>

        <div className="mt-4">
          <SelectField
            label="Location"
            value={form.location}
            onChange={(value: string) =>
              set("location", value)
            }
            error={fieldErrors.location}
          >
            <option value="">
              Select location
            </option>

            {locations.map((location) => (
              <option
                key={location.value}
                value={location.value}
              >
                {location.label}
              </option>
            ))}
          </SelectField>
        </div>

        

        <div className="mt-5 border-t border-ld pt-5">
          <div className="mb-2 text-sm font-medium">
            Fundraiser
          </div>

          {fundraiser ? (
            <div className="flex items-center gap-3 rounded-lg border border-ld p-3">
              {fundraiser.image ? (
                <img
                  src={fundraiser.image}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lightgray">
                  <Icon icon="solar:user-circle-linear" />
                </div>
              )}

              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {fundraiser.name ||
                    `Fundraiser #${fundraiser.id}`}
                </div>

                {fundraiser.email && (
                  <div className="truncate text-xs text-darklink">
                    {fundraiser.email}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-ld p-3 text-sm text-darklink">
              Assigned to the campaign
              fundraiser.
            </div>
          )}

          <div className="mt-2 text-xs text-darklink">
            Fundraisers cannot reassign
            campaign ownership.
          </div>
        </div>

        <div className="mt-5 border-t border-ld pt-5">
          <div className="mb-2 text-sm font-medium">
            Collaborators
          </div>

          <input
            value={collaboratorSearch}
            onChange={(event) =>
              setCollaboratorSearch(
                event.target.value
              )
            }
            placeholder="Search collaborators..."
            className="w-full rounded-md border border-ld bg-transparent px-3 py-2.5 outline-none focus:border-primary"
          />

          {collaboratorSearch.trim() && (
            <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border border-ld">
              {collaboratorOptions
                .filter((person) => {
                  const query =
                    collaboratorSearch
                      .trim()
                      .toLowerCase();

                  if (!query) return false;

                  if (
                    selectedCollaborators.some(
                      (selected) =>
                        selected.id ===
                        person.id
                    )
                  ) {
                    return false;
                  }

                  return `${person.name} ${person.email}`
                    .toLowerCase()
                    .includes(query);
                })
                .slice(0, 10)
                .map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => {
                      setSelectedCollaborators(
                        (current) => [
                          ...current,
                          person,
                        ]
                      );

                      setCollaboratorSearch(
                        ""
                      );
                    }}
                    className="flex w-full items-center gap-3 border-b border-ld px-3 py-3 text-left last:border-b-0 hover:bg-lightgray"
                  >
                    <Icon icon="solar:user-plus-linear" />

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {person.name ||
                          `User #${person.id}`}
                      </span>

                      {person.email && (
                        <span className="block truncate text-xs text-darklink">
                          {person.email}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
            </div>
          )}

          {selectedCollaborators.length >
            0 && (
            <div className="mt-3 space-y-2">
              {selectedCollaborators.map(
                (person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 rounded-lg border border-ld p-3"
                  >
                    <Icon icon="solar:user-check-linear" />

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {person.name ||
                          `User #${person.id}`}
                      </div>

                      {person.email && (
                        <div className="truncate text-xs text-darklink">
                          {person.email}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="text-xs font-medium text-error"
                      onClick={() =>
                        setSelectedCollaborators(
                          (current) =>
                            current.filter(
                              (item) =>
                                item.id !==
                                person.id
                            )
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={
                form.show_collaborator_list ===
                "true"
              }
              onChange={(event) =>
                set(
                  "show_collaborator_list",
                  String(
                    event.target.checked
                  )
                )
              }
            />

            Show collaborator list on
            campaign
          </label>
        </div>
      </CardBox>
    </div>
  </div>
)}

      {section==="goal"&&<CardBox className="mx-auto max-w-3xl"><h3 className="mb-5 text-xl font-semibold">Goal</h3><div className="rounded-xl border border-ld p-5"><div className="mb-5 flex items-center justify-between"><span className="font-medium">Campaign Goal</span><span className="h-6 w-11 rounded-full bg-success p-1"><span className="ml-auto block h-4 w-4 rounded-full bg-white"/></span></div><div className="grid gap-4 sm:grid-cols-2"><SelectField label="Goal Type" value="raised-amount" onChange={()=>{}}><option value="raised-amount">Raised Amount</option></SelectField><Field label="Target Goal" type="number" min="1" step="0.01" value={form.goal_amount} onChange={(v:string)=>set("goal_amount",v)} error={fieldErrors.goal_amount}/></div><div className="mt-5"><div className="mb-2 font-medium">When donation is reached the goal</div><div className="flex flex-wrap gap-6"><label><input type="radio" checked={form.reaching_action==="close"} onChange={()=>set("reaching_action","close")}/> Auto close campaign</label><label><input type="radio" checked={form.reaching_action==="continue"} onChange={()=>set("reaching_action","continue")}/> Keep receiving donations</label></div></div></div>
      <div className="mt-5 rounded-xl border border-ld p-5"><h4 className="mb-4 font-medium">Suggested Options</h4><div className="mb-4 flex gap-6"><label><input type="radio" checked={form.suggested_option_type==="amount-only"} onChange={()=>set("suggested_option_type","amount-only")}/> Amount Only</label><label><input type="radio" checked={form.suggested_option_type==="amount-description"} onChange={()=>set("suggested_option_type","amount-description")}/> Amount & Description</label></div><div className="space-y-3">{suggestedValues.map((value,index)=><div key={index} className="flex items-center gap-3 rounded-xl border border-ld px-5 py-4"><Icon icon="solar:hamburger-menu-linear"/><span className="font-semibold">${Number(value||0).toFixed(2)}</span><button type="button" className="ml-auto text-xs text-error" onClick={()=>set("suggested",suggestedValues.filter((_,i)=>i!==index).join(","))}>Remove</button></div>)}</div><Button type="button" variant="outline" className="mt-3 w-full" onClick={()=>set("suggested",[...suggestedValues,"10"].join(","))}><Icon icon="solar:add-circle-linear"/> Add Amount</Button>{fieldErrors.suggested&&<div className="mt-1 text-xs text-error">{fieldErrors.suggested}</div>}<label className="mt-5 flex items-center gap-2"><input type="checkbox" checked={form.allow_custom_donation==="true"} onChange={e=>set("allow_custom_donation",String(e.target.checked))}/> Allow custom donation amount</label><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Min Amount" type="number" min="1" step="0.01" value={form.min_donation_amount} onChange={(v:string)=>set("min_donation_amount",v)} error={fieldErrors.min_donation_amount}/><Field label="Max Amount" type="number" min="0.1" step="0.01" value={form.max_donation_amount} onChange={(v:string)=>set("max_donation_amount",v)} error={fieldErrors.max_donation_amount}/></div></div></CardBox>}

      {section==="options"&&<div className="mx-auto max-w-3xl space-y-5"><CardBox><h3 className="mb-5 text-lg font-semibold">Donation Confirmation Message</h3><Field label="Title" value={form.confirmation_title} onChange={(v:string)=>set("confirmation_title",v)}/><div className="mt-4"><TextArea label="Description" value={form.confirmation_description} onChange={(v:string)=>set("confirmation_description",v)} rows={5}/></div></CardBox><CardBox><h3 className="mb-5 text-lg font-semibold">Frequently Asked Questions</h3><div className="space-y-3">{faqs.map((faq,index)=><div key={index} className="rounded-xl border border-ld p-4"><Field label="Question" value={faq.question} onChange={(v:string)=>setFaqs(x=>x.map((f,i)=>i===index?{...f,question:v}:f))}/><div className="mt-3"><TextArea label="Answer" value={faq.answer} onChange={(v:string)=>setFaqs(x=>x.map((f,i)=>i===index?{...f,answer:v}:f))} rows={3}/></div><button type="button" className="mt-2 text-sm text-error" onClick={()=>setFaqs(x=>x.filter((_,i)=>i!==index))}>Remove FAQ</button></div>)}</div><Button type="button" variant="outline" className="mt-4 w-full" onClick={()=>setFaqs(x=>[...x,{question:"",answer:""}])}><Icon icon="solar:add-circle-linear"/> Add FAQ</Button></CardBox></div>}
    </div>
  </form>;
}

function Field({ label, value, onChange, error, hint, className = "", type = "text", ...inputProps }: any) {
  return <label className={className}>
    <span className="mb-1.5 block text-sm font-medium text-dark">{label}</span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-md border bg-transparent px-3 py-2.5 outline-none focus:border-primary ${error ? "border-error" : "border-ld"}`} {...inputProps} />
    {error ? <span className="mt-1 block text-xs text-error">{error}</span> : hint ? <span className="mt-1 block text-xs text-darklink">{hint}</span> : null}
  </label>;
}

function TextArea({ label, value, onChange, error, className = "", rows = 5 }: any) {
  return <label className={className}>
    <span className="mb-1.5 block text-sm font-medium text-dark">{label}</span>
    <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-md border bg-transparent px-3 py-2.5 outline-none focus:border-primary ${error ? "border-error" : "border-ld"}`} />
    {error && <span className="mt-1 block text-xs text-error">{error}</span>}
  </label>;
}

function SelectField({ label, value, onChange, error, className = "", children, disabled = false }: any) {
  return <label className={className}>
    <span className="mb-1.5 block text-sm font-medium text-dark">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className={`w-full rounded-md border bg-transparent px-3 py-2.5 outline-none focus:border-primary disabled:opacity-60 ${error ? "border-error" : "border-ld"}`}>{children}</select>
    {error && <span className="mt-1 block text-xs text-error">{error}</span>}
  </label>;
}
