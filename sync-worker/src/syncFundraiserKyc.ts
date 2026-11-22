import { Env, fetchAllPages } from "./utils";

export async function syncFundraiserKyc(env: Env, WP_URL: string, headers: Record<string, string>) {
  // Fetch all KYC records (endpoint handles pagination natively)
  const data = await fetchAllPages(`${WP_URL}/fundraiser/kyc`, headers, 100);
  if (data.length === 0) return;

  const stmt = env.growfund_db.prepare(`
    INSERT INTO fundraiser_kyc (
      user_id, first_name, last_name, email, gfcm_kyc_type, gfcm_kyc_payout_method, 
      gfcm_kyc_mobile_provider, gfcm_kyc_payout_currency, gfcm_kyc_payout_currency_org, 
      gfcm_kyc_mobile_name, gfcm_kyc_mobile_number, gfcm_kyc_bank_name, 
      gfcm_kyc_bank_account_name, gfcm_kyc_bank_account_number, gfcm_kyc_beneficiary_name, 
      gfcm_kyc_beneficiary_relation, gfcm_kyc_beneficiary_contact, gfcm_kyc_recipient_type, 
      gfcm_kyc_org_name, gfcm_kyc_org_type, gfcm_kyc_org_reg_number, gfcm_kyc_org_website, 
      gfcm_kyc_contact_name, gfcm_kyc_contact_phone, gfcm_kyc_contact_address, 
      gfcm_kyc_contact_city, gfcm_kyc_rep_name, gfcm_kyc_rep_role, gfcm_kyc_rep_phone, 
      gfcm_kyc_rep_address, gfcm_kyc_rep_city, gfcm_kyc_id_number, 
      gfcm_kyc_fundraiser_id_number, gfcm_kyc_auth_id_number, gfcm_kyc_id_upload, 
      gfcm_kyc_fundraiser_id, gfcm_kyc_org_cert, gfcm_kyc_auth_id, gfcm_kyc_consent, 
      kyc_status, growfund_status, submitted_date, last_synced_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(user_id) DO UPDATE SET
      first_name=excluded.first_name, last_name=excluded.last_name, email=excluded.email, 
      gfcm_kyc_type=excluded.gfcm_kyc_type, gfcm_kyc_payout_method=excluded.gfcm_kyc_payout_method, 
      gfcm_kyc_mobile_provider=excluded.gfcm_kyc_mobile_provider, gfcm_kyc_payout_currency=excluded.gfcm_kyc_payout_currency, 
      gfcm_kyc_payout_currency_org=excluded.gfcm_kyc_payout_currency_org, gfcm_kyc_mobile_name=excluded.gfcm_kyc_mobile_name, 
      gfcm_kyc_mobile_number=excluded.gfcm_kyc_mobile_number, gfcm_kyc_bank_name=excluded.gfcm_kyc_bank_name, 
      gfcm_kyc_bank_account_name=excluded.gfcm_kyc_bank_account_name, gfcm_kyc_bank_account_number=excluded.gfcm_kyc_bank_account_number, 
      gfcm_kyc_beneficiary_name=excluded.gfcm_kyc_beneficiary_name, gfcm_kyc_beneficiary_relation=excluded.gfcm_kyc_beneficiary_relation, 
      gfcm_kyc_beneficiary_contact=excluded.gfcm_kyc_beneficiary_contact, gfcm_kyc_recipient_type=excluded.gfcm_kyc_recipient_type, 
      gfcm_kyc_org_name=excluded.gfcm_kyc_org_name, gfcm_kyc_org_type=excluded.gfcm_kyc_org_type, 
      gfcm_kyc_org_reg_number=excluded.gfcm_kyc_org_reg_number, gfcm_kyc_org_website=excluded.gfcm_kyc_org_website, 
      gfcm_kyc_contact_name=excluded.gfcm_kyc_contact_name, gfcm_kyc_contact_phone=excluded.gfcm_kyc_contact_phone, 
      gfcm_kyc_contact_address=excluded.gfcm_kyc_contact_address, gfcm_kyc_contact_city=excluded.gfcm_kyc_contact_city, 
      gfcm_kyc_rep_name=excluded.gfcm_kyc_rep_name, gfcm_kyc_rep_role=excluded.gfcm_kyc_rep_role, 
      gfcm_kyc_rep_phone=excluded.gfcm_kyc_rep_phone, gfcm_kyc_rep_address=excluded.gfcm_kyc_rep_address, 
      gfcm_kyc_rep_city=excluded.gfcm_kyc_rep_city, gfcm_kyc_id_number=excluded.gfcm_kyc_id_number, 
      gfcm_kyc_fundraiser_id_number=excluded.gfcm_kyc_fundraiser_id_number, gfcm_kyc_auth_id_number=excluded.gfcm_kyc_auth_id_number, 
      gfcm_kyc_id_upload=excluded.gfcm_kyc_id_upload, gfcm_kyc_fundraiser_id=excluded.gfcm_kyc_fundraiser_id, 
      gfcm_kyc_org_cert=excluded.gfcm_kyc_org_cert, gfcm_kyc_auth_id=excluded.gfcm_kyc_auth_id, 
      gfcm_kyc_consent=excluded.gfcm_kyc_consent, kyc_status=excluded.kyc_status, 
      growfund_status=excluded.growfund_status, submitted_date=excluded.submitted_date, 
      last_synced_at=CURRENT_TIMESTAMP
  `);

  const batch = [];
  for (const k of data) {
    batch.push(
      stmt.bind(
        Number(k.user_id),
        k.first_name ?? "",
        k.last_name ?? "",
        k.email ?? "",
        k.gfcm_kyc_type ?? "",
        k.gfcm_kyc_payout_method ?? "",
        k.gfcm_kyc_mobile_provider ?? "",
        k.gfcm_kyc_payout_currency ?? "",
        k.gfcm_kyc_payout_currency_org ?? "",
        k.gfcm_kyc_mobile_name ?? "",
        k.gfcm_kyc_mobile_number ?? "",
        k.gfcm_kyc_bank_name ?? "",
        k.gfcm_kyc_bank_account_name ?? "",
        k.gfcm_kyc_bank_account_number ?? "",
        k.gfcm_kyc_beneficiary_name ?? "",
        k.gfcm_kyc_beneficiary_relation ?? "",
        k.gfcm_kyc_beneficiary_contact ?? "",
        k.gfcm_kyc_recipient_type ?? "",
        k.gfcm_kyc_org_name ?? "",
        k.gfcm_kyc_org_type ?? "",
        k.gfcm_kyc_org_reg_number ?? "",
        k.gfcm_kyc_org_website ?? "",
        k.gfcm_kyc_contact_name ?? "",
        k.gfcm_kyc_contact_phone ?? "",
        k.gfcm_kyc_contact_address ?? "",
        k.gfcm_kyc_contact_city ?? "",
        k.gfcm_kyc_rep_name ?? "",
        k.gfcm_kyc_rep_role ?? "",
        k.gfcm_kyc_rep_phone ?? "",
        k.gfcm_kyc_rep_address ?? "",
        k.gfcm_kyc_rep_city ?? "",
        k.gfcm_kyc_id_number ?? "",
        k.gfcm_kyc_fundraiser_id_number ?? "",
        k.gfcm_kyc_auth_id_number ?? "",
        k.gfcm_kyc_id_upload ?? "",
        k.gfcm_kyc_fundraiser_id ?? "",
        k.gfcm_kyc_org_cert ?? "",
        k.gfcm_kyc_auth_id ?? "",
        k.gfcm_kyc_consent ?? "",
        k.kyc_status ?? "",
        k.growfund_status ?? "",
        k.submitted_date ?? ""
      )
    );
  }

  if (batch.length > 0) {
    await env.growfund_db.batch(batch);
  }
}