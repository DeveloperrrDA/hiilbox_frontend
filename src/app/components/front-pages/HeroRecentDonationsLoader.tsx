
"use client";

import { useEffect, useState } from "react";
import HeroRecentDonations from "./HeroRecentDonations";
import type { Donation } from "@/lib/donations";

export default function HeroRecentDonationsLoader() {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDonations() {
      try {
        const response = await fetch("/api/donations/recent", {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data: { donations?: Donation[] } =
          await response.json();

        if (!controller.signal.aborted) {
          setDonations(
            Array.isArray(data.donations) ? data.donations : []
          );
        }
      } catch {
        // Keep the existing fallback donations.
      }
    }

    loadDonations();

    return () => controller.abort();
  }, []);

  return <HeroRecentDonations donations={donations} />;
}
