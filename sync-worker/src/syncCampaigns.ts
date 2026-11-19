import { Env, fetchAllPages } from "./utils";

export async function syncCampaigns(env: Env, WP_URL: string, headers: Record<string, string>) {
  const [activeCampaigns, trashedCampaigns] = await Promise.all([
    fetchAllPages(`${WP_URL}/campaigns?status=all`, headers, 100),
    fetchAllPages(`${WP_URL}/campaigns?status=trashed`, headers, 100)
  ]);
  
  const data = [...activeCampaigns, ...trashedCampaigns];
  if (data.length === 0) return;

  const stmt = env.growfund_db.prepare(`
    INSERT INTO campaigns (
      id, title, slug, description, story, images, video, is_featured, category, sub_category, 
      start_date, end_date, location, tags, collaborators, show_collaborator_list, status, risk, 
      has_goal, is_half_goal_achieved_already, goal_type, goal_amount, reaching_action, confirmation_title, 
      confirmation_description, provide_confirmation_pdf_receipt, number_of_contributors, number_of_contributions, 
      appreciation_type, giving_thanks, rewards, allow_local_pickup, is_ready_for_pickup, allow_pledge_without_reward, 
      min_pledge_amount, max_pledge_amount, uncharged_pledge_count, is_backed, is_paused, is_hidden, tribute_options, 
      last_decline_reason, author, fundraiser, is_interactive, is_launched, is_ended, fund_raised, number_of_individual_contributions, 
      preview_url, allow_custom_donation, min_donation_amount, max_donation_amount, suggested_option_type, suggested_options, 
      has_tribute, tribute_requirement, tribute_title, tribute_notification_preference, fund_selection_type, default_fund, fund_choices, faqs, is_bookmarked, last_synced_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title, slug=excluded.slug, description=excluded.description, story=excluded.story, images=excluded.images, video=excluded.video, is_featured=excluded.is_featured, category=excluded.category, sub_category=excluded.sub_category, 
      start_date=excluded.start_date, end_date=excluded.end_date, location=excluded.location, tags=excluded.tags, collaborators=excluded.collaborators, show_collaborator_list=excluded.show_collaborator_list, status=excluded.status, risk=excluded.risk, 
      has_goal=excluded.has_goal, is_half_goal_achieved_already=excluded.is_half_goal_achieved_already, goal_type=excluded.goal_type, goal_amount=excluded.goal_amount, reaching_action=excluded.reaching_action, confirmation_title=excluded.confirmation_title, 
      confirmation_description=excluded.confirmation_description, provide_confirmation_pdf_receipt=excluded.provide_confirmation_pdf_receipt, number_of_contributors=excluded.number_of_contributors, number_of_contributions=excluded.number_of_contributions, 
      appreciation_type=excluded.appreciation_type, giving_thanks=excluded.giving_thanks, rewards=excluded.rewards, allow_local_pickup=excluded.allow_local_pickup, is_ready_for_pickup=excluded.is_ready_for_pickup, allow_pledge_without_reward=excluded.allow_pledge_without_reward, 
      min_pledge_amount=excluded.min_pledge_amount, max_pledge_amount=excluded.max_pledge_amount, uncharged_pledge_count=excluded.uncharged_pledge_count, is_backed=excluded.is_backed, is_paused=excluded.is_paused, is_hidden=excluded.is_hidden, tribute_options=excluded.tribute_options, 
      last_decline_reason=excluded.last_decline_reason, author=excluded.author, fundraiser=excluded.fundraiser, is_interactive=excluded.is_interactive, is_launched=excluded.is_launched, is_ended=excluded.is_ended, fund_raised=excluded.fund_raised, number_of_individual_contributions=excluded.number_of_individual_contributions, 
      preview_url=excluded.preview_url, allow_custom_donation=excluded.allow_custom_donation, min_donation_amount=excluded.min_donation_amount, max_donation_amount=excluded.max_donation_amount, suggested_option_type=excluded.suggested_option_type, suggested_options=excluded.suggested_options, 
      has_tribute=excluded.has_tribute, tribute_requirement=excluded.tribute_requirement, tribute_title=excluded.tribute_title, tribute_notification_preference=excluded.tribute_notification_preference, fund_selection_type=excluded.fund_selection_type, default_fund=excluded.default_fund, fund_choices=excluded.fund_choices, faqs=excluded.faqs, is_bookmarked=excluded.is_bookmarked, last_synced_at=CURRENT_TIMESTAMP
  `);

  const batch = [];
  for (const c of data) {
    batch.push(
      stmt.bind(
        Number(c.id), c.title, c.slug, c.description, c.story, 
        c.images ? JSON.stringify(c.images) : '[]', 
        c.video ? JSON.stringify(c.video) : null, 
        c.is_featured ? 1 : 0, c.category, c.sub_category, 
        c.start_date, c.end_date, c.location, 
        c.tags ? JSON.stringify(c.tags) : '[]', 
        c.collaborators ? JSON.stringify(c.collaborators) : '[]', 
        c.show_collaborator_list ? 1 : 0, c.status, c.risk, 
        c.has_goal ? 1 : 0, c.is_half_goal_achieved_already ? 1 : 0, c.goal_type, Number(c.goal_amount || 0), c.reaching_action, c.confirmation_title, 
        c.confirmation_description, c.provide_confirmation_pdf_receipt ? 1 : 0, Number(c.number_of_contributors || 0), Number(c.number_of_contributions || 0), 
        c.appreciation_type, c.giving_thanks, 
        c.rewards ? JSON.stringify(c.rewards) : null, 
        c.allow_local_pickup ? 1 : 0, c.is_ready_for_pickup ? 1 : 0, c.allow_pledge_without_reward ? 1 : 0, 
        c.min_pledge_amount, c.max_pledge_amount, c.uncharged_pledge_count, c.is_backed ? 1 : 0, c.is_paused ? 1 : 0, c.is_hidden ? 1 : 0, 
        c.tribute_options ? JSON.stringify(c.tribute_options) : '[]', 
        c.last_decline_reason, 
        c.author ? JSON.stringify(c.author) : null, 
        c.fundraiser ? JSON.stringify(c.fundraiser) : null, 
        c.is_interactive ? 1 : 0, c.is_launched ? 1 : 0, c.is_ended ? 1 : 0, Number(c.fund_raised || 0), Number(c.number_of_individual_contributions || 0), 
        c.preview_url, c.allow_custom_donation ? 1 : 0, Number(c.min_donation_amount || 0), Number(c.max_donation_amount || 0), c.suggested_option_type, 
        c.suggested_options ? JSON.stringify(c.suggested_options) : '[]', 
        c.has_tribute ? 1 : 0, c.tribute_requirement, c.tribute_title, c.tribute_notification_preference, c.fund_selection_type, 
        c.default_fund ? JSON.stringify(c.default_fund) : null, 
        c.fund_choices ? JSON.stringify(c.fund_choices) : null, 
        c.faqs ? JSON.stringify(c.faqs) : '[]', 
        c.is_bookmarked ? 1 : 0
      )
    );
  }
  if (batch.length > 0) await env.growfund_db.batch(batch);
}