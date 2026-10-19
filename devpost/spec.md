---
doc: spec
status: approved
---

# Daily Work Log — Technical Spec

## How This Works, In Plain Language

The app runs in your laptop's browser. React displays the welcome, six prompts, review, drafts, and saved history. As you type, the app keeps your unfinished answers in the browser's localStorage. Saving turns those answers into the completed log for the selected day. Later, the app reads that same storage to show your weeks and days.

Vite runs the local development app; CSS supplies the calm styling and fades. There is no Python server, account, or external database. Data belongs to this browser and app address: it survives reopening, but does not sync to another device and can be removed by clearing site data.

## The Core Journey Through the System

Implements `prd.md > The Core Journey`.

1. On first launch, read stored data and retain the Monday of the first-use week. Home greets Michael.
2. Start with today's local calendar date. Before answering, allow selecting a past date; reject future dates. Once entry begins, its date stays fixed.
3. Open an existing draft for that date if present. Otherwise, create a blank draft. If a saved log exists, offer to view it and use its Edit or Start Over menu rather than silently choosing an action.
4. GuidedEntry displays the six prompts in order. Persist answer changes immediately; Done persists the next position, briefly acknowledges completion, and advances with a fade. The sixth Done opens Review.
5. Review shows six editable answers and the selected date. Changes also update the draft.
6. Save builds a new stored snapshot. If a saved entry exists for this date, first open the overwrite dialog. Cancellation returns to review and preserves both saved entry and draft.
7. Commit the saved entry and remove its draft in one storage write. Only after that succeeds, update the displayed saved data and open Completion.
8. Profile → Logs reads saved entries, groups them into Monday–Sunday weeks, and opens a day's six answers. Profile → Drafts resumes the original date, answers, and prompt or review position.

## Stack

| Tool | Purpose and rationale | Documentation |
| --- | --- | --- |
| React and React DOM | Reusable interactive screens; builds on Mikey's brief React experience | [React](https://react.dev/learn) |
| JavaScript with JSX | App logic and component markup; avoid adding another language during this PoC | [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [JSX](https://react.dev/learn/writing-markup-with-jsx) |
| Vite | Local development server and production build | [Vite](https://vite.dev/guide/) |
| Plain CSS | Palette, responsive layout, and transitions without a styling dependency | [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) |
| Browser localStorage | Persistent saved logs and drafts with no service setup | [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) |
| Vitest | Focused checks of persistence failures, replacement, and calendar calculations | [Vitest](https://vitest.dev/guide/) |

React, Vite, and localStorage documentation were checked during the planning conversation. Exact installed versions and Node compatibility remain to be checked at the start of the build; pin resolved dependencies with package-lock.json. Use a supported Node LTS that meets Vite's documented requirement. Vitest is an agent-derived verification choice, not a learner-requested feature.

## Where It Runs and How Someone Tries It

Run on this Windows laptop using Node.js and npm. No keys or service accounts are needed. Planned commands from the project root:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`. Configure Vite to use port 5173 with strictPort so a busy port does not silently change the storage address. Use the same browser profile and address when returning. Validation commands: `npm test -- --run` and `npm run build`.

The required short demo video shows a new log, review/save, and retrieval of a past day. A public GitHub repository accompanies the video. Deployment is deferred by the learner; a web link can come later.

## Look and Feel

Implements `prd.md > Look and Feel`; carries forward `scope.md > Inspiration & Identity`.

Agent-proposed review defaults: soft blue background (#EFF7FB), light paper panels (#FFFFFF), deep blue text (#193D50), muted blue text (#496879), and dark teal actions (#236B78). Use system Segoe UI/sans-serif, spacious cards, readable text, and a comfortable writing area. Check actual text/button contrast during the build. Desktop-first with a usable narrow-screen layout.

Home uses a fixed configurable display name, Michael, without name setup or accounts. Copy is warm and concise. A roughly 200 ms fade and brief acknowledgment follow Done; respect prefers-reduced-motion and avoid delaying navigation unnecessarily. Use visible focus styles, labeled fields, keyboard-operable menus/dialogs, prompt progress, and clear blank-answer labels. The HTML companion is a planning view, not the application design.

## Components

### AppShell and Home

Own in-memory navigation, the loaded storage snapshot, current draft, and save/error status. Home provides the greeting, start action, and Profile navigation with Logs and Drafts. Simple screen selection is sufficient; no router dependency is required. Reload returns to Home, while drafts retain progress.

Implements `prd.md > Welcome and Start Today's Log` and `Keep and Resume Drafts`.

### DatePicker and Draft Selection

Default to the laptop's local date; allow earlier dates before creating a draft. Never derive today's date by truncating a UTC timestamp. One draft per date avoids duplicate unfinished work. Opening an existing draft resumes it; Edit or Start Over on a saved log also resumes that date's draft if one already exists, with a clear message that unfinished work was found. It does not erase an existing draft.

Implements `prd.md > Choose a Date and Catch Up` and `Keep and Resume Drafts`.

### GuidedEntry

Use a shared six-item prompt definition: work done, skills learned, obstacles, how they were overcome, resources, and people spoken to. All answers are text and optional. Done advances explicitly; typing never advances. Preserve progress before the transition and prevent repeated clicks from skipping prompts. OS dictation works as ordinary text input.

Implements `prd.md > Six Guided Prompts`.

### Review and OverwriteDialog

Review renders all six editable fields and date. Save either commits a new entry or opens the confirmation dialog for an existing date. No success screen until durable storage succeeds. Escape or Cancel closes the dialog without replacement. Keep focus within the open dialog and restore it when closing.

Implements `prd.md > Review and Save` and `Edit or Replace an Existing Daily Log`.

### Completion

Show a warm thank-you after persistence succeeds, with actions to return Home or view the saved log. Keep text appropriate to catch-up entries as well as today's entry.

Implements `prd.md > Review and Save`.

### LogsBrowser and SavedLog

Show only weeks containing saved logs, newest first; days within a week appear chronologically. Week numbering is computed from the immutable first-use Monday and advances through empty weeks. SavedLog shows date and six answers, marking blanks as “No answer.” Its top-right menu offers Edit, Start Over, and Delete saved log. Edit copies saved answers into a new draft; Start Over creates blank answers. Neither changes the saved entry until confirmed Save.

For catch-up dates before first use, keep the first-use anchor unchanged and label their groups with the Monday–Sunday date range and “Before first use,” rather than displaying zero or negative week numbers. This is an agent-proposed resolution of a PRD edge case for review. Normal weeks retain Week 1, Week 2, etc.

Implements `prd.md > Browse Logs by Week and Day` and `Edit or Replace an Existing Daily Log`.

### DraftsBrowser

List unfinished days with last-updated time and progress. Resume their original date and next prompt or review. Saving removes that date's draft. Empty Drafts gives a short explanation and a start action. Each draft also offers confirmed Discard draft, labeled Discard changes when a saved log exists for the date.

Implements `prd.md > Keep and Resume Drafts`.

### Storage Repository

Centralize read, validation, draft writes, and completed-save writes. Serialize one application snapshot under `daily-work-log:v1`. Build the next snapshot separately and call setItem once; only publish it to React after success. This keeps saved entries and draft removal consistent. If a write throws, retain the current entered answers in memory and report failure with retry. The existing durable snapshot remains intact.

Implements `prd.md > Review and Save`, `Keep and Resume Drafts`, and `States and Boundaries`.

### Calendar Utilities

Store log dates as YYYY-MM-DD calendar strings. Compute Mondays and week differences using calendar arithmetic independent of daylight-saving hour changes. Persist the first-use Monday once, even if the first action is a catch-up entry. Editing never changes a log's date or its week.

Implements `prd.md > Choose a Date and Catch Up` and `Browse Logs by Week and Day`.

## Data Model

One JSON snapshot:

```js
{
  schemaVersion: 1,
  firstUseMonday: "2026-09-28",
  savedByDate: {
    "2026-10-02": {
      date: "2026-10-02",
      answers: ["", "", "", "", "", ""],
      createdAt: "ISO timestamp",
      updatedAt: "ISO timestamp"
    }
  },
  draftsByDate: {
    "2026-10-04": {
      date: "2026-10-04",
      answers: ["", "", "", "", "", ""],
      mode: "new", // new | edit | restart
      stage: "prompt", // prompt | review
      promptIndex: 0, // 0 through 5
      updatedAt: "ISO timestamp"
    }
  }
}
```

Dates are keys enforcing at most one saved log and one draft per day. Saved records and drafts are separate; draft writes never replace saved work. Preserve createdAt when replacing a saved entry. Timestamps describe writing activity; log date controls history grouping. Validate version, dates, answer counts/types, and progress on read.

The display name and prompt labels live in code. Navigation, open menus, confirmation state, and transition state live only in React and reset on reload. Answers and draft progress persist immediately on changes. If persistence fails, warn that the latest changes are only retained in the current tab and offer retry; do not claim those changes will survive closing it.

Single active tab is the supported PoC usage; cross-tab conflict resolution is deferred.

## File Structure

```text
DYW/
├── index.html                 # Browser entry
├── package.json               # Dependencies and dev/build/test commands
├── package-lock.json          # Resolved versions
├── vite.config.js             # React plugin, fixed port, test configuration
├── README.md                  # Setup, storage limits, demo instructions
├── src/
│   ├── main.jsx               # Mount React
│   ├── App.jsx                # AppShell, navigation, loaded data and actions
│   ├── config.js              # Fixed name and six prompt definitions
│   ├── styles.css             # Palette, layout, transitions, accessibility
│   ├── components/
│   │   ├── Home.jsx           # Welcome and Profile navigation
│   │   ├── DatePicker.jsx     # Choose log date
│   │   ├── GuidedEntry.jsx    # One prompt at a time
│   │   ├── Review.jsx         # Six editable answers
│   │   ├── OverwriteDialog.jsx # Confirm replacement
│   │   ├── Completion.jsx     # Successful-save message
│   │   ├── LogsBrowser.jsx    # Weeks and logged days
│   │   ├── SavedLog.jsx       # Read-only entry with Edit/Start Over menu
│   │   └── DraftsBrowser.jsx  # Resume unfinished entries
│   └── lib/
│       ├── storage.js         # Validated snapshot persistence
│       ├── calendar.js        # Local dates, week grouping and labels
│       ├── storage.test.js    # Failure and replacement protection
│       └── calendar.test.js   # Week boundaries and catch-up dates
└── devpost/                   # Canonical planning docs and HTML companions
```

Keep existing skill files and planning documents. Generated node_modules and dist are ignored. No backend directory is needed.

## External Services and Dependencies

No runtime external API, hosted database, fonts, analytics, or authentication. The app makes no service calls for log data. npm network access is required for initial installation; dependencies are listed in Stack. Logs stay local. No API keys or per-request costs apply. Offline use of the already-running local app does not require service access.

## Important Failure Modes

- **Storage unavailable or full:** catch read/write errors, retain entered text in memory, explain that persistence failed, and offer retry. Protect existing saved entries and withhold success. Failure to retain drafts is visible immediately.
- **Malformed or unsupported stored data:** show a recoverable error without overwriting the raw stored value or auto-resetting it. Explain that existing data could not be read; inspect/recover it during the build rather than silently discarding history.
- **Invalid date or calendar boundary:** reject invalid/future selections before draft creation; test Monday boundaries, year changes, daylight-saving transitions, and dates before first use.

## Verification and Demo Data

Automated checks cover calendar week numbering and storage commits: replacement cancellation keeps the old log; a thrown write keeps the prior snapshot and draft; successful save removes only the matching draft and leaves one saved log for the date.

Manual acceptance walkthrough covers all six prompts including blanks; review correction; reload and resume; catch-up; safe Edit and Start Over; keyboard navigation; reduced motion; and no-history states. Use `prd.md` acceptance criteria as the final checklist.

Prepare enough demo history by entering two or three clearly identified sample logs through the real catch-up flow. Demo content is fictional and described as sample data in README/video context; normal first use starts empty. No automatic seeding or fabricated full-year history.

## What Was Simplified and Why

- Browser storage keeps the approved personal PoC within one application. A Python backend and database are deferred until a later storage need justifies them.
- Fixed display name avoids adding setup or accounts to the greeting.
- Local running meets the learner's choice; optional hosting comes later.
- Simple in-memory navigation avoids adding routing infrastructure to a small screen flow.
- No AI, dictation service, attachments, or additional profile features; the kernel is real guided logging and retrieval.

## Decisions and Open Issues

**Learner agreed:** React, JavaScript, Vite, plain CSS, localStorage; local running now, web link later. Experience: mostly Python backend work, brief React use; willing to practice React. Browser-specific storage tradeoff was explained before agreement. Learning goal remains working with agents and spec-driven development.

**Agent-derived implementation details for review:** fixed Michael greeting, blue palette, one draft per date, immediate draft persistence, fixed local address, no routing library, targeted tests, and date-range labels for history before first use. These are defaults, not preferences attributed to the learner.

**Learning uncertainty:** none identified. Asked what part of the approach needed clarification; learner replied “sounds good to me.” The draft/save/storage walkthrough was accepted; no extra technology or exercise added.

**Build-time checks:** installed Node/npm availability, compatible dependency versions, actual contrast and keyboard behavior, and the focused persistence/calendar tests. No consequential architecture choice remains open; review should confirm the proposed defaults and the pre-first-use label rule. Learner approved this blueprint with “looks good for now.” Stage 4 is complete; continue with 5-build.

## Appearance Preference

`src/components/ThemeControl.jsx` owns System/Light/Dark preference and writes only `daily-work-log:theme`. It resolves System using matchMedia and listens for device appearance changes. Set `data-theme` on the document element, update the theme-color meta tag, and use shared CSS color variables and color-scheme for native fields. Preference storage errors do not block logs. The saved-log snapshot schema is unchanged.

## Confirmed Removal

`removeEntry` in the storage repository requires explicit confirmation, validates the date and kind, copies only the targeted map, and writes one validated snapshot. Removing a draft retains savedByDate; removing a saved entry retains draftsByDate. The app uses the pending snapshot when draft persistence previously failed, preserving unrelated in-memory answers. Failed writes do not publish a new snapshot or clear pending work.

`DiscardDialog` uses native modal focus containment, initially focuses Cancel, handles Escape as cancellation, and restores focus when the trigger remains mounted. SavedLog closes its menu and focuses the persistent menu trigger before opening deletion confirmation. Errors stay inside the dialog with a retryable confirmation action. AppShell clears a removed active draft only after a successful write and navigates to saved view, Drafts, or Logs as specified in the PRD.

Storage tests cover confirmed removal, refusal without confirmation, saved/draft isolation, unrelated work retention, reload persistence, snapshot immutability, write failure and retry.

## Contribution Heatmap

`src/lib/heatmap.js` derives Monday-first weeks for one calendar year from savedByDate. It uses existing UTC calendar arithmetic and the local-today string, keeping DST and timezone conversions out of date counting. Padding outside the year is hidden. Count only saved dates within the year and not after today. Include current and saved-history years in the selector.

`src/components/ContributionHeatmap.jsx` owns the selected year and renders the count, month/weekday labels, date squares, legend, and empty explanation. Saved squares invoke the existing onOpen(date); empty/future cells provide accessible date/status labels and no action. A focusable overflow region supports narrow-screen scrolling. Use existing CSS theme variables. LogsBrowser mounts it only on the all-weeks view. Data derives directly from the latest saved snapshot, so additions, edits, deletion and reload use the same source as history; drafts never enter the calculation. No new persistence or dependencies.

Tests in `src/lib/heatmap.test.js` cover complete common/leap years, Monday alignment, monthly labels, catch-up dates, blank saved entries, future-date exclusion, edits/deletion, available years, source immutability, and daylight-saving boundaries. Browser appearance, keyboard and click-through still require hands-on review.
