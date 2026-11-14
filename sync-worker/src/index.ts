export interface Env {
  growfund_db: D1Database; 
  GROWFUND_CLIENT_API_KEY: string; // <-- Updated to match your .dev.vars
}

export default {
  // 1. Cron Trigger Entry Point (Runs every 5 minutes)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(syncCampaigns(env));
  },

  // 2. HTTP Entry Point (Allows you to manually trigger a sync by visiting the worker URL)
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    try {
      await syncCampaigns(env);
      return new Response("Sync complete!", { status: 200 });
    } catch (e) {
      return new Response(e instanceof Error ? e.message : "Sync failed", { status: 500 });
    }
  }
};

async function syncCampaigns(env: Env) {
  const WP_URL = "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1";
  
  // 1. Get System Token
  const tokenRes = await fetch(`${WP_URL}/auth/system-token`, {
    method: "POST",
    headers: { "X-API-Key": env.GROWFUND_CLIENT_API_KEY }
  });
  const tokenData = await (tokenRes.json() as any);
  const system_access_token = tokenData?.system_access_token;

  if (!system_access_token) throw new Error("Failed to get system token");

  // 2. Fetch Campaigns from WP
  const campaignsRes = await fetch(`${WP_URL}/campaigns?page=1&per_page=100&status=all`, {
    headers: {
      "Authorization": `Bearer ${system_access_token}`,
      "X-API-Key": env.GROWFUND_CLIENT_API_KEY
    }
  });
  const campaignsData = await (campaignsRes.json() as any);
  const data = campaignsData?.data;
  
  if (!data || !Array.isArray(data)) return;

  // 3. Prepare SQL Statement using env.growfund_db
  const stmt = env.growfund_db.prepare(`
    INSERT INTO campaigns (
      id, title, slug, description, story, category, sub_category, location, preview_url, last_decline_reason,
      goal_amount, fund_raised, min_donation_amount, max_donation_amount, has_goal, is_half_goal_achieved_already, goal_type, reaching_action, allow_custom_donation,
      number_of_contributors, number_of_contributions, number_of_individual_contributions, allow_pledge_without_reward, min_pledge_amount, max_pledge_amount, uncharged_pledge_count, is_backed,
      status, is_interactive, is_launched, is_ended, is_paused, is_hidden, is_featured, is_bookmarked,
      allow_local_pickup, is_ready_for_pickup,
      confirmation_title, confirmation_description, provide_confirmation_pdf_receipt, has_tribute, tribute_requirement, tribute_title, tribute_notification_preference,
      fund_selection_type, appreciation_type, giving_thanks,
      start_date, end_date,
      images, video, author, fundraiser, tags, collaborators, suggested_options, faqs, rewards, tribute_options, default_fund, fund_choices,
      risk, show_collaborator_list, suggested_option_type, extra_data, last_synced_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title, slug=excluded.slug, description=excluded.description, story=excluded.story, category=excluded.category, sub_category=excluded.sub_category, location=excluded.location, preview_url=excluded.preview_url, last_decline_reason=excluded.last_decline_reason,
      goal_amount=excluded.goal_amount, fund_raised=excluded.fund_raised, min_donation_amount=excluded.min_donation_amount, max_donation_amount=excluded.max_donation_amount, has_goal=excluded.has_goal, is_half_goal_achieved_already=excluded.is_half_goal_achieved_already, goal_type=excluded.goal_type, reaching_action=excluded.reaching_action, allow_custom_donation=excluded.allow_custom_donation,
      number_of_contributors=excluded.number_of_contributors, number_of_contributions=excluded.number_of_contributions, number_of_individual_contributions=excluded.number_of_individual_contributions, allow_pledge_without_reward=excluded.allow_pledge_without_reward, min_pledge_amount=excluded.min_pledge_amount, max_pledge_amount=excluded.max_pledge_amount, uncharged_pledge_count=excluded.uncharged_pledge_count, is_backed=excluded.is_backed,
      status=excluded.status, is_interactive=excluded.is_interactive, is_launched=excluded.is_launched, is_ended=excluded.is_ended, is_paused=excluded.is_paused, is_hidden=excluded.is_hidden, is_featured=excluded.is_featured, is_bookmarked=excluded.is_bookmarked,
      allow_local_pickup=excluded.allow_local_pickup, is_ready_for_pickup=excluded.is_ready_for_pickup,
      confirmation_title=excluded.confirmation_title, confirmation_description=excluded.confirmation_description, provide_confirmation_pdf_receipt=excluded.provide_confirmation_pdf_receipt, has_tribute=excluded.has_tribute, tribute_requirement=excluded.tribute_requirement, tribute_title=excluded.tribute_title, tribute_notification_preference=excluded.tribute_notification_preference,
      fund_selection_type=excluded.fund_selection_type, appreciation_type=excluded.appreciation_type, giving_thanks=excluded.giving_thanks,
      start_date=excluded.start_date, end_date=excluded.end_date,
      images=excluded.images, video=excluded.video, author=excluded.author, fundraiser=excluded.fundraiser, tags=excluded.tags, collaborators=excluded.collaborators, suggested_options=excluded.suggested_options, faqs=excluded.faqs, rewards=excluded.rewards, tribute_options=excluded.tribute_options, default_fund=excluded.default_fund, fund_choices=excluded.fund_choices,
      risk=excluded.risk, show_collaborator_list=excluded.show_collaborator_list, suggested_option_type=excluded.suggested_option_type, extra_data=excluded.extra_data, last_synced_at=CURRENT_TIMESTAMP
  `);

  const knownKeys = new Set([
    "id", "title", "slug", "description", "story", "category", "sub_category", "location", "preview_url", "last_decline_reason",
    "goal_amount", "fund_raised", "min_donation_amount", "max_donation_amount", "has_goal", "is_half_goal_achieved_already", "goal_type", "reaching_action", "allow_custom_donation",
    "number_of_contributors", "number_of_contributions", "number_of_individual_contributions", "allow_pledge_without_reward", "min_pledge_amount", "max_pledge_amount", "uncharged_pledge_count", "is_backed",
    "status", "is_interactive", "is_launched", "is_ended", "is_paused", "is_hidden", "is_featured", "is_bookmarked",
    "allow_local_pickup", "is_ready_for_pickup",
    "confirmation_title", "confirmation_description", "provide_confirmation_pdf_receipt", "has_tribute", "tribute_requirement", "tribute_title", "tribute_notification_preference",
    "fund_selection_type", "appreciation_type", "giving_thanks",
    "start_date", "end_date",
    "images", "video", "author", "fundraiser", "tags", "collaborators", "suggested_options", "faqs", "rewards", "tribute_options", "default_fund", "fund_choices",
    "risk", "show_collaborator_list", "suggested_option_type"
  ]);

  const batch = [];

  for (const c of data) {
    const extraData: Record<string, any> = {};
    for (const key in c) {
      if (!knownKeys.has(key)) extraData[key] = c[key];
    }

    batch.push(
      stmt.bind(
        c.id, c.title, c.slug, c.description, c.story, c.category, c.sub_category, c.location, c.preview_url, c.last_decline_reason,
        c.goal_amount, c.fund_raised, c.min_donation_amount, c.max_donation_amount, c.has_goal ? 1 : 0, c.is_half_goal_achieved_already ? 1 : 0, c.goal_type, c.reaching_action, c.allow_custom_donation ? 1 : 0,
        c.number_of_contributors, c.number_of_contributions, c.number_of_individual_contributions, c.allow_pledge_without_reward ? 1 : 0, c.min_pledge_amount, c.max_pledge_amount, c.uncharged_pledge_count, c.is_backed ? 1 : 0,
        c.status, c.is_interactive ? 1 : 0, c.is_launched ? 1 : 0, c.is_ended ? 1 : 0, c.is_paused ? 1 : 0, c.is_hidden ? 1 : 0, c.is_featured ? 1 : 0, c.is_bookmarked ? 1 : 0,
        c.allow_local_pickup ? 1 : 0, c.is_ready_for_pickup ? 1 : 0,
        c.confirmation_title, c.confirmation_description, c.provide_confirmation_pdf_receipt ? 1 : 0, c.has_tribute ? 1 : 0, c.tribute_requirement, c.tribute_title, c.tribute_notification_preference,
        c.fund_selection_type, c.appreciation_type, c.giving_thanks,
        c.start_date, c.end_date,
        JSON.stringify(c.images || []), JSON.stringify(c.video || {}), JSON.stringify(c.author || {}), JSON.stringify(c.fundraiser || {}), JSON.stringify(c.tags || []), JSON.stringify(c.collaborators || []), JSON.stringify(c.suggested_options || []), JSON.stringify(c.faqs || []), JSON.stringify(c.rewards || []), JSON.stringify(c.tribute_options || []), JSON.stringify(c.default_fund || {}), JSON.stringify(c.fund_choices || []),
        c.risk, c.show_collaborator_list ? 1 : 0, c.suggested_option_type, JSON.stringify(extraData)
      )
    );
  }

  if (batch.length > 0) {
    await env.growfund_db.batch(batch);
  }
}