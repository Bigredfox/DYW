# Ideas for a later session

The current proof of concept was reviewed with working guided logging, drafts, catch-up dates, history, and protected saved-log replacement. These requested improvements are deferred; they are not unfinished tasks in this build.

- **Logo:** Replace the current simple brand mark. Choose the desired visual direction before implementation. Start in `src/App.jsx` and `.brand-mark` in `src/styles.css`.
- **Dark mode (implemented; user accepted):** Header System / Light / Dark control, remembered separately from log data. Shared palettes cover all app screens. Existing tests and production build pass.
- **Discard (implemented; user accepted):** User approved all three behaviors. Draft and edit discard controls remove unfinished work only; Delete saved log in the saved-day menu removes the saved entry only. All require confirmation and preserve unrelated work. Storage failure and retry are tested.

When resuming improvements, agree on the behavior, update the affected PRD/spec/checklist sections, and verify the changed journey. Preserve existing local logs during changes.
