# Supabase email accounts

The main course has real Supabase email/password sign-up, email confirmation, sign-in, password reset/update, session restore and local-device sign-out. The official Supabase JavaScript SDK 2.119.2 is bundled locally in js/vendor; its notices are retained.

## Configuration

Browser-safe configuration is in js/ai-agent-auth-config.js. It contains the Project URL and publishable key only. Never insert a secret or service_role key. The code rejects those key formats before initializing the SDK.

Supabase project: AI Agent Lesson (glnudhlvhdnfzphfiisz). Email sign-up is enabled and email confirmation is required. Approved Site URL: https://birkomiller-commits.github.io/reveal.js/ . Additional approved return URL: https://birkomiller-commits.github.io/reveal.js/AI_agent_lesson.html .

## Behavior

- Guest access and offline simulations remain available. Account requests require the hosted HTTPS course (or localhost development); file:// stays in guest mode.
- PKCE email confirmation/reset links must open in the same browser where they were requested. A callback query code is handled by the SDK without colliding with lesson hash routing.
- Passwords are sent to Supabase over HTTPS through the official SDK and are cleared from fields after submission. Application code never stores passwords. Supabase session tokens and PKCE state use browser localStorage; denied storage falls back to memory.
- Initial session restoration selects the local account-progress scope before recording lesson reads. Guest progress remains in its original storage key. Signed-in progress is stored under a separate key per user ID. This implementation does not provide cloud progress synchronization. Existing export/import transfers progress manually.
- All lesson assets remain publicly downloadable on GitHub Pages. Signing in establishes a real identity; it is not an access-control boundary for static HTML files. Any future private database tables need Supabase RLS policies enforcing auth.uid(). No course-data tables were created.
- The UI avoids displaying raw provider errors and gives generic reset/confirmation messages. Rate limits are handled without exposing private provider detail.

## Validation

Run node scripts/verify-ai-agent-auth.mjs. It runs the real bundled SDK against intercepted synthetic provider responses, covering validation, confirmation, sign-in failures/success, session reload, profile isolation, PKCE reset, password update, sign-out, rate limits, secret-key rejection, keyboard close and mobile layout. It sends no real emails and creates no live accounts. Live public settings were checked separately. End-to-end email delivery and a real learner account should be checked by the owner using the published website.

Supabase’s default email service may restrict delivery to organization members. For friend/public sign-ups, configure a production SMTP provider in Supabase before inviting learners. See https://supabase.com/docs/guides/auth/auth-smtp .

## Official references

- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/auth/sessions/pkce-flow
- https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
- https://supabase.com/docs/guides/getting-started/api-keys
