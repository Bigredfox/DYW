---
doc: prd
status: approved
---

# Daily Work Log — Product Requirements

A calm, guided daily work log for Mikey to record his own project work and retrieve it for semester performance reviews.
Source: `scope.md > Who It's For`, `The Unique Kernel`, and `What "Working" Looks Like`.

## The Core Journey

1. Open a calm home screen with a personal greeting, such as “Hi, Michael,” and a gentle invitation to log today's work.
2. Begin a log with today's date selected by default, or choose a past date to catch up. Short instructions introduce the session and refer to the selected day.
3. Answer six prompts, one at a time. Click **Done** after each answer, including an answer left blank. A brief acknowledgment, such as a thumbs-up, accompanies a smooth fade to the next prompt.
4. After the sixth answer, review all six answers together and change any answer before saving.
5. Click **Save**. If this replaces an existing saved log, confirm overwriting before the replacement is saved. The old entry remains intact until replacement is confirmed and saved.
6. After a successful save, see a warm thank-you and encouragement to return tomorrow.
7. Later, open **Profile → Logs**, choose a week, choose a saved day, and read that day's six answers.
8. If an entry is left unfinished, find it under **Profile → Drafts** and resume it without losing the entered answers. A draft does not replace an existing saved log.

Source: `scope.md > The Core Loop` and `What "Working" Looks Like`.

## Screens and Layout

These are interaction surfaces; they need not each become a separate page.

| Surface | Content and actions |
| --- | --- |
| Home | Personal greeting, calm background/theme, brief invitation and entry into today's log. |
| Guided entry | A log date defaulting to today, with a way to select a past date; one prompt and its text answer at a time; a Done button; brief acknowledgment and fade between prompts. |
| Review | All six answers together, including blank answers; a way to change answers; Save. |
| Save confirmation | When replacing an existing entry, ask whether to overwrite it; allow confirmation or cancellation. |
| Completion | Warm thank-you after saving, with encouragement to return tomorrow. Exact copy remains flexible. |
| Profile navigation | Logs leads to saved history; Drafts leads to unfinished entries. This is a navigation surface for the personal PoC, not an account system. Other profile functions are not specified. |
| Drafts | Unfinished entries that can be opened and continued, with their entered answers retained. |
| Logs | Weeks containing saved entries; opening a week shows its logged days; opening a day shows its six answers. With no entries, show “Create a new log” as an action into today's entry. |

Source: `scope.md > The POC Boundary`, `The Core Loop`, and `Explicitly Cut`.

## Look and Feel

- Calm, soothing, welcoming, and pleasant to use after a workday.
- Personal greeting and gentle instructions, with a warm close rather than a formal form-submission message.
- Smooth fades between prompts and a brief acknowledgment after Done.
- Green was an initial direction; ocean-like colors and baby blue were examples of the desired feeling, not a final palette. Exact colors and typography are not yet selected.
- The HTML review companion illustrates the mood; its styling is not an approved application design.

Source: `scope.md > Inspiration & Identity` and the stage 3 interview.

## Features and Behavior

### Welcome and Start Today's Log

Show a personal greeting and introduce the daily session briefly. The greeting example uses Michael; the PoC remains for Mikey. How the displayed name is supplied is not yet decided.

Acceptance criteria:
- [ ] The home screen greets the user personally and provides a way to begin today's log.
- [ ] Brief instructions lead into the first prompt.

Source: `scope.md > The Core Loop` and `Inspiration & Identity`.

### Choose a Date and Catch Up

New entries default to today's date. The user can choose a past date before answering the prompts, so Monday's work can be recorded on Friday. The selected date is visible during entry and review and determines the entry's day and week in Logs. Instructions refer to the selected day when it is not today. Catch-up entries follow the same six prompts, review, drafts, and saving flow. If the selected day already has a saved log, the existing overwrite-confirmation and protection rules apply.

Acceptance criteria:
- [ ] A new entry defaults to today and allows choosing a past date.
- [ ] A Monday entry written on Friday is saved under Monday, in Monday's week.
- [ ] The selected date is visible during entry and review and stays with an unfinished draft.
- [ ] Saving for a date with an existing entry requires confirmation and leaves at most one saved entry for that date.

Source: `scope.md > The Core Loop` and `The POC Boundary`; the stage 3 interview extends the original today's-log entry flow to support catching up.

### Six Guided Prompts

Present these topics in order:
1. What you did.
2. Skills learned.
3. Obstacles faced.
4. How you overcame them.
5. Resources used.
6. People you spoke to.

Each answer accepts typed text, including text entered through the laptop's speech-to-text. **Done** signals completion; typing or dictation alone does not advance. Answers may be blank or contain “none.” Do not infer or invent content for blank answers.

Acceptance criteria:
- [ ] Each topic appears individually in the agreed order.
- [ ] Done advances after a filled or blank answer, with a brief acknowledgment and smooth fade.
- [ ] After the sixth Done, the app opens review rather than immediately saving.

Source: `scope.md > The Unique Kernel` and `Inspiration & Identity`.

### Review and Save

Review presents all six answers together. The user can change answers before Save. A successful save stores one entry for that day and shows the warm closing message. Saved entries must remain available when the user closes and reopens the app; this follows the approved look-back purpose, rather than selecting a storage technology.

Acceptance criteria:
- [ ] Review includes every prompt and its answer, including blank answers.
- [ ] Changes made during review appear in the saved entry.
- [ ] Saving a new daily entry makes it available under its week and day.
- [ ] The thank-you appears after a successful save.
- [ ] Reopening the app preserves saved entries for look-back.
- [ ] If saving fails, entered answers remain available, a brief error offers retry, and no success message appears or existing saved log changes.

Source: `scope.md > The Core Loop`, `What "Working" Looks Like`, and `Why This Matters to the Learner`.

### Edit or Replace an Existing Daily Log

There is at most one saved entry per day. When viewing any saved log, including a past day, a three-dot menu at the top-right offers **Edit**, **Start Over**, and **Delete saved log**. Editing begins with existing answers; starting over begins with blank answers. Starting over does not itself erase the saved entry. Saving a replacement asks for confirmation before overwriting. Canceling confirmation or leaving before saving keeps the old entry intact. Both actions retain the original date of the selected log; changing a past day does not create an entry for today.

Acceptance criteria:
- [ ] Starting over leaves the saved version unchanged until replacement is confirmed and saved.
- [ ] Every saved log has a top-right three-dot menu offering Edit, Start Over, and Delete saved log.
- [ ] Saving a replacement displays an overwrite confirmation.
- [ ] Canceling confirmation preserves the original entry.
- [ ] Confirming and successfully saving replaces the entry for that day, without creating a second daily entry.
- [ ] Editing starts with the saved answers rather than blank fields.

Source: `scope.md > The POC Boundary`; clarified in the stage 3 interview.

### Browse Logs by Week and Day

Navigate through Profile → Logs. Group entries by week. Opening a week displays only days with saved entries: for example, Monday, Wednesday, and Friday when only those days were logged. Each week has at most seven daily entries. Opening a day displays its six prompt-answer pairs.

Weeks run Monday through Sunday and are labeled **Week 1**, **Week 2**, **Week 3**, and so on. Week 1 is the Monday–Sunday calendar week in which the user first starts using the app, even if first use is on Friday. The following Monday starts Week 2; numbering advances with calendar weeks, not with the number of entries. Group each log by the date it describes, rather than the date it is later edited or saved from a draft.

Acceptance criteria:
- [ ] Profile includes a Logs navigation item.
- [ ] Logs groups saved entries into weeks.
- [ ] First use on Friday places that Friday in Week 1; the following Monday belongs to Week 2.
- [ ] Week numbering follows Monday–Sunday calendar weeks even if no entries are made during a week.
- [ ] A week with three logged days shows those three days, without fabricating entries for the others.
- [ ] Opening a saved day displays the answers saved for that day.
- [ ] With no saved entries, “Create a new log” leads into today's entry.

Source: `scope.md > The Core Loop`, `What "Working" Looks Like`, and `The POC Boundary`.

### Keep and Resume Drafts

Leaving an unfinished entry retains it in **Profile → Drafts**. Open the draft to continue with the answers already entered and its original log date. This also applies to unfinished edits and replacements: the saved version remains intact while the draft is unfinished. Saving the completed draft follows the normal review and confirmation rules, moves the completed entry into Logs, and removes that unfinished version from Drafts.

Acceptance criteria:
- [ ] Profile offers Logs and Drafts as separate navigation items.
- [ ] Leaving an unfinished entry makes it available in Drafts, including after reopening the app.
- [ ] Opening a draft retains its entered answers and original log date.
- [ ] An unfinished edit or replacement leaves the saved log unchanged.
- [ ] Successfully saving a completed draft makes it available in Logs and removes that draft from Drafts.

Source: `scope.md > The Core Loop`; added in the stage 3 interview to preserve unfinished work. This adds draft retention and resumption to the original save-and-look-back boundary, without a separate draft-management system.

## States and Boundaries

- **First use / no history:** Logs offers “Create a new log.” Name setup is not yet defined.
- **Blank answer:** Allowed for every prompt; the user can still click Done.
- **Review:** All six answers remain changeable before Save.
- **Saved:** Show a warm thank-you; the entry is available in history and after reopening.
- **Replacement pending:** Retain the old saved entry until replacement is confirmed and saved.
- **Replacement canceled or left unfinished:** Preserve the original saved entry. Unfinished answers remain available under Profile → Drafts.
- **Unfinished entry:** Retain entered answers as a draft for later resumption; it is not a completed log.
- **Save failure:** Retain the entered answers, show a brief error explaining that saving failed, and offer a retry. Do not show success or replace an existing saved entry.
- **Personal use:** No account, team review, sharing, or multi-user behavior is required.

## Product Decisions

- **Personal, calm welcome:** Make logging approachable after a workday.
- **Done button:** The user explicitly signals completion, including when using laptop dictation.
- **Acknowledgment and fade:** Make moving through prompts pleasing and signal completion.
- **Optional answers:** Some prompts do not apply every day; blank or “none” is acceptable.
- **Review before Save:** Allow corrections before committing the entry.
- **Profile → Logs → week → day:** Organize history in a familiar notes-like path.
- **One entry per day:** A week can contain up to seven saved entries.
- **Personal week numbering:** Monday–Sunday weeks numbered from the calendar week of first use; starting on Friday does not make Friday the beginning of a week.
- **Catch-up entries:** Choose a past log date so work can be recorded later without being assigned to the day of writing.
- **Editing differs from starting over:** Editing retains answers; starting over prepares a replacement.
- **Saved-log menu:** Every saved log offers Edit, Start Over, and Delete saved log through a top-right three-dot menu. The later improvement adds explicit draft and edit discard controls separately.
- **Profile → Drafts:** Keep unfinished entries available to resume alongside the separate Logs navigation item.
- **Save-failure recovery:** Keep the answers, show a brief error, and offer retry without changing the saved log.
- **Confirm overwrite and protect the old log:** Previously saved work survives until its replacement is saved.
- **No-history invitation:** Show “Create a new log” when history is empty.

## What We're Building

The welcome, date selection for today or a past day, six guided prompts, optional answers, review and corrections, save and warm completion, safe daily replacement, editing of saved answers, history organized by week and day, and unfinished entries retained under Profile → Drafts for resumption. Enough saved history to demonstrate retrieving a specific past day. A local app is sufficient; deployment is optional. Draft resumption and catch-up dates are the learner-approved additions to the original scope; keep them within this same logging flow.

Source: `scope.md > The POC Boundary` and `What "Working" Looks Like`.

## Deferred From the POC

- Accounts, sharing links, and broader user onboarding: unnecessary for the personal logging experiment. Profile navigation does not introduce these features.
- A full year of preloaded history: only enough entries to demonstrate look-back are needed.
- Additional profile features: none are required by the agreed navigation path.

Source: `scope.md > Explicitly Cut`.

## Possible Later Enhancements

Keep the scope's ranking: AI weekly summaries/reports; in-app speech-to-text; weekly goals broken into daily goals with a check-in; a contribution heatmap. Laptop speech-to-text may already be used without building a voice feature.

Source: `scope.md > Later`.

## Non-Goals

No teammate reviews or manager dashboard, GitHub/evidence attachments, automatic AI skill tagging, accounts, or manager sharing. The PoC proves structured logging and retrieval, without an AI recap.

Source: `scope.md > Explicitly Cut` and `What "Working" Looks Like`.

## Open Questions

The core product questions raised during the interview are resolved. The learner approved the complete plan with “Looks good.” Stage 3 is complete; continue with `4-spec`.

**Can be settled during `4-spec` without expanding the product:**
- The fixed display name for the personal PoC versus a way to set it, without adding accounts.
- Exact soothing palette, typography, final greeting/thank-you copy, and fade timing.
- The mechanism for preserving saved entries locally and preparing the small demonstration history.

## Appearance Preference

Added after the original PoC: the header offers System, Light, and Dark appearance. Default to the device setting, follow device changes in System mode, and remember an explicit choice across visits. Apply the palette to fields, menus, dialogs, notices, and all screens. If the preference cannot be stored, apply it for the current visit and explain that it could not be remembered. Log data is unaffected.

## Discard and Delete

User approved all three removal behaviors after the original PoC:
- **Discard draft:** On guided entry, review, and each unfinished day in Drafts, remove that day's unfinished answers.
- **Discard changes:** When a saved log exists for the day, use this label for draft removal; keep the saved answers unchanged and return to the saved log from an active editing session.
- **Delete saved log:** In the saved log menu, remove only the saved entry. Keep any unfinished draft for that date and return to history.

Each action opens a date-specific confirmation explaining what is removed and retained, and that removal cannot be undone. Cancel or Escape removes nothing. Confirm only publishes success after storage succeeds; on failure keep all work and the dialog available for retry. Preserve unrelated days and the first-use week anchor. After discarding from Drafts, remain in Drafts; after discarding an active new draft, return to Drafts.

## Contribution Heatmap

User requested this previously deferred feature after accepting dark mode and discard. In Profile / Logs, above the week list, show a Monday-first calendar for the selected year. Default to the current local year; offer it and all years containing saved logs. Show month labels, weekday labels, a legend, today's outline, and a saved-day count.

A filled square means one saved log on that calendar date, even if its answers are blank. Drafts do not count. Editing does not add contributions. Catch-up logs fill their original dates, including dates before first use. Deleting a saved log clears its square. Future dates are muted and never counted. Clicking or keyboard-activating a saved square opens its saved reflection. Empty days have date/status labels but no logging action. This is a record of saved days, with no word-count or productivity score.

Show the calendar and an inviting explanation when no logs exist. Preserve week/day browsing below it. The chart scrolls horizontally on small screens; its scroll region is keyboard-focusable. Filled days are buttons with full date labels; empty days expose date and status. Theme colors follow the selected appearance. No external service or storage migration is required.
