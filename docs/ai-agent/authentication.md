# Supabase email accounts

The main course uses Google sign-in through Supabase, session restore and local-device sign-out. Google creates a lesson identity on first sign-in; no SMTP account is needed for this path. Email/password UI is disabled in the public configuration; its implementation is retained as an optional fallback. The official Supabase JavaScript SDK 2.119.2 is bundled locally in js/vendor; its notices are retained.

## Configuration

Browser-safe configuration is in js/ai-agent-auth-config.js. It contains the Project URL and publishable key only. Never insert a secret or service_role key. The code rejects those key formats before initializing the SDK.

Supabase project: AI Agent Lesson (glnudhlvhdnfzphfiisz). The Google provider requires a Google Web OAuth client configured in Supabase. The lesson checks public provider readiness before redirecting. Approved Site URL: https://birkomiller-commits.github.io/reveal.js/ . Additional approved return URL: https://birkomiller-commits.github.io/reveal.js/AI_agent_lesson.html .

## Behavior

- Guest access and offline simulations remain available. Account requests require the hosted HTTPS course (or localhost development); file:// stays in guest mode.
- Google uses PKCE and only the openid, email and profile scopes. The authorization destination is validated against the configured Supabase origin, provider and exact return URL before navigation. The callback query code is handled by the SDK without colliding with lesson hash routing. Disabled providers and network failures keep the learner on the lesson.
- The optional email/password implementation also supports PKCE confirmation and reset links; those must open in the same browser where requested.
- Passwords are sent to Supabase over HTTPS through the official SDK and are cleared from fields after submission. Application code never stores passwords. Supabase session tokens and PKCE state use browser localStorage; denied storage falls back to memory.
- Initial session restoration selects the local account-progress scope before recording lesson reads. Guest progress remains in its original storage key. Signed-in progress is stored under a separate key per user ID. This implementation does not provide cloud progress synchronization. Existing export/import transfers progress manually.
- All lesson assets remain publicly downloadable on GitHub Pages. Signing in establishes a real identity; it is not an access-control boundary for static HTML files. Any future private database tables need Supabase RLS policies enforcing auth.uid(). No course-data tables were created.
- The UI avoids displaying raw provider errors and gives generic reset/confirmation messages. Rate limits are handled without exposing private provider detail.

## Validation

Run node scripts/verify-ai-agent-google-auth.mjs for the primary flow and node scripts/verify-ai-agent-auth.mjs for the optional email fallback. It runs the real bundled SDK against intercepted synthetic provider responses, covering validation, confirmation, sign-in failures/success, session reload, profile isolation, PKCE reset, password update, sign-out, rate limits, secret-key rejection, keyboard close and mobile layout. It sends no real emails and creates no live accounts. Live public settings were checked separately. End-to-end email delivery and a real learner account should be checked by the owner using the published website.

Google sign-in uses the Google provider and does not call email signup or recovery. A custom SMTP provider is only needed if the owner re-enables email/password confirmation or recovery. Do not disable email verification to work around email delivery.

## One-time Google provider setup

1. Create a Google OAuth Web application client for AI Agent Lesson.
2. Authorized JavaScript origin: https://birkomiller-commits.github.io
3. Authorized redirect URI: https://glnudhlvhdnfzphfiisz.supabase.co/auth/v1/callback
4. Enter the client ID and secret only in Supabase Authentication → Sign In / Providers → Google, enable the provider and save. Never put the client secret in the website, GitHub or chat.
5. For learners beyond test users, confirm Google Auth Platform Audience publishing status permits them. The frontend alone cannot change Google app audience.

The provider setup and an actual account login must be confirmed before claiming live Google login is verified. Synthetic tests do not create Google credentials, consent to scopes or sign in to a real account.

## Official references

- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/auth/sessions/pkce-flow
- https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
- https://supabase.com/docs/guides/getting-started/api-keys

- https://supabase.com/docs/guides/auth/social-sign-in/auth-google
