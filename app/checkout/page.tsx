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
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [campaign, setCampaign] =
    useState<CampaignData | null>(null);

  // Keep checkout completely empty initially.
  const [amount, setAmount] = useState("");
  const [tipPercent, setTipPercent] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [currencies, setCurrencies] = useState<CheckoutCurrency[]>([
    { code: "USD", name: "US Dollar", rate: 1 },
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

        if (!cancelled) {
          setCampaign({
            id: campaignId,
            title: String(raw?.title || campaignTitle),
            goal: Number(raw?.goal_amount || campaignGoal),
            raised_amount: Number(raw?.fund_raised || campaignRaisedAmount),
            imageUrl,
          });
        }
      } catch {
        if (!cancelled) {
          setCampaign({ id: campaignId, title: campaignTitle, goal: campaignGoal, raised_amount: campaignRaisedAmount, imageUrl: "" });
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
    gatewayById("card_pay") ||
    gatewayMatching([/card/, /visa/, /mastercard/, /credit/, /debit/]);

  const bankGateway =
    gatewayMatching([/bank.?transfer/, /bacs/, /bank/]);

  // --------------------------------------------------
  // AMOUNT / TIP
  // --------------------------------------------------

  const donationAmount =
    amount === ""
      ? 0
      : Number(amount);

  const tipAmount = useMemo(() => {
    if (
      !Number.isFinite(donationAmount) ||
      donationAmount <= 0
    ) {
      return 0;
    }

    return (
      (donationAmount * tipPercent) /
      100
    );
  }, [donationAmount, tipPercent]);

  const total =
    donationAmount + tipAmount;

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

  const progress =
    campaign.goal > 0
      ? Math.min(
          100,
          Math.round(
            (campaign.raised_amount / campaign.goal) * 100
          )
        )
      : 0;

    // --- ADD THIS SVG MATH HERE ---
    const size = 100; // Adjust size of the circle here
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <ThemeShell>
    <main className="min-h-screen bg-lightgray">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1218px]">

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

          <div className="flex flex-row md:flex-nowrap flex-wrap gap-10 items-center justify-center relative mb-8 overflow-hidden rounded-2xl border border-ld bg-white dark:bg-darkgray p-6 shadow-md before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-primary">
            <div className="md:basis-1/4 basis-full">
              {campaign.imageUrl ? (
                    <div className="relative min-h-50 w-auto overflow-hidden bg-[#f2f4f2]">
                      <img
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        className="absolute rounded-md inset-0 h-full w-full object-cover"
                        loading="eager"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : null}
            </div>
            <div className="md:basis-2/4 basis-full">
              <div className=" flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lightprimary text-primary">
                  <Icon icon="solar:hand-money-bold-duotone" height={24} />
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-dark dark:text-white sm:text-4xl">
                  Make a donation
                </h1>
              </div>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                Support this campaign with a secure donation.
              </p>
              <h2 className="mt-2 text-xl font-bold leading-7 text-dark dark:text-white">
                      {campaign.title}
              </h2>
            </div>
            <div className="relative md:basis-1/4 basis-full flex items-center justify-center content-ccenter w-auto h-50">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox={`0 0 ${size} ${size}`}
              >
                {/* Background Track Circle */}
                <circle
                  className="text-gray-100 dark:text-gray-800"
                  stroke="currentColor"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                />

                {/* Progress Circle */}
                <circle
                  className="text-[#01A14B]"
                  stroke="currentColor"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                />
              </svg>

              {/* Center Text */}
              <span className="absolute text-base font-semibold text-gray-700 dark:text-gray-300">
                {progress}%
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">

              {/* LEFT */}
              <div className="space-y-6">

                {/* CAMPAIGN */}
                

                {/* AMOUNT */}
                <section className="rounded-[16px] border border-ld bg-white p-6 shadow-[0_10px_28px_rgba(17,28,45,0.06)]">
                  <h2 className="text-xl font-bold text-dark dark:text-white">
                    Choose your donation
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Enter the amount you would like to donate.
                  </p>

                  <div className="mt-6">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Donation amount
                    </label>

                    <div className="mt-2 grid gap-2 sm:grid-cols-[150px_1fr]">
                      <Select 
                        value={currency} 
                        onValueChange={(value) => setCurrency(value)} // 👈 Notice it's just 'value', not 'e.target.value'
                        disabled={loading}
                      >
                        <SelectTrigger 
                          className="w-full rounded-md border border-gray-300 bg-white px-4 py-4 font-semibold text-dark dark:text-white outline-none focus:border-primary focus:ring-4 focus:ring-lightprimary disabled:bg-gray-100"
                          aria-label="Donation currency"
                        >
                          {/* This displays the currently selected value, or the placeholder if nothing is selected */}
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Currencies</SelectLabel>
                            
                            {/* Map through your currencies array just like before */}
                            {currencies.map((item) => (
                              <SelectItem key={item.code} value={item.code}>
                                {item.code}
                              </SelectItem>
                            ))}
                            
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Field className='w-full'>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          min={minimumDonationInSelectedCurrency}
                          step="0.01"
                          value={amount}
                          onChange={(e) =>
                            setAmount(e.target.value)
                          }
                          disabled={loading}
                          required
                          placeholder="0.00"
                          className="ui-form-control h-14 rounded-md py-4 px-3 w-full "
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {[10, 25, 50, 100].map(
                      (value) => {
                        const selected =
                          donationAmount === value;

                        return (
                          <button
                            key={value}
                            type="button"
                            disabled={loading}
                            onClick={() =>
                              setAmount(
                                String(value)
                              )
                            }
                            className={`rounded-md border px-3 py-3 text-sm font-semibold transition ${
                              selected
                                ? "border-primary bg-lightprimary text-primary"
                                : "border-gray-200 bg-white text-gray-600 hover:border-primary/40 hover:bg-lightprimary/50"
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                          >
                            {currency} {value}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* TIP */}
                  <div className="mt-8 rounded-[16px] bg-gray-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-dark dark:text-white">
                          Support HiilBox
                        </p>

                        <p className="mt-1 max-w-md text-xs leading-5 text-gray-500">
                          Help us keep HiilBox running and make it possible for more people to support important causes.
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-lightprimary px-3 py-1 text-sm font-bold text-primary">
                        {tipPercent}%
                      </span>
                    </div>

                    <input
                      aria-label="HiilBox support percentage"
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={tipPercent}
                      onChange={(e) =>
                        setTipPercent(
                          Number(e.target.value)
                        )
                      }
                      disabled={loading}
                      className="mt-6 h-2 w-full cursor-pointer accent-[#01A14B] disabled:cursor-not-allowed"
                    />

                    <div className="mt-2 flex justify-between text-xs text-gray-400">
                      <span>0%</span>
                      <span>5%</span>
                      <span>10%</span>
                      <span>15%</span>
                      <span>20%</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                      <span className="text-xs text-gray-500">
                        HiilBox support
                      </span>

                      <span className="text-sm font-bold text-gray-700">
                        {currency} {tipAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </section>

                {/* PERSONAL INFORMATION */}
                <section className="rounded-[16px] border border-ld bg-white p-6 shadow-[0_10px_28px_rgba(17,28,45,0.06)]">
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
                          className="ui-form-control rounded-md py-2.5 px-3 w-full mt-2"
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
                          className="ui-form-control rounded-md py-2.5 px-3 w-full mt-2"
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
                          className="ui-form-control rounded-md py-2.5 px-3 w-full mt-2"
                        />
                      </Field>
                    </div>

                  </div>
                </section>

                {/* PAYMENT */}
                <section className="overflow-hidden rounded-[20px] border border-ld bg-white shadow-[0_12px_32px_rgba(17,28,45,0.06)]">
                  <div className="flex flex-col gap-4 border-b border-ld px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
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

                  <div className="border-b border-ld px-6 py-6">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        1
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-dark dark:text-white">
                          Choose where you want to pay
                        </h3>
                        <p className="mt-1 text-xs text-darklink">
                          Select the option that works best for you.
                        </p>
                      </div>
                    </div>

                    {loadingGateways ? (
                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        {[0, 1, 2].map((item) => (
                          <div key={item} className="h-[104px] animate-pulse rounded-[14px] border border-ld bg-lightgray" />
                        ))}
                      </div>
                    ) : (
                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        {[
                          {
                            id: "somali-wallets" as const,
                            title: "Waafi, eDahab, Premier Wallet",
                            subtitle: "ZAAD, EVC, SAHAL and supported Somali wallets",
                            available: walletGatewayOptions.some((item) => Boolean(item.gateway)),
                          },
                          {
                            id: "ethiopia-wallets" as const,
                            title: "eBirr, COOPay, CBE Birr",
                            subtitle: "Ethiopian mobile money options",
                            available: ethiopiaGatewayOptions.some((item) => Boolean(item.gateway)),
                          },
                          {
                            id: "east-africa-wallets" as const,
                            title: "M-Pesa, MTN",
                            subtitle: "East African mobile money options",
                            available: eastAfricaGatewayOptions.some((item) => Boolean(item.gateway)),
                          },
                        ].map((group) => {
                          const selected = paymentGroup === group.id;

                          return (
                            <button
                              key={group.id}
                              type="button"
                              disabled={loading}
                              onClick={() => {
                                setPaymentGroup(group.id);
                                setPaymentMethod("");
                                setWalletNumber("");
                                setError("");
                              }}
                              className={`relative flex min-h-[108px] items-center gap-3 rounded-[14px] border p-4 text-left transition ${
                                selected
                                  ? "border-primary bg-lightprimary shadow-[0_8px_22px_rgba(1,161,75,0.08)]"
                                  : group.available
                                    ? "border-ld bg-white hover:border-primary/45 hover:shadow-[0_8px_22px_rgba(17,28,45,0.05)]"
                                    : "cursor-not-allowed border-[#edf0f2] bg-[#fafbfc] opacity-60"
                              }`}
                            >
                              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-xl ${
                                selected ? "bg-lightprimary text-primary" : "bg-[#f3f5f7] text-darklink"
                              }`}>
                                ▯
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-bold leading-5 text-dark dark:text-white">
                                  {group.title}
                                </span>
                                <span className="mt-1 block text-xs leading-4 text-darklink">
                                  {group.available ? group.subtitle : `${group.subtitle} · providers not yet enabled`}
                                </span>
                              </span>

                              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                                selected
                                  ? "border-primary bg-primary text-white"
                                  : "border-[#aeb8c4] bg-white text-transparent"
                              }`}>
                                ✓
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="border-b border-ld px-6 py-6">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        2
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-dark dark:text-white">
                          Enter your payment details
                        </h3>
                        <p className="mt-1 text-xs text-darklink">
                          Provide your details to receive a payment prompt.
                        </p>
                      </div>
                    </div>

                    {!paymentGroup || paymentGroup === "other" ? (
                      <div className="mt-5 rounded-[14px] border border-dashed border-[#ccd4dc] bg-lightgray px-4 py-5 text-sm text-darklink">
                        Choose one of the mobile payment options above to see its providers.
                      </div>
                    ) : (
                      <div className="mt-5">
                        <p className="mb-3 text-sm font-bold text-dark dark:text-white">
                          Mobile Money Provider <span className="text-red-500">*</span>
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {(paymentGroup === "somali-wallets"
                            ? walletGatewayOptions
                            : paymentGroup === "ethiopia-wallets"
                              ? ethiopiaGatewayOptions
                              : eastAfricaGatewayOptions
                          ).map((provider) => {
                            const gateway = provider.gateway;
                            const selected = Boolean(gateway && paymentMethod === gateway.id);

                            return (
                              <button
                                key={provider.key}
                                type="button"
                                disabled={!gateway || loading}
                                onClick={() => {
                                  if (!gateway) return;
                                  setPaymentMethod(gateway.id);
                                  setWalletNumber("");
                                  setError("");
                                }}
                                className={`flex min-h-[54px] items-center gap-3 rounded-[12px] border px-4 py-3 text-left text-sm font-semibold transition ${
                                  selected
                                    ? "border-primary bg-lightprimary text-dark dark:text-white"
                                    : gateway
                                      ? "border-[#d8dee4] bg-white text-dark dark:text-white hover:border-primary/45"
                                      : "cursor-not-allowed border-[#edf0f2] bg-[#fafbfc] text-[#9aa6b2]"
                                }`}
                              >
                                <span className={`h-4 w-4 shrink-0 rounded-full border ${
                                  selected
                                    ? "border-[5px] border-primary"
                                    : "border-[#aeb8c4]"
                                }`} />
                                <span className="flex-1">{provider.label}</span>
                                {!gateway && (
                                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#9aa6b2]">
                                    Unavailable
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {paymentMethod &&
                          gateways.find((gateway) => gateway.id === paymentMethod)?.requires_account && (
                            <div className="mt-5">
                              <label htmlFor="wallet_number" className="block text-sm font-bold text-dark dark:text-white">
                                Phone / wallet number <span className="text-red-500">*</span>
                              </label>

                              <div className="relative mt-2">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#8a98a8] mt-2">
                                  ☎
                                </span>
                                <Input
                                  id="wallet_number"
                                  name="wallet_number"
                                  type="tel"
                                  value={walletNumber}
                                  onChange={(e) => {
                                    setWalletNumber(e.target.value);
                                    if (error) setError("");
                                  }}
                                  disabled={loading}
                                  required
                                  placeholder="0900 123 4567"
                                  autoComplete="tel"
                                  inputMode="tel"
                                  className="ui-form-control rounded-md py-4 pl-11 pr-3 w-full mt-2"
                                />
                              </div>
                            </div>
                          )}

                        {paymentMethod &&
                          !gateways.find((gateway) => gateway.id === paymentMethod)?.requires_account && (
                            <div className="mt-5 rounded-[14px] border border-[#dcefe4] bg-lightprimary px-4 py-4 text-sm text-[#355c47]">
                              This provider does not require an additional wallet number.
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-6">
                    <p className="mb-3 text-sm font-bold text-dark dark:text-white">
                      Other payment options
                    </p>

                    <div className="space-y-3">
                      <button
                        type="button"
                        disabled={!cardGateway || loading}
                        onClick={() => {
                          if (!cardGateway) return;
                          setPaymentGroup("other");
                          setPaymentMethod(cardGateway.id);
                          setWalletNumber("");
                          setError("");
                        }}
                        className={`flex w-full items-center gap-4 rounded-[14px] border px-4 py-4 text-left transition ${
                          cardGateway
                            ? paymentMethod === cardGateway.id
                              ? "border-primary bg-lightprimary"
                              : "border-ld bg-white hover:border-primary/45"
                            : "cursor-not-allowed border-[#edf0f2] bg-[#fafbfc] opacity-60"
                        }`}
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#f1eaff] text-xl text-[#7447e8]">▣</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-dark dark:text-white">Credit / Debit Card</span>
                          <span className="mt-1 block text-xs text-darklink">
                            {cardGateway ? "Pay securely with Visa, Mastercard or other cards" : "Card payments are not currently enabled"}
                          </span>
                        </span>
                        {cardGateway && <span className="rounded bg-[#f1eaff] px-2 py-1 text-[10px] font-bold text-[#7447e8]">Secure</span>}
                        <span className="text-lg text-darklink">›</span>
                      </button>

                      <button
                        type="button"
                        disabled={!bankGateway || loading}
                        onClick={() => {
                          if (!bankGateway) return;
                          setPaymentGroup("other");
                          setPaymentMethod(bankGateway.id);
                          setWalletNumber("");
                          setError("");
                        }}
                        className={`flex w-full items-center gap-4 rounded-[14px] border px-4 py-4 text-left transition ${
                          bankGateway
                            ? paymentMethod === bankGateway.id
                              ? "border-primary bg-lightprimary"
                              : "border-ld bg-white hover:border-primary/45"
                            : "cursor-not-allowed border-[#edf0f2] bg-[#fafbfc] opacity-60"
                        }`}
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eef3ff] text-xl text-[#4466d8]">▥</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-dark dark:text-white">Bank Transfer</span>
                          <span className="mt-1 block text-xs text-darklink">
                            {bankGateway ? "Transfer directly from your bank" : "Bank transfer is not currently enabled"}
                          </span>
                        </span>
                        {bankGateway && <span className="rounded bg-[#eef3ff] px-2 py-1 text-[10px] font-bold text-[#4466d8]">1–3 business days</span>}
                        <span className="text-lg text-darklink">›</span>
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT SUMMARY */}
              <aside className="lg:sticky lg:top-6">
                <div className="overflow-hidden rounded-[16px] border border-ld bg-white shadow-[0_10px_28px_rgba(17,28,45,0.06)]">

                  <div className="border-b border-ld px-6 py-5">
                    <h2 className="text-lg font-bold text-dark dark:text-white">
                      Donation summary
                    </h2>
                  </div>

                  <div className="p-6">


                    <div className="mt-6 space-y-4">

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
                          HiilBox support ({tipPercent}%)
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

                        <span className="text-2xl font-bold text-primary">
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