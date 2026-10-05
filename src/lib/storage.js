import { isValidDate, mondayFor } from './calendar.js';
export const STORAGE_KEY = 'daily-work-log:v1';
export function emptySnapshot(today) {
  return { schemaVersion: 1, firstUseMonday: mondayFor(today), savedByDate: {}, draftsByDate: {} };
}
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const timestamp = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
export function validateSnapshot(data) {
  if (!record(data) || data.schemaVersion !== 1 || !isValidDate(data.firstUseMonday) || mondayFor(data.firstUseMonday) !== data.firstUseMonday || !record(data.savedByDate) || !record(data.draftsByDate)) throw new Error('Stored data is malformed or uses an unsupported version. Existing data has been kept.');
  for (const [kind, entries] of [['saved', data.savedByDate], ['draft', data.draftsByDate]]) {
    for (const [date, entry] of Object.entries(entries)) {
      if (!isValidDate(date) || !record(entry) || entry.date !== date || !Array.isArray(entry.answers) || entry.answers.length !== 6 || !entry.answers.every(answer => typeof answer === 'string') || !timestamp(entry.updatedAt)) throw new Error('An existing log could not be read. Existing data has been kept.');
      if (kind === 'saved' && !timestamp(entry.createdAt)) throw new Error('A saved log could not be read. Existing data has been kept.');
      if (kind === 'draft' && (!['new', 'edit', 'restart'].includes(entry.mode) || !['prompt', 'review'].includes(entry.stage) || !Number.isInteger(entry.promptIndex) || entry.promptIndex < 0 || entry.promptIndex > 5)) throw new Error('A draft could not be read. Existing data has been kept.');
    }
  }
  return data;
}
export function writeSnapshot(storage, data) {
  validateSnapshot(data);
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}
export function loadSnapshot(storage, today) {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw !== null) return validateSnapshot(JSON.parse(raw));
  return writeSnapshot(storage, emptySnapshot(today));
}
export function newDraft(date, answers = Array(6).fill(''), mode = 'new') {
  return { date, answers: [...answers], mode, stage: 'prompt', promptIndex: 0, updatedAt: new Date().toISOString() };
}
export function withDraft(snapshot, draft) {
  return { ...snapshot, draftsByDate: { ...snapshot.draftsByDate, [draft.date]: draft } };
}
export function prepareReplacement(snapshot, date, mode) {
  if (!['edit', 'restart'].includes(mode) || !snapshot.savedByDate[date]) throw new Error('Open an existing saved log to edit or start over.');
  const existing = snapshot.draftsByDate[date];
  if (existing) return { draft: existing, resumed: true };
  const draft = newDraft(date, mode === 'edit' ? snapshot.savedByDate[date].answers : Array(6).fill(''), mode);
  if (mode === 'edit') { draft.stage = 'review'; draft.promptIndex = 5; }
  return { draft, resumed: false };
}
export function saveDraft(storage, snapshot, draft, confirmed = false) {
  const previous = snapshot.savedByDate[draft.date];
  if (previous && !confirmed) throw new Error('Confirm overwriting before replacing this log.');
  const now = new Date().toISOString();
  const saved = { date: draft.date, answers: [...draft.answers], createdAt: previous?.createdAt ?? now, updatedAt: now };
  const draftsByDate = { ...snapshot.draftsByDate };
  delete draftsByDate[draft.date];
  return writeSnapshot(storage, { ...snapshot, savedByDate: { ...snapshot.savedByDate, [draft.date]: saved }, draftsByDate });
}
