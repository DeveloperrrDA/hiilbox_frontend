import { Env } from "./utils";
import { syncCampaigns } from "./syncCampaigns";
import { syncDonations } from "./syncDonations";
import { syncDonors } from "./syncDonors";
import { syncDonorMeta } from "./syncDonorMeta";
import { syncFundraisers } from "./syncFundraisers";
import { syncWithdrawalRequests } from "./syncWithdrawals";
import { syncMetadata } from "./syncMetadata";
import { syncCampaignUpdates } from "./syncCampaignUpdates";
import { syncUsers } from "./syncUsers";
import { syncFundraiserKyc } from "./syncFundraiserKyc";
import { syncFundraiserMeta } from "./syncFundraiserMeta";

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(runSequentialSync(env));
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      runSequentialSync(env).catch(e => console.error("Background sync failed:", e))
    );
    
    return new Response(
      "Sequential sync started in the background! Check your Cloudflare Worker logs to watch the progress in real-time.", 
      { status: 202 }
    );
  }
};

async function runSequentialSync(env: Env) {
  const WP_URL = "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1";
  
  const tokenRes = await fetch(`${WP_URL}/auth/system-token`, {
    method: "POST",
    headers: { "X-API-Key": env.GROWFUND_CLIENT_API_KEY }
  });
  const tokenData = await (tokenRes.json() as any);
  const system_access_token = tokenData?.system_access_token;

  if (!system_access_token) throw new Error("Failed to get system token");

  const headers = {
    "Authorization": `Bearer ${system_access_token}`,
    "X-API-Key": env.GROWFUND_CLIENT_API_KEY
  };

  // Execute strictly one by one to protect Edge memory and CMS limits
  await syncCampaigns(env, WP_URL, headers);
  await syncDonations(env, WP_URL, headers);
  await syncDonors(env, WP_URL, headers);
  await syncDonorMeta(env);
  await syncFundraisers(env, WP_URL, headers);
  await syncFundraiserMeta(env);
  await syncWithdrawalRequests(env, WP_URL, headers);
  await syncMetadata(env, WP_URL, headers);
  await syncCampaignUpdates(env, WP_URL, headers);
  await syncUsers(env, WP_URL, headers);
  await syncFundraiserKyc(env, WP_URL, headers); // <--- Added KYC sync
}