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

## Development feedback

Agentation appears only when running the development server. Open its bottom-right toolbar, select an element, and add a note. It connects to the local annotation server at `http://localhost:4747`.

Codex's user MCP settings register `agentation` with `npx.cmd -y agentation-mcp server`. Reconnect or restart Codex to load newly configured MCP tools. Keep that agent session running while annotating. For a standalone test server, run:

```powershell
npx.cmd --yes agentation-mcp server
```

Check service health with `npx.cmd --yes agentation-mcp doctor`. Health alone does not verify browser feedback delivery: add a note with the exact text `Agentation live test`, then ask the agent to read `agentation_get_all_pending` and confirm that comment and page URL. Initial setup reported unavailable SQLite bindings, so annotations currently remain in memory and can be lost when the server stops; work logs retain their separate localStorage persistence.

## Your data

Logs and unfinished drafts stay in this browser's localStorage, under `daily-work-log:v1`. Use the same browser profile and address when returning. Clearing site data removes them; they do not sync across devices. Use one active tab. No account, API keys, or external log service is involved.

If writing fails, keep the tab open and retry: the latest answers remain in memory until storage succeeds. The app reports unreadable data without resetting it.

## First build checkpoint

Start today's reflection, type a few answers, reload, and continue the draft. Complete all six prompts (blank answers are welcome), correct something in review, save, and view the saved day. Reopen the app to confirm persistence.

Choose another day from Home to catch up on past work. Profile → Drafts resumes unfinished entries; Profile → Logs opens weeks and saved days. Weeks run Monday–Sunday from your first-use week; older catch-up dates show “Before first use” with their date range. Future dates are rejected.

Every saved day has a top-right three-dot menu with **Edit** and **Start Over**. Edit opens review with the saved answers; Start Over begins with blank answers. Existing unfinished work for the same date is resumed instead of erased. Saving a replacement asks for confirmation. Canceling, leaving, or a failed write keeps the old saved log intact.

## Demo walkthrough

First use starts empty. Enter two or three fictional sample logs through **Choose another day**, using days from two different calendar weeks. Label the content as sample data when showing it in the video. No sample history is automatically inserted.

Show the welcome, six guided prompts, a correction in review, Save, and warm completion. Then open Profile → Logs → a week → a past day. Demonstrate draft resumption and safe editing if useful; the required short video can concentrate on writing and retrieval.

For the final hands-on check, try editing a saved past day, cancel replacement and verify the original, then save a confirmed change. Try Start Over and leave before saving: the original should still be in Logs and unfinished answers should be in Drafts. Use Tab/Shift+Tab and Escape in the overwrite dialog, and check the app in a narrow window. Blank and long answers are supported; future dates are rejected.
