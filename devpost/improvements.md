# Ideas for a later session

The current proof of concept was reviewed with working guided logging, drafts, catch-up dates, history, and protected saved-log replacement. These requested improvements are deferred; they are not unfinished tasks in this build.

- **Logo:** Replace the current simple brand mark. Choose the desired visual direction before implementation. Start in `src/App.jsx` and `.brand-mark` in `src/styles.css`.
- **Dark mode:** Add a readable dark palette and decide how switching and theme preference should work. Start in `src/styles.css`; theme state belongs in the app shell.
- **Discard button:** Clarify whether this discards an unfinished draft, unsaved edits, or a saved log, where it appears, and what confirmation/protection it needs. The current saved-log menu intentionally offers only Edit and Start Over. Revisit that product decision before changing the menu or storage behavior.

When resuming improvements, agree on the behavior, update the affected PRD/spec/checklist sections, and verify the changed journey. Preserve existing local logs during changes.
