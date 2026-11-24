
import { NextResponse } from "next/server";
import {
  gfcmCheckoutUrl,
  wcUrl,
  wcAuthHeader,
} from "../_server";

type Gateway = {
  id: string;
  title?: string;
  description?: string;
  enabled?: boolean;
  requires_account?: boolean;
  [key: string]: unknown;
};

type GatewayResponse = {
  gateways?: Gateway[];
  [key: string]: unknown;
};

type WooBacsGateway = {
  id: string;
  enabled: boolean;
  title?: string;
  description?: string;
};

export async function GET() {
  try {
    // Fetch the existing payment gateways.
    const response = await fetch(
      gfcmCheckoutUrl("/checkout-gateways"),
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const data: unknown = await response
      .json()
      .catch(() => null);

    // Preserve existing error handling.
    if (!response.ok || !data) {
      return NextResponse.json(
        data ?? { gateways: [] },
        {
          status: response.status,
        }
      );
    }

    // Preserve all existing payment gateways.
    const gateways: Gateway[] = Array.isArray(data)
      ? [...(data as Gateway[])]
      : typeof data === "object" &&
          data !== null &&
          Array.isArray((data as GatewayResponse).gateways)
        ? [...((data as GatewayResponse).gateways ?? [])]
        : [];

    // Add BACS only if it is not already present.
    if (!gateways.some((gateway) => gateway.id === "bacs")) {
      try {
        const wcResponse = await fetch(
          wcUrl("/payment_gateways/bacs"),
          {
            headers: {
              Accept: "application/json",
              Authorization: wcAuthHeader(),
            },
            cache: "no-store",
          }
        );

        if (wcResponse.ok) {
          const bacs =
            (await wcResponse.json()) as WooBacsGateway;

          // Only add BACS when enabled in WooCommerce.
          if (
            bacs.id === "bacs" &&
            bacs.enabled === true
          ) {
            gateways.push({
              id: "bacs",
              title: bacs.title || "Direct Bank Transfer",
              description: bacs.description || "",
              enabled: true,
              requires_account: false,
            });
          }
        }
      } catch {
        // Keep existing gateways if the BACS lookup fails.
      }
    }

    // Return the original response structure.
    if (Array.isArray(data)) {
      return NextResponse.json(gateways);
    }

    if (typeof data === "object" && data !== null) {
      return NextResponse.json({
        ...data,
        gateways,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load payment gateways.",
        gateways: [],
      },
      {
        status: 500,
      }
    );
  }
}
