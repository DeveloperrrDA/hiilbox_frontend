"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import ThemeShell from "@/components/theme/ThemeShell";
import { authFetch } from "@/lib/client-auth-fetch";

type Uploaded = {
  id: string;
  url: string;
  filename: string;
  mime?: string;
  type?: string;
};

type SuggestedOption = {
  amount: string;
  description: string;
  is_default: boolean;
};

const input =
  "mt-2 w-full rounded-xl border border-[#e0e6eb] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#01A14B] focus:ring-4 focus:ring-[#01A14B]/10";

const label = "block text-sm font-bold text-[#111c2d]";

const choiceButton = (active: boolean) =>
  `rounded-xl border px-4 py-3 text-sm font-bold transition ${
    active
      ? "border-[#01A14B] bg-[#e9f8ef] text-[#017f3b]"
      : "border-[#e0e6eb] bg-white text-[#5a6a85] hover:border-[#01A14B]/50"
  }`;

export default function CreateCampaignPage() {
  const [step, setStep] = useState(1);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{
    id: number;
    status: string;
  } | null>(null);
  const [images, setImages] = useState<Uploaded[]>([]);
  const [video, setVideo] = useState<Uploaded | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    story: "",
    goal_type: "raised-amount",
    goal_amount: "",
    reaching_action: "close",
    suggested_option_type: "amount-only",
    confirmation_title: "",
    confirmation_description: "",
  });

  const [suggestedOptions, setSuggestedOptions] = useState<SuggestedOption[]>([
    { amount: "10", description: "", is_default: true },
    { amount: "25", description: "", is_default: false },
    { amount: "50", description: "", is_default: false },
    { amount: "100", description: "", is_default: false },
  ]);

  const set = (key: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  useEffect(() => {
    setToken(localStorage.getItem("access_token") || "");
  }, []);

  async function uploadMedia(
    files: FileList | null,
    kind: "images" | "video"
  ) {
    if (!files?.length || !token) return;

    if (kind === "images") {
      setUploadingImages(true);
    } else {
      setUploadingVideo(true);
    }

    setError("");

    try {
      const formData = new FormData();
      const selectedFiles =
        kind === "video" ? [files[0]] : Array.from(files);

      selectedFiles.forEach((file) => {
        formData.append("images[]", file);
      });

      const response = await authFetch("/api/campaigns/media", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            (kind === "video" ? "Video upload failed." : "Image upload failed.")
        );
      }

      const uploaded = Array.isArray(data?.images) ? data.images : [];

      if (uploaded.length === 0) {
        throw new Error(
          kind === "video" ? "Video upload failed." : "Image upload failed."
        );
      }

      if (kind === "video") {
        setVideo(uploaded[0]);
      } else {
        setImages((current) => [...current, ...uploaded]);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
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

  function updateSuggestedOption(
    index: number,
    key: "amount" | "description",
    value: string
  ) {
    setSuggestedOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index
          ? { ...option, [key]: value }
          : option
      )
    );
  }

  function setDefaultSuggestedOption(index: number) {
    setSuggestedOptions((current) =>
      current.map((option, optionIndex) => ({
        ...option,
        is_default: optionIndex === index,
      }))
    );
  }

  function addSuggestedOption() {
    setSuggestedOptions((current) => [
      ...current,
      {
        amount: "",
        description: "",
        is_default: current.length === 0,
      },
    ]);
  }

  function removeSuggestedOption(index: number) {
    setSuggestedOptions((current) => {
      const next = current.filter((_, optionIndex) => optionIndex !== index);

      if (next.length > 0 && !next.some((option) => option.is_default)) {
        next[0] = { ...next[0], is_default: true };
      }

      return next;
    });
  }

  function validate(currentStep: number) {
    if (
      currentStep === 1 &&
      (!form.title.trim() || !form.description.trim() || !form.story.trim())
    ) {
      setError("Enter a campaign title, description, and story before continuing.");
      return false;
    }

    if (currentStep === 2) {
      const goalAmount = Number(form.goal_amount);

      if (!Number.isFinite(goalAmount) || goalAmount < 1) {
        setError("Enter a target goal of at least 1.");
        return false;
      }

      if (
        form.goal_type !== "raised-amount" &&
        !Number.isInteger(goalAmount)
      ) {
        setError("Donation number and donor number goals must be whole numbers.");
        return false;
      }

      const validSuggestions = suggestedOptions.filter(
        (option) => option.amount.trim() !== ""
      );

      if (validSuggestions.length === 0) {
        setError("Add at least one suggested donation amount.");
        return false;
      }

      for (const option of validSuggestions) {
        const amount = Number(option.amount);

        if (!Number.isFinite(amount) || amount < 0.1) {
          setError("Suggested donation amounts must be at least $0.10.");
          return false;
        }

        if (amount > goalAmount) {
          setError("Suggested donation amounts cannot be higher than the campaign target goal.");
          return false;
        }

        if (
          form.suggested_option_type === "amount-description" &&
          !option.description.trim()
        ) {
          setError("Add a description for each suggested amount, or choose Amount only.");
          return false;
        }
      }
    }

    if (
      currentStep === 3 &&
      (!form.confirmation_title.trim() || !form.confirmation_description.trim())
    ) {
      setError("Enter the donation confirmation title and description.");
      return false;
    }

    setError("");
    return true;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (!token) {
      setError("Please sign in with a fundraiser account first.");
      return;
    }

    if (!validate(3)) return;

    setBusy(true);
    setError("");

    try {
      const goalAmount = Number(form.goal_amount);
      const suggested = suggestedOptions
        .filter((option) => option.amount.trim() !== "")
        .map((option) => ({
          amount: Number(option.amount),
          is_default: option.is_default,
          description:
            form.suggested_option_type === "amount-description"
              ? option.description.trim()
              : "",
        }));

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        story: form.story.trim(),
        images: images.map((image) => Number(image.id)),
        ...(video
          ? {
              video: {
                id: Number(video.id),
              },
            }
          : {}),
        has_goal: true,
        goal_type: form.goal_type,
        goal_amount: goalAmount,
        reaching_action: form.reaching_action,
        allow_custom_donation: true,
        min_donation_amount: 0.1,
        max_donation_amount: goalAmount,
        suggested_option_type: form.suggested_option_type,
        suggested_options: suggested,
        confirmation_title: form.confirmation_title.trim(),
        confirmation_description: form.confirmation_description.trim(),
        status: "pending",
        tags: [],
        collaborators: [],
        show_collaborator_list: false,
        is_featured: false,
      };

      const response = await authFetch("/api/campaigns/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.message ||
            Object.values(data?.data?.details || {})
              .flat()
              .join(" ") ||
            "Campaign creation failed."
        );
      }

      const campaignId = Number(data?.data?.id);

      if (!Number.isFinite(campaignId) || campaignId <= 0) {
        throw new Error("Campaign creation did not return a valid campaign ID.");
      }

      setCreated({
        id: campaignId,
        status: String(data?.data?.status || "pending"),
      });
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

  if (!token) {
    return (
      <ThemeShell>
        <main className="container-1218 py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-[#e0e6eb] bg-[#f8fafd] p-8 text-center">
            <h1 className="text-3xl font-extrabold">Create a campaign</h1>
            <p className="mt-3 text-[#5a6a85]">
              Sign in with your fundraiser account before starting a campaign.
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

  if (created) {
    return (
      <ThemeShell>
        <main className="container-1218 py-16">
          <div className="mx-auto max-w-2xl rounded-3xl border border-[#d9eee2] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e9f8ef] text-2xl text-[#01A14B]">
              ✓
            </div>
            <h1 className="mt-5 text-3xl font-extrabold">Campaign submitted</h1>
            <p className="mt-3 text-[#5a6a85]">
              Campaign #{created.id} has been saved with status <b>{created.status}</b> and is ready for review.
            </p>
            <Link
              href={`/campaign/${created.id}`}
              className="mt-6 inline-flex rounded-xl bg-[#01A14B] px-6 py-3 font-bold text-white"
            >
              View campaign
            </Link>
          </div>
        </main>
      </ThemeShell>
    );
  }

  return (
    <ThemeShell>
      <main className="bg-[#f8fafd] py-10">
        <div className="container-1218">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wider text-[#01A14B]">
              Fundraise on Hiilbox
            </p>
            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Create your campaign
            </h1>
            <p className="mt-2 text-[#5a6a85]">
              Tell your story, set your campaign goal and donation options, then customize the donor confirmation message.
            </p>
          </div>

          <div className="mb-7 grid grid-cols-3 gap-2">
            {["Basics", "Goal", "Donation confirmation"].map((item, index) => (
              <div
                key={item}
                className={`rounded-xl px-3 py-3 text-center text-xs font-bold sm:text-sm ${
                  step >= index + 1
                    ? "bg-[#01A14B] text-white"
                    : "bg-white text-[#5a6a85]"
                }`}
              >
                {index + 1}. {item}
              </div>
            ))}
          </div>

          <form
            onSubmit={submit}
            className="rounded-3xl border border-[#e0e6eb] bg-white p-6 shadow-sm sm:p-8"
          >
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-7">
                <div>
                  <label className={label}>Campaign title *</label>
                  <input
                    className={input}
                    value={form.title}
                    onChange={(event) => set("title", event.target.value)}
                    placeholder="Campaign title"
                  />
                </div>

                <div>
                  <label className={label}>Description *</label>
                  <textarea
                    className={input}
                    rows={4}
                    value={form.description}
                    onChange={(event) => set("description", event.target.value)}
                    placeholder="Give donors a short summary of the campaign."
                  />
                </div>

                <div>
                  <label className={label}>Story *</label>
                  <textarea
                    className={input}
                    rows={10}
                    value={form.story}
                    onChange={(event) => set("story", event.target.value)}
                    placeholder="Tell the full story behind your campaign."
                  />
                </div>

                <div className="grid gap-6 border-t border-[#e0e6eb] pt-7 lg:grid-cols-2">
                  <div>
                    <label className={label}>Images</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className={input}
                      onChange={(event) => uploadMedia(event.target.files, "images")}
                    />
                    <p className="mt-2 text-xs text-[#5a6a85]">
                      {uploadingImages
                        ? "Uploading images..."
                        : images.length > 0
                          ? `${images.length} image(s) uploaded. The first image is the campaign cover.`
                          : "Upload one or more campaign images."}
                    </p>

                    {images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {images.map((image) => (
                          <div
                            key={image.id}
                            className="relative overflow-hidden rounded-xl border border-[#e0e6eb]"
                          >
                            <img
                              src={image.url}
                              alt={image.filename}
                              className="aspect-video h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setImages((current) =>
                                  current.filter((item) => item.id !== image.id)
                                )
                              }
                              className="absolute right-2 top-2 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold shadow"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={label}>Video</label>
                    <input
                      type="file"
                      accept="video/*"
                      className={input}
                      onChange={(event) => uploadMedia(event.target.files, "video")}
                    />
                    <p className="mt-2 text-xs text-[#5a6a85]">
                      {uploadingVideo
                        ? "Uploading video..."
                        : video
                          ? `${video.filename} uploaded.`
                          : "Upload one campaign video."}
                    </p>

                    {video && (
                      <div className="mt-4 rounded-xl border border-[#e0e6eb] p-4">
                        <video controls className="aspect-video w-full rounded-lg bg-black" src={video.url} />
                        <button
                          type="button"
                          onClick={() => setVideo(null)}
                          className="mt-3 rounded-lg border border-[#e0e6eb] px-3 py-2 text-xs font-bold"
                        >
                          Remove video
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <section className="rounded-2xl border border-[#e0e6eb] p-5 sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#111c2d]">Campaign goal</h2>
                  <p className="mt-1 text-sm text-[#5a6a85]">
                    Choose what determines when this campaign reaches its goal.
                  </p>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={label}>Goal type *</label>
                      <select
                        className={input}
                        value={form.goal_type}
                        onChange={(event) => set("goal_type", event.target.value)}
                      >
                        <option value="raised-amount">Raised amount</option>
                        <option value="number-of-contributions">Donations number</option>
                        <option value="number-of-contributors">Donors number</option>
                      </select>
                    </div>

                    <div>
                      <label className={label}>
                        {form.goal_type === "raised-amount"
                          ? "Target goal (USD) *"
                          : form.goal_type === "number-of-contributions"
                            ? "Target donation count *"
                            : "Target donor count *"}
                      </label>
                      <input
                        type="number"
                        min="1"
                        step={form.goal_type === "raised-amount" ? "0.01" : "1"}
                        className={input}
                        value={form.goal_amount}
                        onChange={(event) => set("goal_amount", event.target.value)}
                        placeholder={form.goal_type === "raised-amount" ? "5000" : "100"}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className={label}>When donation reaches the goal</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        className={choiceButton(form.reaching_action === "close")}
                        onClick={() => set("reaching_action", "close")}
                      >
                        Auto close campaign
                      </button>
                      <button
                        type="button"
                        className={choiceButton(form.reaching_action === "continue")}
                        onClick={() => set("reaching_action", "continue")}
                      >
                        Keep receiving donations
                      </button>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#e0e6eb] p-5 sm:p-6">
                  <h2 className="text-xl font-extrabold text-[#111c2d]">Suggested options</h2>
                  <p className="mt-1 text-sm text-[#5a6a85]">
                    Choose the suggested donation amounts donors will see on the donation page.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      className={choiceButton(form.suggested_option_type === "amount-only")}
                      onClick={() => set("suggested_option_type", "amount-only")}
                    >
                      Amount only
                    </button>
                    <button
                      type="button"
                      className={choiceButton(form.suggested_option_type === "amount-description")}
                      onClick={() => set("suggested_option_type", "amount-description")}
                    >
                      Amount and description
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    {suggestedOptions.map((option, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-[#e0e6eb] bg-[#f8fafd] p-4"
                      >
                        <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
                          <div>
                            <label className={label}>Suggested amount (USD)</label>
                            <input
                              type="number"
                              min="0.1"
                              step="0.01"
                              className={input}
                              value={option.amount}
                              onChange={(event) =>
                                updateSuggestedOption(index, "amount", event.target.value)
                              }
                            />
                          </div>

                          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#e0e6eb] bg-white px-4 py-3 text-sm font-bold">
                            <input
                              type="radio"
                              name="default-suggested-option"
                              checked={option.is_default}
                              onChange={() => setDefaultSuggestedOption(index)}
                            />
                            Default
                          </label>

                          <button
                            type="button"
                            onClick={() => removeSuggestedOption(index)}
                            disabled={suggestedOptions.length === 1}
                            className="rounded-xl border border-[#e0e6eb] bg-white px-4 py-3 text-sm font-bold disabled:opacity-40"
                          >
                            Remove
                          </button>
                        </div>

                        {form.suggested_option_type === "amount-description" && (
                          <div className="mt-4">
                            <label className={label}>Description</label>
                            <input
                              className={input}
                              value={option.description}
                              onChange={(event) =>
                                updateSuggestedOption(index, "description", event.target.value)
                              }
                              placeholder="Explain what this donation amount can help provide."
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addSuggestedOption}
                    className="mt-4 rounded-xl border border-[#01A14B] px-4 py-3 text-sm font-bold text-[#017f3b]"
                  >
                    + Add suggested amount
                  </button>

                  <div className="mt-6 grid gap-4 rounded-xl bg-[#f8fafd] p-4 sm:grid-cols-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wide text-[#5a6a85]">
                        Minimum donation
                      </span>
                      <p className="mt-1 text-lg font-extrabold text-[#111c2d]">$0.10</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wide text-[#5a6a85]">
                        Maximum donation
                      </span>
                      <p className="mt-1 text-lg font-extrabold text-[#111c2d]">
                        {form.goal_amount && Number(form.goal_amount) > 0
                          ? `$${Number(form.goal_amount).toLocaleString()}`
                          : "Set by target goal"}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {step === 3 && (
              <section className="rounded-2xl border border-[#e0e6eb] p-5 sm:p-6">
                <h2 className="text-xl font-extrabold text-[#111c2d]">Donation confirmation message</h2>
                <p className="mt-1 text-sm text-[#5a6a85]">
                  This message is shown to donors after a successful donation.
                </p>

                <div className="mt-6 space-y-6">
                  <div>
                    <label className={label}>Confirmation title *</label>
                    <input
                      className={input}
                      value={form.confirmation_title}
                      onChange={(event) => set("confirmation_title", event.target.value)}
                      placeholder="Thank you for your donation!"
                    />
                  </div>

                  <div>
                    <label className={label}>Description *</label>
                    <textarea
                      className={input}
                      rows={6}
                      value={form.confirmation_description}
                      onChange={(event) => set("confirmation_description", event.target.value)}
                      placeholder="Write the message donors should see after their donation is confirmed."
                    />
                  </div>
                </div>
              </section>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-[#e0e6eb] pt-6">
              <button
                type="button"
                disabled={step === 1 || busy}
                onClick={() => {
                  setError("");
                  setStep((current) => Math.max(1, current - 1));
                }}
                className="rounded-xl border border-[#e0e6eb] px-5 py-3 font-bold disabled:opacity-40"
              >
                Back
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => validate(step) && setStep((current) => current + 1)}
                  className="rounded-xl bg-[#01A14B] px-6 py-3 font-bold text-white"
                >
                  Continue
                </button>
              ) : (
                <button
                  disabled={busy || uploadingImages || uploadingVideo}
                  className="rounded-xl bg-[#01A14B] px-6 py-3 font-bold text-white disabled:opacity-50"
                >
                  {busy ? "Submitting..." : "Submit campaign"}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </ThemeShell>
  );
}
