-- Drop the CV link from the profile. cv_url is nullable and the client only
-- renders the CV button when it is set, so nulling it hides the button.

update public.profile
set cv_url = null;
