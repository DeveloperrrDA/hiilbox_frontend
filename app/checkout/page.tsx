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
  "somali-wallets" | "ethiopia-wallets" | "east-africa-wallets" | "other" | "card" | "bank" | "premier" | ""
>("");

  const [isAnonymous, setIsAnonymous] =
    useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

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
        setCurrencies(
  available.map((item) =>
    item.code === "SOS"
      ? { ...item, rate: 12000 }
      : item
  )
);
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
];

const premierGateway = gatewayById("premier_wallet_pay");

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
      if (!acceptedTerms) {
  return "Please accept the Terms & Conditions before donating.";
}
    }
    if (!paymentMethod) {
      return "Please select a payment method.";
    }

    const selectedGateway = gateways.find((gateway) => gateway.id === paymentMethod);
    if (selectedGateway?.requires_account && !["bacs", "cod"].includes(paymentMethod) && !walletNumber.trim()) {
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
      <main className="min-h-screen bg-[#fafafa] px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100">
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
  const progressSize = 36;
  const progressStroke = 3;
  const progressRadius = (progressSize - progressStroke) / 2;
  const progressCircumference = 2 * Math.PI * progressRadius;
  const progressOffset = progressCircumference * (1 - progress / 100);

  return (
    <ThemeShell>
    <main className="min-h-screen bg-[#fafafa] font-['Inter',sans-serif]">
      <div className="flex-grow w-full max-w-[1218px] mx-auto px-4 md:px-8 py-8 lg:py-10">
        
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary mb-6 transition-colors disabled:opacity-60"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </button>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 p-6 md:p-10 flex flex-col">

              {/* Responsive campaign progress and title */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full shrink-0">
                  <svg className="absolute inset-0 w-full h-full text-primary" viewBox={`0 0 ${progressSize} ${progressSize}`}>
                    <path className="text-gray-200" strokeWidth={progressStroke} stroke="currentColor" fill="none" d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`} />
                    <path className="text-primary transition-all duration-700 ease-out" strokeDasharray={progressCircumference} strokeDashoffset={progressOffset} strokeWidth={progressStroke} strokeLinecap="round" stroke="currentColor" fill="none" d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`} />
                  </svg>
                  <span className="text-xl font-bold text-gray-900">{progress.toFixed(0)}%</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{campaign.title}</h1>
                 <p className="text-sm font-medium text-primary">
  {currency === "SOS" ? "SLSH" : "$"}{" "}
  {(campaign.raised_amount * (currency === "SOS" ? selectedRate : 1))
    .toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} raised{" "}
  <span className="text-gray-500 font-normal">
    {" "}of {currency === "SOS" ? "SLSH" : "$"}{" "}
    {(campaign.goal * (currency === "SOS" ? selectedRate : 1))
      .toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} goal
  </span>
</p>
                </div>
              </div>

              <hr className="border-gray-100 my-8" />

              {/* AMOUNT */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Enter your donation</h2>
                <p className="text-sm text-gray-500 mb-6">Choose an amount or enter your own.</p>

                {campaign.suggestedAmounts.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                    {[...campaign.suggestedAmounts].sort((a, b) => a - b).map((value) => {
                      const convertedValue = currency === "SOS" ? value * 12000 : value;
                      const selected = donationAmount === convertedValue;
                      return (
                        <button
                          key={value}
                          type="button"
                          disabled={loading}
                          onClick={() => setAmount(String(convertedValue))}
                          className={`flex flex-col items-center justify-center py-4 rounded-xl transition-all relative group ${
                            selected
                              ? "border-2 border-primary bg-emerald-50 text-primary"
                              : "border border-gray-200 bg-white hover:border-primary hover:text-primary"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          <span className={`text-[11px] font-medium ${selected ? "text-primary" : "text-gray-500 group-hover:text-primary"}`}>
                            {currency === "SOS" ? "SLSH" : currency}
                          </span>
                          <span className={`font-bold text-lg ${selected ? "text-primary" : "text-gray-900 group-hover:text-primary"}`}>
                            {convertedValue.toLocaleString("en-US")}
                          </span>
                          {value === campaign.recommendedAmount && (
                            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                              Suggested
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="border border-gray-200 rounded-xl flex items-stretch h-24 sm:h-32 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white overflow-hidden">
                  <div className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium text-lg border-r border-gray-200 px-6">
                    <Select
  value={currency}
  onValueChange={(nextCurrency) => {
    if (nextCurrency === currency) return;

    const currentRate =
      currencies.find((item) => item.code === currency)?.rate || 1;

    const nextRate =
      currencies.find((item) => item.code === nextCurrency)?.rate || 1;

    const conversionFactor = nextRate / currentRate;

    setAmount((current) =>
      current === ""
        ? ""
        : String(Number((Number(current) * conversionFactor).toFixed(2)))
    );

    setManualTip((current) =>
      current === null || current === ""
        ? current
        : String(Number((Number(current) * conversionFactor).toFixed(2)))
    );

    setCurrency(nextCurrency);
  }}
  disabled={loading}
>
                      <SelectTrigger className="border-0 bg-transparent px-0 text-lg font-medium text-gray-700 shadow-none focus:ring-0">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {currencies.map((item) => (
                            <SelectItem key={item.code} value={item.code} disabled={item.rate <= 0}>{item.code === "SOS" ? "SLSH" : item.code}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min={minimumDonationInSelectedCurrency}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                    required
                    placeholder="0.00"
                    className="flex-1 min-w-0 w-full h-full text-right text-5xl sm:text-6xl font-bold text-gray-900 outline-none pr-6 pl-4 bg-transparent m-0 leading-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </section>

              <hr className="border-gray-100 my-8" />

              {/* TIP */}
              <section>
                <h3 className="font-bold text-gray-900 mb-1">HiilBox tip</h3>
                <p className="text-sm text-gray-500 mb-6">Suggested 10% of your donation. You can change it or enter 0.</p>
                
                <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
                  <span className="text-gray-700 font-medium text-sm mr-4">{currency === "SOS" ? "SLSH" : currency}</span>
                  <input
                    id="hiilbox_tip"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={manualTip === null ? tipAmount.toFixed(2) : manualTip}
                    onChange={(e) => setManualTip(e.target.value)}
                    disabled={loading}
                    className="flex-1 text-right text-gray-900 font-medium outline-none bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </section>

              <hr className="border-gray-100 my-8" />

              {/* PERSONAL INFORMATION */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Your information</h2>
                <p className="text-sm text-gray-500 mb-6">Enter your information exactly as it appears on your account.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field className="space-y-1">
                    <Label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First & Middle Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={loading}
                      required
                      placeholder="E.g. Hebel Hebel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400"
                    />
                  </Field>
                  
                  <Field className="space-y-1">
                    <Label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={loading}
                      required
                      placeholder="E.g. Hebel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400"
                    />
                  </Field>
                  
                  <Field className="md:col-span-2 space-y-1">
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                      placeholder="E.g. hebel@mail.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400"
                    />
                  </Field>
                </div>
              </section>

              <hr className="border-gray-100 my-8" />

              {/* PAYMENT */}
              <section>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-gray-900">Complete your payment</h2>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                    Secure & encrypted
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-6">Your support makes a real difference. Choose how you'd like to pay.</p>

                <h3 className="text-sm font-bold text-gray-900 mb-4">Payment method</h3>
                
                <div className="space-y-3">
                  {[
                    {
                      key: "mobile",
                      label: "Mobile Payment",
                      description: "ZAAD, EVC, SAHAL and eDahab",
                      available: walletGatewayOptions.some((item) => Boolean(item.gateway)),
                      icon: "solar:smartphone-2-linear",
                    },
                    {
                      key: "premier",
                      label: "Premier Bank",
                      description: "Pay securely using Premier Bank",
                      available: Boolean(premierGateway),
                      icon: "solar:buildings-2-linear",
                    },
                    {
                      key: "card",
                      label: "Credit / Debit Card",
                      description: "Secure card payment through your enabled gateway",
                      available: Boolean(cardGateway),
                      icon: "solar:card-linear",
                    },
                    {
                      key: "bank",
                      label: "Bank Transfer and Cash Payment",
                      description: "Offline payment via bank transfer or cash",
                      available: Boolean(bankGateway),
                      icon: "solar:buildings-2-linear",
                    },
                  ].map((option) => {
                    const selected = option.key === "mobile" ? paymentGroup === "somali-wallets" : paymentGroup === option.key;
                    
                    if (!option.available) return null;

                    return (
                      <div key={option.key}>
                        <label className="relative block cursor-pointer group">
                          <input 
                            type="radio" 
                            name="payment" 
                            className="payment-radio sr-only" 
                            checked={selected}
                            disabled={loading || loadingGateways}
                            onChange={() => {
                              setWalletNumber("");
                              setError("");
                              if (option.key === "mobile") {
                                setPaymentGroup("somali-wallets");
                                setPaymentMethod("");
                              } else if (option.key === "premier") {
                                setPaymentGroup("premier");
                                setPaymentMethod(premierGateway?.id || "");
                              } else {
                                setPaymentGroup(option.key === "card" ? "card" : "bank");
                                setPaymentMethod(option.key === "card" ? cardGateway?.id || "" : bankGateway?.id || "");
                              }
                            }}
                          />
                          <div className={`border rounded-xl p-5 transition-all ${selected ? 'border-[#10b981]' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-4">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-[#10b981]' : 'border-gray-300'}`}>
                                <div className={`w-2.5 h-2.5 rounded-full transition-transform ${selected ? 'bg-[#10b981] scale-100' : 'scale-0'}`}></div>
                              </div>
                              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm">
                                {option.icon && <Icon icon={option.icon} className="w-5 h-5 text-gray-700" />}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 text-sm">{option.label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                              </div>
                            </div>
                            
                            {option.key === "mobile" && selected && (
                              <div className="mt-4 pt-4 border-t border-emerald-100 pl-9">
                                <label className="block text-xs font-bold text-gray-700 mb-2">Mobile money phone number</label>
                                <p className="text-[11px] text-gray-500 mb-2">Enter your number to select the supported mobile money provider.</p>
                                <Input 
                                  type="text" 
                                  value={walletNumber}
                                  onChange={(e) => { setWalletNumber(e.target.value); if (error) setError(""); }}
                                  disabled={loading}
                                  placeholder="063XXXXXXX" 
                                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm bg-white placeholder-gray-400"
                                />
                                {!detectedMobileProvider && walletNumber.trim() && <p className="mt-2 text-[11px] text-gray-500">Enter a supported mobile prefix.</p>}
                              </div>
                            )}

                            {option.key === "premier" && selected && premierGateway?.requires_account && (
                              <div className="mt-4 pt-4 border-t border-emerald-100 pl-9">
                                <Input 
                                  type="text" 
                                  value={walletNumber}
                                  onChange={(e) => { setWalletNumber(e.target.value); if (error) setError(""); }}
                                  disabled={loading}
                                  placeholder="Enter your Premier Bank wallet/account number" 
                                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm bg-white placeholder-gray-400"
                                />
                              </div>
                            )}

                            {option.key === "card" && selected && (
                              <div className="mt-4 pt-4 border-t border-emerald-100 pl-9">
                                <p className="text-xs text-gray-500">Continue to the secure card payment page provided by your WooCommerce card gateway.</p>
                              </div>
                            )}

                            {option.key === "bank" && selected && (
                              <div className="mt-4 pt-4 border-t border-emerald-100 pl-9">
                                <p className="text-xs text-gray-500">Place an offline WooCommerce order. Follow the bank transfer instructions supplied by HiilBox.</p>
                              </div>
                            )}

                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>

            {/* RIGHT SUMMARY (4 cols) */}
            <div className="lg:col-span-4 mt-8 lg:mt-0 order-last">
              <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 p-6 md:p-8 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Donation summary</h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Donation</span>
                    <span className="font-bold text-gray-900">{currency === "SOS" ? "SLSH" : currency} {donationAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>HiilBox tip</span>
                    <span className="font-bold text-gray-900">{currency === "SOS" ? "SLSH" : currency} {tipAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 mb-8 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-extrabold text-primary">{currency === "SOS" ? "SLSH" : currency} {total.toFixed(2)}</span>
                </div>

                <div className="mb-8">
                  {/* Checkbox 1 */}
                  <div className="border-b border-gray-100 pb-4 mb-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        disabled={loading}
                        className="mt-0.5 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer accent-primary"
                      />
                      <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                        <strong className="text-sm text-gray-900 block mb-0.5">Make my donation anonymous</strong>
                        Your name will not be shown publicly with this donation.
                      </span>
                    </label>
                  </div>

                  {/* Checkbox 2 */}
                  <div className="border-b border-gray-100 pb-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={acceptedTerms}
                        onChange={(e) => { setAcceptedTerms(e.target.checked); if (error) setError(""); }}
                        disabled={loading}
                        required
                        className="mt-0.5 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer accent-primary"
                      />
                      <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                        I have read and agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Terms & Conditions</a>.
                      </span>
                    </label>
                  </div>
                </div>

                {error && (
                  <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={
                    loading ||
                    loadingGateways ||
                    gateways.length === 0 ||
                    !paymentMethod ||
                    Boolean(
                      gateways.find((gateway) => gateway.id === paymentMethod)?.requires_account &&
                      !["bacs", "cod"].includes(paymentMethod) &&
                      !walletNumber.trim()
                    )
                  }
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-4 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Icon icon="solar:refresh-circle-linear" className="animate-spin w-4 h-4" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      Donate {currency === "SOS" ? "SLSH" : currency} {total.toFixed(2)}
                    </>
                  )}
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                  <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                  Secure payment powered by HiilBox
                </div>
              </div>
            </div>

          </div>
        </form>

        <DonationReceiptDialog
          open={receiptOpen}
          receipt={receipt}
          onOpenChange={setReceiptOpen}
        />

      </div>
    </main>
    </ThemeShell>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fafafa] px-4 py-12 font-['Inter',sans-serif]">
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100">
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