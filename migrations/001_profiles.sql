CREATE TABLE IF NOT EXISTS profiles (
  id uuid references auth.users(id) NOT NULL PRIMARY KEY,
  stripe_customer_id text,
  subscription_tier text DEFAULT 'free',
  last_check_in_date timestamptz
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
