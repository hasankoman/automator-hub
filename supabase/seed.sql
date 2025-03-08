-- Seed initial data for the application

-- Insert default plans
INSERT INTO plans (name, description, price, features, manual_readme_update_limit, auto_readme_update_limit, allow_branch_selection, allow_auto_readme, is_active, is_free, coming_soon, recommended)
VALUES 
  ('Free', 'Basic features for getting started', 0, ARRAY['{"feature": "Up to 10 manual README updates per month"}', '{"feature": "GitHub integration"}'], 10, 0, false, false, true, true, false, false),
  ('Pro', 'All features for individuals', 9.99, ARRAY['{"feature": "Unlimited manual README updates"}', '{"feature": "Branch selection"}', '{"feature": "Priority support"}'], 999999, 0, true, false, true, false, false, true),
  ('Enterprise', 'For teams and companies', 29.99, ARRAY['{"feature": "Unlimited manual README updates"}', '{"feature": "Branch selection"}', '{"feature": "Auto README updates"}', '{"feature": "Priority support"}', '{"feature": "Team management"}'], 999999, 999999, true, true, true, false, false, false)
ON CONFLICT (name) DO NOTHING; 