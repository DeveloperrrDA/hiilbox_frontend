"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  getCheckoutCurrencies,
  getCheckoutGateways,
  processCheckout,
  type CheckoutCurrency,
  type CheckoutGateway,
} from "@/lib/donations";
import ThemeShell from "@/components/theme/ThemeShell";
import DonationReceiptDialog, { type DonationReceipt } from "@/components/DonationReceiptDialog";
import { Button } from "@/components/ui/button";

import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Description, Field, Input, Label } from '@headlessui/react'

interface CampaignData {
  id: number;
  title: string;
  imageUrl: string;
  goal: number;
  raised_amount: number;
  suggestedAmounts: number[];
  recommendedAmount: number | null;
}

// Read fundraiser-configured suggestions from the campaign API, not fixed checkout values.
function parseSuggestedAmounts(value: unknown): number[] {
  let input: unknown = value;
  if (typeof input === "string") {
    const text = input;
    try {
      input = JSON.parse(text) as unknown;
    } catch {
      input = text.split(/[,;|]/);
    }
  }
  if (input && typeof input === "object" && !Array.isArray(input)) {
    const obj = input as Record<string, unknown>;
    input = obj.amounts ?? obj.values ?? obj.options ?? Object.values(obj);
  }
  const items: unknown[] = Array.isArray(input)
    ? (input as unknown[])
    : input == null ? [] : [input];
  const amounts: number[] = items.map((item: unknown): number => {
    const raw: unknown = item && typeof item === "object"
      ? (item as Record<string, unknown>).amount ?? (item as Record<string, unknown>).value
      : item;
    const n = Number(typeof raw === "string" ? raw.replace(/[^\d.]/g, "") : raw);
    return Number.isFinite(n) && n > 0 ? n : NaN;
  }).filter((n: number): boolean => Number.isFinite(n));
  return [...new Set<number>(amounts)];
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [campaign, setCampaign] =
    useState<CampaignData | null>(null);

  // Keep checkout completely empty initially.
  const [amount, setAmount] = useState("");
  const [manualTip, setManualTip] = useState<string | null>(null);
  const [showSuggestedAmounts, setShowSuggestedAmounts] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [currencies, setCurrencies] = useState<CheckoutCurrency[]>([
    { code: "USD", name: "US Dollar", rate: 1 },
    { code: "SOS", name: "Somaliland Shilling", rate: 1 },
  ]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [walletNumber, setWalletNumber] = useState("");


  // IMPORTANT: this must be inside the component.
  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [paymentGroup, setPaymentGroup] = useState<
    "somali-wallets" | "ethiopia-wallets" | "east-africa-wallets" | "other" | ""
  >("");

  const [isAnonymous, setIsAnonymous] =
    useState(false);

 const [gateways, setGateways] =
  useState<CheckoutGateway[]>([]);

const [platformRates, setPlatformRates] = useState<
  Record<string, { gateway: string; platform: string }>
>({});

const [loadingGateways, setLoadingGateways] =
  useState(true);
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  // --------------------------------------------------
  // LOAD CAMPAIGN
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;
    const campaignId = Number(searchParams.get("campaign"));
    const campaignTitle = searchParams.get("title") || "Campaign";
    const campaignGoal = Number(searchParams.get("goal") || 10);
    const campaignRaisedAmount = Number(searchParams.get("raised_amount") || 5);

    if (!campaignId) {
      router.replace("/donate");
      return;
    }

    async function loadCampaign() {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const payload = await response.json().catch(() => null);
        const raw = payload?.data;
        if (!response.ok || !raw) throw new Error("Campaign not found.");

        const imageCandidates = [
          raw?.image_url,
          raw?.featured_image_url,
          raw?.featured_image,
          raw?.thumbnail_url,
          raw?.thumbnail,
          raw?.image?.url,
          raw?.image?.src,
          raw?.images?.[0]?.url,
          raw?.images?.[0]?.sizes?.medium?.url,
          raw?.images?.[0]?.sizes?.woocommerce_thumbnail?.url,
        ];
        const rawImageUrl = String(imageCandidates.find((value) => typeof value === "string" && value.trim()) || "").trim();
        const wpBase = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.hiilbox.com").replace(/\/$/, "");
        const imageUrl = rawImageUrl && !/^https?:\/\//i.test(rawImageUrl)
          ? `${wpBase}/${rawImageUrl.replace(/^\//, "")}`
          : rawImageUrl;

        const fundraiserSuggestedAmounts = parseSuggestedAmounts(
          raw?.suggested_amounts ?? raw?.suggested_donation_amounts ??
          raw?.donation_suggestions ?? raw?.suggested_donations ??
          raw?.meta?.suggested_amounts ?? raw?.meta?.suggested_donation_amounts ??
          raw?.suggested_amount ?? raw?.meta?.suggested_amount
        );
        const suggestedAmounts = fundraiserSuggestedAmounts.length ? fundraiserSuggestedAmounts : [300, 200, 100, 50, 25, 10];
        const recommendation = Number(raw?.recommended_amount ?? raw?.suggested_amount ?? raw?.meta?.recommended_amount);
        const recommendedAmount = Number.isFinite(recommendation) && suggestedAmounts.includes(recommendation)
          ? recommendation : fundraiserSuggestedAmounts.length === 0 ? 50 : suggestedAmounts.length === 1 ? suggestedAmounts[0] : null;

        if (!cancelled) {
          setCampaign({
            id: campaignId,
            title: String(raw?.title || campaignTitle),
            goal: Number(raw?.goal_amount || campaignGoal),
            raised_amount: Number(raw?.fund_raised || campaignRaisedAmount),
            imageUrl,
            suggestedAmounts,
            recommendedAmount,
          });
        }
      } catch {
        if (!cancelled) {
          setCampaign({ id: campaignId, title: campaignTitle, goal: campaignGoal, raised_amount: campaignRaisedAmount, imageUrl: "", suggestedAmounts: [300, 200, 100, 50, 25, 10], recommendedAmount: 50 });
        }
      }
    }

    loadCampaign();
    return () => { cancelled = true; };
  }, [searchParams, router]);

  // --------------------------------------------------
  // LOAD CURRENCIES
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    getCheckoutCurrencies()
      .then((available) => {
        if (cancelled || !available.length) return;
        // Preserve the working SOS gateway/rate; only its customer-facing label is SLSH.
        setCurrencies(available);
        setCurrency((current) =>
          available.some((item) => item.code === current) ? current : "USD"
        );
      })
      .catch(() => {
        // USD remains available as the safe fallback. The order API still
        // validates the selected currency against the backend before payment.
      });

    return () => {
      cancelled = true;
    };
  }, []);
useEffect(() => {
  let cancelled = false;

  async function loadPlatformRates() {
    try {
      const response = await fetch(
        "/api/checkout/platform-rates",
        {
          headers: { Accept: "application/json" },
          cache: "no-store",
        }
      );

      const payload = await response.json();

      if (
        !cancelled &&
        response.ok &&
        payload?.success &&
        payload?.data
      ) {
        setPlatformRates(payload.data);
      }
    } catch {
      if (!cancelled) {
        setPlatformRates({});
      }
    }
  }

  loadPlatformRates();

  return () => {
    cancelled = true;
  };
}, []);
  // --------------------------------------------------
  // LOAD PAYMENT GATEWAYS
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadGateways() {
      try {
        setLoadingGateways(true);
        setError("");

        const available =
          await getCheckoutGateways();

        if (cancelled) {
          return;
        }

        setGateways(available);

        // Do not leave an invalid gateway selected.
        setPaymentMethod((current) => {
          if (
            current &&
            available.some(
              (gateway) =>
                gateway.id === current
            )
          ) {
            return current;
          }

          setPaymentGroup("");
          return "";
        });
      } catch (err) {
        if (!cancelled) {
          setGateways([]);
          setPaymentMethod("");

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load payment methods."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingGateways(false);
        }
      }
    }

    loadGateways();

    return () => {
      cancelled = true;
    };
  }, []);

  const gatewayById = (id: string) =>
    gateways.find((gateway) => gateway.id === id);

  const gatewayMatching = (patterns: RegExp[]) =>
    gateways.find((gateway) => {
      const haystack = `${gateway.id} ${gateway.title}`.toLowerCase();
      return patterns.some((pattern) => pattern.test(haystack));
    });

  const walletGatewayOptions = [
    {
      key: "zes",
      label: "ZAAD, EVC, SAHAL, CASHPLUS, JEEB",
      gateway: gatewayById("zes_pay"),
    },
    {
      key: "edahab",
      label: "eDahab",
      gateway: gatewayById("edahab_pay"),
    },
    {
      key: "premier",
      label: "Premier Wallet",
      gateway: gatewayById("premier_wallet_pay"),
    },
  ];

  // Resolve Somali mobile-money provider from the donor's phone prefix.
  const normalizedWalletNumber = walletNumber.replace(/\D/g, "");
  const localWalletNumber = normalizedWalletNumber.startsWith("252")
    ? `0${normalizedWalletNumber.slice(3)}`
    : normalizedWalletNumber.startsWith("0")
      ? normalizedWalletNumber
      : `0${normalizedWalletNumber}`;
  const mobilePrefix = localWalletNumber.slice(0, 3);
  const mobileProviders: Record<string, { name: string; gatewayId: string | null }> = {
    "061": { name: "EVC Plus", gatewayId: "zes_pay" },
    "077": { name: "EVC Plus", gatewayId: "zes_pay" },
    "062": { name: "eDahab", gatewayId: "edahab_pay" },
    "063": { name: "ZAAD", gatewayId: "zes_pay" },
    "064": { name: "Somlink", gatewayId: null },
    "065": { name: "eDahab", gatewayId: "edahab_pay" },
    "066": { name: "eDahab", gatewayId: "edahab_pay" },
    "067": { name: "Somtelco", gatewayId: null },
    "068": { name: "Jeeb", gatewayId: "zes_pay" },
    "069": { name: "NationLink (Unavailable)", gatewayId: null },
    "090": { name: "Sahal", gatewayId: "zes_pay" },
    "071": { name: "Amtel", gatewayId: null },
  };
  const detectedMobileProvider = mobileProviders[mobilePrefix] ?? null;
  const detectedMobileGateway = detectedMobileProvider?.gatewayId
    ? gatewayById(detectedMobileProvider.gatewayId)
    : null;

  useEffect(() => {
    if (paymentGroup !== "somali-wallets") return;
    setPaymentMethod(detectedMobileGateway?.id ?? "");
  }, [paymentGroup, mobilePrefix, gateways]);

  const ethiopiaGatewayOptions = [
    {
      key: "ebirr",
      label: "eBirr",
      gateway: gatewayMatching([/ebirr/, /e-birr/]),
    },
    {
      key: "coopay",
      label: "COOPay",
      gateway: gatewayMatching([/coopay/, /coop.?pay/]),
    },
    {
      key: "cbebirr",
      label: "CBE Birr",
      gateway: gatewayMatching([/cbe.?birr/, /cbebirr/]),
    },
  ];

  const eastAfricaGatewayOptions = [
    {
      key: "mpesa",
      label: "M-Pesa",
      gateway: gatewayMatching([/m-?pesa/, /mpesa/]),
    },
    {
      key: "mtn",
      label: "MTN",
      gateway: gatewayMatching([/mtn/]),
    },
  ];

  const cardGateway =
    gatewayMatching([/shalo/, /sifalo/]) ||
    gatewayById("card_pay") ||
    gatewayMatching([/card/, /visa/, /mastercard/, /credit/, /debit/]);

  const bankGateway =
    gatewayById("bacs") || gatewayById("cod") || gatewayMatching([/bank.?transfer/, /bacs/, /cash.?on.?delivery/, /cash/]);

  // --------------------------------------------------
  // AMOUNT / TIP
  // --------------------------------------------------

  const donationAmount =
    amount === ""
      ? 0
      : Number(amount);

  // Default to 10% of the donation until the donor edits the tip.
  const tipAmount = manualTip === null
    ? Math.round(Math.max(0, donationAmount || 0) * 10) / 100
    : Math.max(0, Number(manualTip) || 0);

 const selectedRates =
  paymentMethod && platformRates[paymentMethod]
    ? platformRates[paymentMethod]
    : null;

const gatewayRate = Number(selectedRates?.gateway ?? 0);
const platformRate = Number(selectedRates?.platform ?? 0);

// Processing fees are deducted by the server from the amount paid,
// not added to the donor's checkout total.
const total = donationAmount + tipAmount;

  const selectedCurrency =
    currencies.find((item) => item.code === currency) ?? currencies.find((item) => item.code === "USD");

  // Minimum donation is USD 0.10 equivalent in the donor-selected currency.
  const minimumDonationUsd = 0.1;
  const selectedRate = selectedCurrency?.rate && selectedCurrency.rate > 0 ? selectedCurrency.rate : 1;
  const minimumDonationInSelectedCurrency = minimumDonationUsd * selectedRate;
  const donationAmountUsd = currency === "USD" ? donationAmount : donationAmount / selectedRate;


  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  function validateForm() {
    if (
      !amount ||
      !Number.isFinite(donationAmount) ||
      donationAmount <= 0
    ) {
      return "Please enter a valid donation amount.";
    }

    if (!Number.isFinite(donationAmountUsd) || donationAmountUsd < minimumDonationUsd) {
      return `Minimum donation is USD $0.10 equivalent (${currency} ${minimumDonationInSelectedCurrency.toFixed(2)}).`;
    }

    if (!firstName.trim()) {
      return "Please enter your first name.";
    }

    if (!lastName.trim()) {
      return "Please enter your last name.";
    }

    if (!email.trim()) {
      return "Please enter your email address.";
    }
    if (!paymentMethod) {
      return "Please select a payment method.";
    }

    const selectedGateway = gateways.find((gateway) => gateway.id === paymentMethod);
    if (selectedGateway?.requires_account && !walletNumber.trim()) {
      return "Please enter the wallet/account number for this payment method.";
    }

    return null;
  }

  function buildReceipt(result: {
    order_id: number;
    donation_id?: number | null;
    transaction_id?: string | null;
    payment_method?: string;
    payment_status?: string;
  }): DonationReceipt {
    const selectedGateway = gateways.find((gateway) => gateway.id === paymentMethod);
    return {
      donationId: result.donation_id ?? null,
      orderId: result.order_id,
      transactionId: result.transaction_id ?? null,
      campaignTitle: campaign?.title || "Campaign",
      amount: donationAmount,
      tipAmount,
      total,
      currency,
      donorName: isAnonymous ? "Anonymous" : `${firstName.trim()} ${lastName.trim()}`.trim(),
      paymentMethod: selectedGateway?.title || result.payment_method || paymentMethod,
      paymentStatus: result.payment_status || "paid",
      date: new Date().toLocaleString(),
    };
  }

  function rememberReceipt(receiptData: DonationReceipt) {
    try {
      sessionStorage.setItem(`hiilbox_receipt_${receiptData.orderId}`, JSON.stringify(receiptData));
    } catch {
      // Receipt display still works even if storage is unavailable.
    }
  }

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!campaign) {
      setError(
        "Campaign information is missing."
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await processCheckout({
          campaign_id: campaign.id,
          amount: donationAmount,
          currency,
          tip_amount: tipAmount,

          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),

          // IMPORTANT:
          // This is the exact property expected
          // by CheckoutInput in donations.ts.
          phone: walletNumber.trim(),

          // Billing address is intentionally not collected for the
          // wallet-first HiilBox checkout. Keep the existing order contract.
          address: "",
          address_2: "",
          city: "",
          state: "",
          zip_code: "",
          country: "",

          payment_method: paymentMethod,
          wallet_number: walletNumber.trim(),
          is_anonymous: isAnonymous,
        });

      const confirmedPaid =
        result.payment_status === "paid" ||
        result.status === "processing" ||
        result.status === "completed";

      // Confirmed synchronous payments stay on checkout and open a themed
      // receipt modal instead of navigating to a separate success page.
      if (confirmedPaid && result.order_id) {
        const receiptData = buildReceipt(result);
        rememberReceipt(receiptData);
        setReceipt(receiptData);
        setReceiptOpen(true);
        setLoading(false);
        return;
      }

      // Redirect-based gateways still need to leave the site temporarily.
      // Store the receipt context so the callback can reopen the same modal.
      if (result.redirect && result.payment_status === "pending") {
        if (result.order_id) {
          rememberReceipt(buildReceipt(result));
        }
        window.location.href = result.redirect;
        return;
      }

      // Some gateways return a Next.js callback path while still pending.
      if (result.nextjs_success_path) {
        if (result.order_id) {
          rememberReceipt(buildReceipt(result));
        }
        window.location.href = result.nextjs_success_path;
        return;
      }

      if (result.payment_status === "on-hold" || (result.payment_status === "pending" && ["bacs", "cod"].includes(paymentMethod))) {
        setError("Your offline donation order has been placed. Payment is pending; please follow HiilBox bank transfer or cash payment instructions. Do not send money without verified instructions.");
        setLoading(false);
        return;
      }

      if (result.payment_status === "pending") {
        throw new Error(
          "Your payment request was started, but the gateway has not confirmed the donation yet."
        );
      }

      throw new Error(
        "The payment gateway did not return a confirmed payment result."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while processing your donation."
      );

      setLoading(false);
    }
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (!campaign) {
    return (
      <main className="min-h-screen bg-lightgray px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-[16px] bg-white p-8 text-center shadow-[0_10px_28px_rgba(17,28,45,0.06)]">
          <p className="text-sm text-gray-500">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }


  // --------------------------------------------------
  // CAMPAIGN PROGRESS (display only)
  // --------------------------------------------------
  const progress = campaign.goal > 0
    ? Math.min(100, Math.max(0, (campaign.raised_amount / campaign.goal) * 100))
    : 0;
  const progressSize = 132;
  const progressStroke = 10;
  const progressRadius = (progressSize - progressStroke) / 2;
  const progressCircumference = 2 * Math.PI * progressRadius;
  const progressOffset = progressCircumference * (1 - progress / 100);

  return (
    <ThemeShell>
    <main className="min-h-screen bg-lightgray">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">

          <Button
            type="button"
            variant="ghostprimary"
            onClick={() => router.back()}
            disabled={loading}
            className="mb-6 px-0 hover:bg-transparent"
          >
            <Icon icon="solar:arrow-left-linear" />
            Back
          </Button>

        

          <form onSubmit={handleSubmit}>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

              {/* LEFT */}
              <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white p-5 shadow-[0_18px_65px_rgba(13,70,51,0.10)] backdrop-blur-xl ring-1 ring-emerald-100/60 sm:p-8">

                {/* Responsive campaign progress and title */}
                <div className="mb-8 border-b border-gray-200 pb-7">
                  <div className="flex items-center gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 shadow-[0_12px_36px_rgba(1,161,75,0.10)] sm:gap-6 sm:p-6">
                    <div className="relative h-24 w-24 shrink-0 sm:h-36 sm:w-36" role="img" aria-label={`Campaign funded ${progress.toFixed(1)} percent`}>
                      <div className="absolute inset-2 rounded-full bg-emerald-300/20 blur-xl" />
                      <svg className="relative h-full w-full -rotate-90 drop-shadow-[0_0_8px_rgba(1,161,75,0.3)]" viewBox={`0 0 ${progressSize} ${progressSize}`} aria-hidden="true">
                        <defs><linearGradient id="hiilbox-progress-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00d4aa" /><stop offset="100%" stopColor="#01A14B" /></linearGradient></defs>
                        <circle cx={progressSize / 2} cy={progressSize / 2} r={progressRadius} fill="none" stroke="#d9f3e7" strokeWidth={progressStroke} />
                        <circle cx={progressSize / 2} cy={progressSize / 2} r={progressRadius} fill="none" stroke="url(#hiilbox-progress-gradient)" strokeWidth={progressStroke} strokeLinecap="round" strokeDasharray={progressCircumference} strokeDashoffset={progressOffset} className="transition-all duration-700 ease-out" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-black tracking-tight text-emerald-800 sm:text-3xl">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-extrabold leading-tight tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">{campaign.title}</p>
                      <p className="mt-2 text-xs font-semibold text-emerald-700 sm:text-sm">Fundraising goal reached</p>
                    </div>
                  </div>
                </div>

                {/* AMOUNT — GoFundMe-inspired large amount entry */}
                <section>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Enter your donation</h2>
                      <p className="mt-1 text-sm text-gray-500">Choose an amount or enter your own.</p>
                    </div>
                    {campaign.suggestedAmounts.length > 0 && <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-600 sm:text-sm">
                      <input
                        type="checkbox"
                        checked={showSuggestedAmounts}
                        onChange={(e) => setShowSuggestedAmounts(e.target.checked)}
                        className="h-4 w-4 accent-[#01A14B]"
                      />
                      Suggested amounts
                    </label>}
                  </div>

                  {showSuggestedAmounts && campaign.suggestedAmounts.length > 0 && (
                    <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3" aria-label="Suggested donation amounts">
                      {[...campaign.suggestedAmounts].sort((a, b) => a - b).map((value) => {
                        const selected = donationAmount === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            disabled={loading}
                            onClick={() => setAmount(String(value))}
                            aria-pressed={selected}
                            className={`relative min-h-[66px] rounded-2xl border-2 px-2 py-3 text-center text-lg font-extrabold transition-all sm:min-h-[76px] sm:text-xl ${
                              selected
                                ? "border-[#01A14B] bg-emerald-50 text-[#017a3a] shadow-[0_5px_18px_rgba(1,161,75,0.12)]"
                                : "border-white/90 bg-white/60 text-gray-900 shadow-sm backdrop-blur-sm hover:border-[#01A14B] hover:bg-emerald-50/70"
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                          >
                            {currency === "SOS" ? "SLSH" : currency} {value}
                            {value === campaign.recommendedAmount && (
                              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#01A14B] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white sm:text-[10px]">
                                ♥ Suggested
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-7 overflow-hidden rounded-[22px] border-2 border-gray-300 bg-white shadow-sm transition-colors focus-within:border-[#017a3a] focus-within:ring-4 focus-within:ring-emerald-100">
                    <div className="flex min-h-[126px] items-center gap-3 px-5 py-5 sm:min-h-[150px] sm:px-7">
                      <div className="flex shrink-0 flex-col items-start gap-1">
                        <Select value={currency} onValueChange={setCurrency} disabled={loading}>
<SelectTrigger className="h-12 w-[110px] border-0 bg-transparent px-0 text-2xl font-bold text-gray-900 shadow-none focus:ring-0" style={{ fontSize: "26px", fontWeight: 700 }} aria-label="Donation currency">
                              <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Currencies</SelectLabel>
                              {currencies.map((item) => (
                                <SelectItem key={item.code} value={item.code} disabled={item.rate <= 0}>{item.code === "SOS" ? "SLSH" : item.code}{item.rate <= 0 ? " (unavailable)" : ""}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <input
                        id="amount"
                        name="amount"
                        aria-label="Donation amount"
                        type="number"
                        min={minimumDonationInSelectedCurrency}
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={loading}
                        required
                        placeholder="0.00"
                        style={{ fontSize: "72px", fontWeight: 800 }}
className="min-w-0 w-full flex-1 appearance-none border-0 bg-transparent text-right text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 outline-none placeholder:text-gray-500 focus:ring-0 disabled:opacity-60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"                      />
                    </div>
                  </div>

                  {/* Optional tip: editable dollar amount, defaults to 10% */}
                  <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <label htmlFor="hiilbox_tip" className="block text-base font-bold text-gray-900">HiilBox tip</label>
                        <p className="mt-1 text-sm text-gray-500">Suggested 10% of your donation. You can change it or enter 0.</p>
                      </div>
                      <div className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-2xl font-bold focus:border-green-500 focus:outline-none">
<span className="text-base font-semibold text-gray-500">{currency === "SOS" ? "SLSH" : currency}</span>                        <input id="hiilbox_tip" type="number" min="0" step="0.01" inputMode="decimal"
                          value={manualTip === null ? tipAmount.toFixed(2) : manualTip}
                          onChange={(e) => setManualTip(e.target.value)}
                          disabled={loading} aria-label="HiilBox tip amount"
                          className="w-28 border-0 bg-transparent text-right text-lg font-bold text-gray-900 outline-none focus:ring-0" />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="my-8 border-t border-white/70" />

                {/* PERSONAL INFORMATION */}
                <section>
                  <h2 className="text-xl font-bold text-dark dark:text-white">
                    Your information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Enter the information associated with your donation.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">

                    {/* FIRST NAME */}
                    <div>
                      <Field className='w-full'>
                        <Label htmlFor="first_name" className='mb-1 block text-ld'>First & Middle Name</Label>
                        <Description className='text-darklink dark:text-gray-500 text-xs'>
                          E.g. Hebel Hebel
                        </Description>
                        <Input
                          id="first_name"
                          name="first_name"
                          type="text"
                          value={firstName}
                          onChange={(e) =>
                            setFirstName(e.target.value)
                          }
                          disabled={loading}
                          required
                          autoComplete="given-name"
                          className="ui-form-control rounded-xl border border-white/80 bg-white/65 py-3 px-4 w-full mt-2 shadow-sm backdrop-blur-sm focus:border-[#01A14B] focus:ring-2 focus:ring-emerald-100"
                        />
                      </Field>
                    </div>

                    {/* LAST NAME */}
                    <div>

                      <Field className='w-full'>
                        <Label htmlFor="last_name" className='mb-1 block text-ld'>Last name</Label>
                        <Description className='text-darklink dark:text-gray-500 text-xs'>
                          E.g. Hebel
                        </Description>
                        <Input
                          id="last_name"
                          name="last_name"
                          type="text"
                          value={lastName}
                          onChange={(e) =>
                            setLastName(e.target.value)
                          }
                          disabled={loading}
                          required
                          autoComplete="family-name"
                          className="ui-form-control rounded-xl border border-white/80 bg-white/65 py-3 px-4 w-full mt-2 shadow-sm backdrop-blur-sm focus:border-[#01A14B] focus:ring-2 focus:ring-emerald-100"
                        />
                      </Field>
                    </div>

                    {/* EMAIL */}
                    <div className="sm:col-span-2">
                      <Field className='w-full'>
                         <Label htmlFor="email" className='mb-1 block text-ld'>Email address</Label>
                        <Description className='text-darklink dark:text-gray-500 text-xs'>
                          E.g. hebel@mail.com
                        </Description>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                          disabled={loading}
                          required
                          autoComplete="email"
                          className="ui-form-control rounded-xl border border-white/80 bg-white/65 py-3 px-4 w-full mt-2 shadow-sm backdrop-blur-sm focus:border-[#01A14B] focus:ring-2 focus:ring-emerald-100"
                        />
                      </Field>
                    </div>

                  </div>
                </section>

                <div className="my-8 border-t border-white/70" />

                {/* PAYMENT */}
                <section>
                  <div className="flex flex-col gap-4 border-b border-ld pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-dark dark:text-white">
                        Complete your payment
                      </h2>
                      <p className="mt-1 text-sm text-darklink">
                        Your support makes a real difference. Choose how you&apos;d like to pay.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#edf9f2] px-3 py-2 text-xs font-semibold text-[#018d42]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 bg-white">✓</span>
                      Secure &amp; encrypted
                    </div>
                  </div>

                  <div className="py-6">
                    <h3 className="mb-4 text-base font-bold text-dark dark:text-white">Payment method</h3>
                    <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/55 backdrop-blur-sm">
                      {[
                        { key: "mobile", label: "Mobile Payment", description: "ZAAD, EVC, SAHAL, eDahab and Premier Wallet", available: walletGatewayOptions.some((item) => Boolean(item.gateway)), icon: "solar:smartphone-2-linear" },
                        { key: "card", label: "Credit / Debit Card", description: "Secure card payment through your enabled gateway", available: Boolean(cardGateway), icon: "solar:card-linear" },
                        { key: "bank", label: "Bank Transfer and Cash Payment", description: "Offline payment via WooCommerce bank transfer or cash", available: Boolean(bankGateway), icon: "solar:buildings-2-linear" },
                      ].map((option, index) => {
                        const selected = option.key === "mobile" ? paymentGroup === "somali-wallets" : option.key === "card" ? Boolean(cardGateway && paymentMethod === cardGateway.id) : Boolean(bankGateway && paymentMethod === bankGateway.id);
                        return (
                          <button
                            key={option.key}
                            type="button"
                            disabled={loading || loadingGateways || !option.available}
                            onClick={() => {
                              setWalletNumber("");
                              setError("");
                              if (option.key === "mobile") {
                                setPaymentGroup("somali-wallets");
                                setPaymentMethod("");
                              } else {
                                setPaymentGroup("other");
                                setPaymentMethod(option.key === "card" ? cardGateway?.id || "" : bankGateway?.id || "");
                              }
                            }}
                            className={`flex w-full items-center gap-4 px-5 py-5 text-left transition sm:px-6 ${index > 0 ? "border-t border-white/70" : ""} ${selected ? "bg-[#f0faf4]" : "hover:bg-gray-50"} disabled:cursor-not-allowed disabled:opacity-50`}
                          >
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-[#01A14B]" : "border-gray-400"}`}>
                              {selected && <span className="h-3 w-3 rounded-full bg-[#01A14B]" />}
                            </span>
                            <Icon icon={option.icon} height={28} className={selected ? "text-[#01A14B]" : "text-gray-700"} />
                            <span className="flex-1">
                              <span className="block text-base font-semibold text-gray-900">{option.label}</span>
                              <span className="mt-1 block text-xs text-gray-500">{option.available ? option.description : "Not currently enabled"}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {paymentGroup === "somali-wallets" && (
                      <div className="mt-5 rounded-2xl border border-white/80 bg-white/45 p-5 backdrop-blur-sm">
                        <label htmlFor="wallet_number" className="block text-sm font-semibold text-gray-900">Mobile money phone number</label>
                        <p className="mt-1 text-xs text-gray-500">Enter your number to automatically select the supported mobile money provider.</p>
                        <Input
                          id="wallet_number"
                          name="wallet_number"
                          type="tel"
                          value={walletNumber}
                          onChange={(e) => { setWalletNumber(e.target.value); if (error) setError(""); }}
                          disabled={loading}
                          placeholder="063XXXXXXX"
                          autoComplete="tel"
                          inputMode="tel"
                          className="ui-form-control mt-3 w-full rounded-xl border border-white/80 bg-white/65 px-4 py-3 shadow-sm backdrop-blur-sm focus:border-[#01A14B]"
                        />
                        {detectedMobileProvider && (
                          <p className={`mt-3 text-sm ${detectedMobileGateway ? "text-[#018d42]" : "text-amber-700"}`}>
                            {detectedMobileGateway ? `Detected: ${detectedMobileProvider.name}` : `${detectedMobileProvider.name} — payment unavailable`}
                          </p>
                        )}
                        {!detectedMobileProvider && walletNumber.trim() && <p className="mt-3 text-xs text-gray-500">Enter a supported mobile prefix to identify your provider.</p>}
                      </div>
                    )}

                    {paymentGroup === "other" && cardGateway && paymentMethod === cardGateway.id && (
                      <div className="mt-5 rounded-2xl border border-white/80 bg-white/45 p-5 backdrop-blur-sm">
                        <p className="text-sm font-semibold text-gray-900">Secure card checkout</p>
                        <p className="mt-2 text-sm text-gray-600">Continue to the secure card payment page provided by your WooCommerce card gateway. Card details are entered with the payment provider, never on HiilBox. If no payment page opens, the gateway integration needs to be enabled on WordPress.</p>
                      </div>
                    )}

                    {paymentGroup === "other" && bankGateway && paymentMethod === bankGateway.id && (
                      <div className="mt-5 rounded-2xl border border-white/80 bg-white/45 p-5 backdrop-blur-sm">
                        <p className="text-sm font-semibold text-gray-900">Bank transfer details</p>
                        <p className="mt-2 text-sm text-gray-600">Place an offline WooCommerce order. Follow the bank transfer or cash payment instructions supplied by HiilBox. Your donation remains pending until payment is verified.</p>
                        {bankGateway.requires_account && (
                          <div className="mt-4">
                            <label htmlFor="bank_account_reference" className="block text-sm font-semibold text-gray-900">Bank account / payment reference</label>
                            <Input id="bank_account_reference" name="bank_account_reference" type="text" value={walletNumber} onChange={(e) => setWalletNumber(e.target.value)} disabled={loading} required placeholder="Enter the account or reference requested by your bank gateway" className="ui-form-control mt-2 w-full rounded-xl border border-white/80 bg-white/65 px-4 py-3 shadow-sm backdrop-blur-sm focus:border-[#01A14B]" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* RIGHT SUMMARY */}
              <aside className="lg:sticky lg:top-6">
                <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_18px_65px_rgba(13,70,51,0.11)] backdrop-blur-xl ring-1 ring-emerald-100/60">

                  <div className="border-b border-white/70 bg-white px-6 py-5">
                    <h2 className="text-lg font-bold text-dark dark:text-white">
                      Donation summary
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Donation
                        </span>

                        <span className="font-semibold text-gray-900">
                          {currency} {donationAmount.toFixed(2)}
                        </span>
                      </div>

<div className="flex items-center justify-between text-sm">
  <span className="text-gray-500">
    HiilBox tip
  </span>

  <span className="font-semibold text-gray-900">
    {currency} {tipAmount.toFixed(2)}
  </span>
</div>



                    </div>

                    <div className="mt-6 border-t border-ld pt-5">
                      <div className="flex items-end justify-between">

                        <span className="font-bold text-dark dark:text-white">
                          Total
                        </span>

                        <span className="text-3xl font-extrabold text-primary sm:text-4xl">
                          {currency} {total.toFixed(2)}
                        </span>

                      </div>
                    </div>

                    <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-ld bg-lightgray p-4 transition hover:border-primary/40">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        disabled={loading}
                        className="mt-0.5 h-4 w-4 accent-[#01A14B]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-dark dark:text-white">Make my donation anonymous</span>
                        <span className="mt-1 block text-xs leading-5 text-darklink">Your name will not be shown publicly with this donation.</span>
                      </span>
                    </label>

                    {error && (
                      <div
                        role="alert"
                        className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                      >
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={
                        loading ||
                        loadingGateways ||
                        gateways.length === 0 ||
                        !paymentMethod ||
                        Boolean(
                          gateways.find((gateway) => gateway.id === paymentMethod)?.requires_account &&
                          !walletNumber.trim()
                        )
                      }
                      size="lg"
                      className="mt-6 w-full rounded-xl py-6 text-sm font-bold shadow-btn-shadow"
                    >
                      {loading ? (
                        <>
                          <Icon icon="solar:refresh-circle-linear" className="animate-spin" />
                          Connecting to secure payment...
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:hand-money-bold-duotone" />
                          Donate {currency} {total.toFixed(2)}
                        </>
                      )}
                    </Button>

                    <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                      <span>🔒</span>
                      <span>
                        Secure payment powered by HiilBox
                      </span>
                    </div>

                  </div>
                </div>
              </aside>

            </div>
          </form>

          <DonationReceiptDialog
            open={receiptOpen}
            receipt={receipt}
            onOpenChange={setReceiptOpen}
          />

        </div>
      </div>
    </main>
    </ThemeShell>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-lightgray px-4 py-12">
          <div className="mx-auto max-w-3xl rounded-[16px] bg-white p-8 text-center shadow-[0_10px_28px_rgba(17,28,45,0.06)]">
            <p className="text-sm text-gray-500">
              Loading checkout...
            </p>
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}