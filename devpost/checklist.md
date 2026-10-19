---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Current Build State

Slice 1 passed all eight Vitest storage checks and the production build. The learner ran the app from a regular terminal, completed draft reload/resume, review correction, save/readback, and approved the early checkpoint. Saved-log editing was requested and clarified as already planned in slice 3. Agent browser inspection remains constrained by the session; do not claim keyboard or reduced-motion browser checks were performed.

All three slices are committed: `f96d2c9`, `633e831`, and `fb07f34`. All 16 tests and the production build pass. The learner accepted the behavior and appearance and committed the final slice after being asked to do so if the current PoC was ready. Deferred improvements are saved separately. A brief evidence-based recap and the offline app map complete the learning wrap-up; no interactive code tour is claimed. Final documentation updates still need committing from the regular terminal because this session cannot write `.git`.

Direct Node checks passed for draft reload, completed save/readback, snapshot immutability, refusal of unconfirmed replacement, failed-write protection, malformed-data rejection, and basic calendar validity. Text and action contrast checks passed (5.47:1 or higher for tested pairs). These checks do not replace the pending framework build, full test suite, or browser verification.

## Slices

- [x] **1. Complete a guided log and reopen the saved answers**
  Becomes usable: A calm home screen leads through today's six prompts, editable review, durable save, a warm completion, and a view of the saved day. Unfinished answers survive reload.
  Why now: Proves the unique guided-writing kernel and browser persistence together, including the risk that a failed write could lose answers or falsely report success.
  PRD ref: `prd.md > The Core Journey` (steps 1–6), `Six Guided Prompts`, `Review and Save`, `Keep and Resume Drafts`, `States and Boundaries`.
  Spec ref: `spec.md > Stack`, `Where It Runs and How Someone Tries It`, `Look and Feel`, `Components`, `Data Model`, `File Structure`, `Important Failure Modes`.
  Build: Scaffold React/Vite with plain CSS, fixed port 5173, the six prompt definitions, Home, GuidedEntry, Review, Completion, and read-only SavedLog. Implement validated snapshot storage, immediate draft updates, resumption of today's draft, retryable persistence errors, and one-write completed saves. Start empty; preserve unreadable stored data. Add focused storage tests and setup instructions.
  Verify (mechanical): Run `npm.cmd test -- --run` for storage validation, thrown-write protection, successful save and draft removal; run `npm.cmd run build`; start the server and exercise six prompts including blanks, review correction, save/readback, and reload/resume in a browser. Check focus, reduced motion, and palette contrast on these screens.
  Learner check: Open `http://localhost:5173`, enter a few answers, reload partway, resume, finish all six prompts, change an answer in review, save, and open the saved day. Report how the writing flow feels and whether anything is confusing.
  Commit: `Add persistent guided daily logging`

- [x] **2. Catch up on past days and find work by week**
  Becomes usable: Select today or a past date, resume unfinished days under Profile → Drafts, and retrieve saved answers through Profile → Logs → week → day.
  Why now: Builds the look-back purpose on real saved logs after early feedback on writing; calendar checks establish reliable grouping before replacement actions are added.
  PRD ref: `prd.md > Choose a Date and Catch Up`, `Browse Logs by Week and Day`, `Keep and Resume Drafts`.
  Spec ref: `spec.md > Components` (DatePicker and Draft Selection, LogsBrowser and SavedLog, DraftsBrowser, Calendar Utilities), `Data Model`, `Verification and Demo Data`.
  Build: Add past-date selection with future/invalid-date rejection, fixed entry dates, Profile navigation, all-date draft resumption, week/day browsing, immutable first-use Monday, and date-range labels before first use. Only show saved days and populated weeks; provide empty-state start actions. Offer viewing an existing saved day rather than silently replacing it.
  Verify (mechanical): Run `npm.cmd test -- --run` including calendar tests for Monday/Sunday, skipped weeks, year boundaries, daylight-saving dates, local today, and pre-first-use dates; run `npm.cmd run build`; exercise catch-up, reload/resume for a past date, empty states, and week/day retrieval in the browser.
  Learner check: Save a fictional catch-up log for a past day, leave another past day unfinished, reload, resume it from Drafts, and find the saved day through Logs and its week. Confirm that the dates and week labels make sense.
  Commit: `Add catch-up dates and week-based history`

- [x] **3. Safely edit or start over on a saved day**
  Becomes usable: Every saved day offers Edit and Start Over; the old log remains intact until a confirmed replacement successfully saves.
  Why now: Replacement is easiest to assess once past-day retrieval works, and completes the core journey without expanding the approved boundary.
  PRD ref: `prd.md > Edit or Replace an Existing Daily Log`, `Review and Save`, `States and Boundaries`.
  Spec ref: `spec.md > Components` (DatePicker and Draft Selection, Review and OverwriteDialog, LogsBrowser and SavedLog, Storage Repository), `Data Model`, `Important Failure Modes`, `Verification and Demo Data`.
  Build: Add the top-right menu with exactly Edit and Start Over, preserve the selected saved date, reuse any existing draft with an explanation, and add a keyboard-operable overwrite dialog with focus containment/restoration. Preserve createdAt; cancellation and failed saves protect old data. Complete README demo instructions using two or three fictional entries entered through the real flow, without automatic seeding.
  Verify (mechanical): Run `npm.cmd test -- --run` for replacement cancellation, failed replacement writes, createdAt preservation, one entry per day, and unrelated-draft preservation; run `npm.cmd run build`; exercise Edit, Start Over, existing-draft resumption, cancellation/Escape, confirmed replacement, and keyboard dialog behavior in the browser.
  Learner check: Open a saved past day, edit it, cancel overwriting, and confirm the old answers remain. Then save a confirmed replacement. Try Start Over and leave without saving; confirm the saved day is still intact.
  Commit: `Add protected editing and replacement of saved logs`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1; learner completed the walkthrough and confirmed “everything looks good then.” Saved-log editing remains planned in slice 3.
- [x] Final kick-the-tires exploration and feedback completed — learner reports behavior matches the agreed plan and likes the appearance; logo, dark mode, and discard improvements are explicitly deferred.

Learn mode includes a learner check after every slice. Fast mode pauses at the early and final checkpoints; slice 2's learner check is available during final exploration.

## Final Review

Verify the running app against the PRD acceptance criteria, including empty states, blanks, catch-up, drafts, replacement protection, persistence errors, keyboard use, and reduced motion. Record agreed refinements below as unchecked tasks; verify, commit, and have the learner retry them before completion.

Mechanical evidence: 16 tests pass across storage and calendar; production build succeeds. Storage checks cover draft retention, unsupported/malformed data, new-save failure, unconfirmed replacement refusal, edit/restart isolation, existing-draft reuse, failed replacement/retry, immutable first-use anchor, createdAt preservation, and unrelated-draft protection. Learner reports the app works as discussed after the final review prompt. Detailed keyboard/reduced-motion checks were not individually reported and agent browser checks remain unavailable.

Feedback outcome: current appearance and behavior accepted. Logo replacement, dark mode, and a discard button are saved in `devpost/improvements.md` for another session. No current revision requested. The learner committed slice 3 after the explicit “If the current proof of concept is ready” instruction; commit verified as `fb07f34`.

- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — brief evidence-based recap
- [x] Optional edit and transfer reflection addressed — no edit; improvements deferred; optional reflection offered without requiring a response
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Brief recap delivered connecting the protected-replacement requirement, `saveDraft`, and the passing failed-write/retry test to a reusable practice for future discard behavior. App map checked offline: referenced paths and source anchors exist, section tags balance, no scripts or external resources. Linked and explained when learner asked what an app map is; updated to source commit `fb07f34`. Browser inspection unavailable; no hands-on code-navigation claim.
Route and stops: Reference-only route: `src/App.jsx > save`, `src/lib/storage.js > saveDraft`, `src/components/Completion.jsx`. No interactive tour performed.
Edit outcome: No edit made; learner deferred improvements to another session.
Reflection: Optional transfer question offered; no response required. Any personal answer belongs only in the ignored learner profile.
Activity mode: Brief recap with an offline reference map.

## Revisions

- Use Vite's runner config loader for dev/build/preview/tests — the default config bundler could not traverse an ancestor directory under this session's filesystem restrictions; the runner passes the build and tests with the chosen stack intact.

## Post-PoC Improvements ? 2026-10-18

User requested dark mode and a discard button. Existing fast build mode carries forward. User approved all three discard behaviors: unfinished drafts, edits while preserving the saved log, and deletion of saved logs. The new slice below records this authorized expansion.

- [x] **4. Choose and remember appearance**
  Becomes usable: Header appearance control offers System, Light, and Dark across the app.
  Why now: User selected this deferred improvement.
  PRD ref: `prd.md > Appearance Preference`.
  Spec ref: `spec.md > Appearance Preference`.
  Build: Add isolated preference storage and shared palette variables; follow device changes in System mode. Implemented; user tested and accepted.
  Verify (mechanical): All 24 storage/calendar tests and the production build pass. Browser visual verification remains pending.
  Learner check: Try all three appearances, reload, and inspect writing, history, and dialogs.
  Commit: `Add remembered light and dark appearance` (included in the accepted feature checkpoint).

- [x] **5. Discard drafts, abandon changes, and delete saved logs safely**
  Becomes usable: Remove an unfinished draft, discard edits while keeping saved answers, or delete a saved log while retaining any draft.
  Why now: User explicitly requested all three removal behaviors.
  PRD ref: `prd.md > Discard and Delete`.
  Spec ref: `spec.md > Confirmed Removal`.
  Build: Implemented date-specific confirmation with Cancel/Escape, distinct labels and target maps, retryable write failure, and success-only navigation. Draft controls appear in entry/review and Drafts; deletion appears in the saved-log menu.
  Verify (mechanical): 24 tests pass, including eight new removal cases; production build passes. Browser keyboard/visual verification remains pending.
  Learner check: Using fictional data, cancel and confirm each action, reload to verify removal, and check that the other kind of record and other days remain intact. Try light/dark appearance on confirmation dialogs.
  Commit: `Add protected draft discard and saved log deletion` (included in the accepted feature checkpoint).

Post-PoC hands-on review accepted: after starting the app at http://localhost:5173, the user reported ?works well.? Both requested features are accepted. Mechanical verification: all 24 tests and the production build pass. Detailed keyboard and visual checks were not individually reported. Changes remain uncommitted alongside pre-existing working-tree edits; no new commit is claimed.

## Contribution Heatmap Improvement

User requested implementation of the deferred contribution heatmap after accepting dark mode and discard. Continue fast mode. Implement one usable addition to history using saved dates without scoring answer length or introducing external services.

- [x] **6. See and open saved days in a contribution heatmap**
  Becomes usable: Profile / Logs shows a year calendar of saved days; clicking a filled day opens its reflection.
  Why now: User selected this deferred feature after accepting the previous improvements.
  PRD ref: `prd.md > Contribution Heatmap`.
  Spec ref: `spec.md > Contribution Heatmap`.
  Build: Implemented pure calendar derivation, current/history year selection, count, legend, empty state, today/future styling, accessible date labels, narrow-screen scrolling, theme support and saved-log navigation. Week browsing remains below the chart.
  Verify (mechanical): All 30 tests pass, including six new heatmap cases; production build passes. Browser visual, keyboard and click-through checks remain pending.
  Learner check: Open Profile / Logs, find a filled day and open it. Save a catch-up log and verify its date fills; delete the sample saved log and verify the square clears. Switch appearance and any available historical year; try scrolling the calendar on a narrow window.
  Commit: `Add saved-log contribution heatmap` (included in the accepted feature checkpoint).

Heatmap review accepted: the learner requested all seven weekday labels, the labels were corrected, and the learner confirmed everything looks good and requested saving the changes. All 30 tests and the production build pass. Detailed browser keyboard checks were not individually reported.

## Accepted Feature Checkpoint

The learner accepted dark mode, all three discard actions, the contribution heatmap and the full weekday labels, then requested a Git save. Save the app changes, development feedback integration, visual polish and project documentation together. Local skill installations and agent configuration are outside this app checkpoint; the ignored learner profile and credentials remain excluded.
