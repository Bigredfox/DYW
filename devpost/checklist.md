---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Current Build State

Slice 1 passed all eight Vitest storage checks and the production build. The learner ran the app from a regular terminal, completed draft reload/resume, review correction, save/readback, and approved the early checkpoint. Saved-log editing was requested and clarified as already planned in slice 3. Agent browser inspection remains constrained by the session; do not claim keyboard or reduced-motion browser checks were performed.

Slice 1 is committed as `f96d2c9`. Slice 2 is implemented; all 13 tests and the production build pass. The learner's dev server initially served the app (HTTP 200) but stopped before module inspection. Headless Chrome remains unusable for interaction checks in this session. Next: learner browser check of catch-up, past-date draft reload/resume, and week/day retrieval, then commit slice 2 from the regular terminal. This session has read-only access to `.git`; staging is denied. Do not proceed to slice 3 before the slice 2 checkpoint is committed. Empty-state, keyboard, and reduced-motion interaction checks remain for final review.

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

- [ ] **2. Catch up on past days and find work by week**
  Becomes usable: Select today or a past date, resume unfinished days under Profile → Drafts, and retrieve saved answers through Profile → Logs → week → day.
  Why now: Builds the look-back purpose on real saved logs after early feedback on writing; calendar checks establish reliable grouping before replacement actions are added.
  PRD ref: `prd.md > Choose a Date and Catch Up`, `Browse Logs by Week and Day`, `Keep and Resume Drafts`.
  Spec ref: `spec.md > Components` (DatePicker and Draft Selection, LogsBrowser and SavedLog, DraftsBrowser, Calendar Utilities), `Data Model`, `Verification and Demo Data`.
  Build: Add past-date selection with future/invalid-date rejection, fixed entry dates, Profile navigation, all-date draft resumption, week/day browsing, immutable first-use Monday, and date-range labels before first use. Only show saved days and populated weeks; provide empty-state start actions. Offer viewing an existing saved day rather than silently replacing it.
  Verify (mechanical): Run `npm.cmd test -- --run` including calendar tests for Monday/Sunday, skipped weeks, year boundaries, daylight-saving dates, local today, and pre-first-use dates; run `npm.cmd run build`; exercise catch-up, reload/resume for a past date, empty states, and week/day retrieval in the browser.
  Learner check: Save a fictional catch-up log for a past day, leave another past day unfinished, reload, resume it from Drafts, and find the saved day through Logs and its week. Confirm that the dates and week labels make sense.
  Commit: `Add catch-up dates and week-based history`

- [ ] **3. Safely edit or start over on a saved day**
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
- [ ] Final kick-the-tires exploration and feedback completed — after slice 3, using the full core journey and awkward inputs

Learn mode includes a learner check after every slice. Fast mode pauses at the early and final checkpoints; slice 2's learner check is available during final exploration.

## Final Review

Verify the running app against the PRD acceptance criteria, including empty states, blanks, catch-up, drafts, replacement protection, persistence errors, keyboard use, and reduced motion. Record agreed refinements below as unchecked tasks; verify, commit, and have the learner retry them before completion.

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Pending; connect an actual logging behavior to its spec, implementation, and verification.
Route and stops: Pending actual code locations.
Edit outcome: Pending optional safe edit.
Reflection: Not yet offered; personal answers belong only in the ignored learner profile.
Activity mode: Pending guided live app/editor route or suitable focused alternative.

## Revisions

- Use Vite's runner config loader for dev/build/preview/tests — the default config bundler could not traverse an ancestor directory under this session's filesystem restrictions; the runner passes the build and tests with the chosen stack intact.
