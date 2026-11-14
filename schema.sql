DROP TABLE IF EXISTS campaigns;

CREATE TABLE campaigns (
    id INTEGER PRIMARY KEY,
    
    -- Basic Info
    title TEXT,
    slug TEXT,
    description TEXT,
    story TEXT,
    category TEXT,
    sub_category TEXT,
    location TEXT,
    preview_url TEXT,
    last_decline_reason TEXT,
    
    -- Financials & Goals
    goal_amount REAL,
    fund_raised REAL,
    min_donation_amount REAL,
    max_donation_amount REAL,
    has_goal BOOLEAN,
    is_half_goal_achieved_already BOOLEAN,
    goal_type TEXT,
    reaching_action TEXT,
    allow_custom_donation BOOLEAN,
    
    -- Contributions & Pledges
    number_of_contributors INTEGER,
    number_of_contributions INTEGER,
    number_of_individual_contributions INTEGER,
    allow_pledge_without_reward BOOLEAN,
    min_pledge_amount REAL,
    max_pledge_amount REAL,
    uncharged_pledge_count INTEGER,
    is_backed BOOLEAN,
    
    -- Status & Toggles
    status TEXT,
    is_interactive BOOLEAN,
    is_launched BOOLEAN,
    is_ended BOOLEAN,
    is_paused BOOLEAN,
    is_hidden BOOLEAN,
    is_featured BOOLEAN,
    is_bookmarked BOOLEAN,
    
    -- Logistics & Delivery
    allow_local_pickup BOOLEAN,
    is_ready_for_pickup BOOLEAN,
    
    -- Confirmations & Tributes
    confirmation_title TEXT,
    confirmation_description TEXT,
    provide_confirmation_pdf_receipt BOOLEAN,
    has_tribute BOOLEAN,
    tribute_requirement TEXT,
    tribute_title TEXT,
    tribute_notification_preference TEXT,
    
    -- Funds & Appreciation
    fund_selection_type TEXT,
    appreciation_type TEXT,
    giving_thanks TEXT,
    
    -- Dates (Stored as ISO TEXT in SQLite)
    start_date TEXT,
    end_date TEXT,
    
    -- Complex Data / JSON (Stored as TEXT)
    images TEXT, 
    video TEXT,
    author TEXT,
    fundraiser TEXT,
    tags TEXT,
    collaborators TEXT,
    suggested_options TEXT,
    faqs TEXT,
    rewards TEXT,
    tribute_options TEXT,
    default_fund TEXT,
    fund_choices TEXT,
    
    -- Unknown fields, risk flags, or future API keys dump
    risk TEXT,
    show_collaborator_list BOOLEAN,
    suggested_option_type TEXT,
    extra_data TEXT, 
    
    -- Metadata
    last_synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for blazing fast Admin Manager filtering
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_campaigns_featured ON campaigns(is_featured);