# Daily Work Log

A personal daily reflection: six guided prompts, a review before saving, and a record of your work. This proof of concept is built in verified slices; see `devpost/checklist.md` for current progress.

## Run locally

Install a supported Node.js LTS, then run these commands from this folder:

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://localhost:5173 in your regular browser. The port is fixed; if another app is using it, stop that app first. `npm.cmd` avoids PowerShell's restriction on running the npm.ps1 wrapper.

```powershell
npm.cmd test -- --run
npm.cmd run build
```

## Your data

Logs and unfinished drafts stay in this browser's localStorage, under `daily-work-log:v1`. Use the same browser profile and address when returning. Clearing site data removes them; they do not sync across devices. Use one active tab. No account, API keys, or external log service is involved.

If writing fails, keep the tab open and retry: the latest answers remain in memory until storage succeeds. The app reports unreadable data without resetting it.

## First build checkpoint

Start today's reflection, type a few answers, reload, and continue the draft. Complete all six prompts (blank answers are welcome), correct something in review, save, and view the saved day. Reopen the app to confirm persistence.

Choose another day from Home to catch up on past work. Profile → Drafts resumes unfinished entries; Profile → Logs opens weeks and saved days. Weeks run Monday–Sunday from your first-use week; older catch-up dates show “Before first use” with their date range. Future dates are rejected.

Protected editing arrives in the next slice. First use starts empty. Use fictional sample answers for demonstration.
