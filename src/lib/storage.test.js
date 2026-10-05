import { describe, it, expect } from 'vitest';
import { STORAGE_KEY, emptySnapshot, loadSnapshot, newDraft, withDraft, writeSnapshot, saveDraft } from './storage.js';

function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}
describe('durable logging', () => {
  it('persists the first-use anchor and resumes draft answers and review position', () => {
    const storage = memoryStorage();
    const initial = loadSnapshot(storage, '2026-10-02');
    const draft = { ...newDraft('2026-10-02'), answers: ['built a form', '', '', '', '', ''], stage: 'review', promptIndex: 5 };
    writeSnapshot(storage, withDraft(initial, draft));
    const loaded = loadSnapshot(storage, '2026-10-12');
    expect(loaded.firstUseMonday).toBe('2026-09-28');
    expect(loaded.draftsByDate[draft.date]).toEqual(draft);
  });
  it('saves six answers and removes only the matching draft', () => {
    const storage = memoryStorage();
    const draft = newDraft('2026-10-02', ['corrected work', '', 'bug', '', '', '']);
    const other = newDraft('2026-10-01');
    const before = withDraft(withDraft(emptySnapshot('2026-10-02'), draft), other);
    writeSnapshot(storage, before);
    const after = saveDraft(storage, before, draft);
    expect(after.savedByDate[draft.date].answers).toEqual(draft.answers);
    expect(after.draftsByDate[draft.date]).toBeUndefined();
    expect(after.draftsByDate[other.date]).toEqual(other);
    expect(loadSnapshot(storage, '2026-10-03')).toEqual(after);
    expect(before.draftsByDate[draft.date]).toEqual(draft);
  });
  it('leaves the durable snapshot and in-memory draft intact when a write throws', () => {
    const storage = memoryStorage();
    const draft = newDraft('2026-10-02', ['keep me', '', '', '', '', '']);
    const before = withDraft(emptySnapshot('2026-10-02'), draft);
    writeSnapshot(storage, before);
    const raw = storage.getItem(STORAGE_KEY);
    storage.setItem = () => { throw new Error('Quota exceeded'); };
    expect(() => saveDraft(storage, before, draft)).toThrow('Quota exceeded');
    expect(storage.getItem(STORAGE_KEY)).toBe(raw);
    expect(before.draftsByDate[draft.date].answers[0]).toBe('keep me');
    expect(before.savedByDate[draft.date]).toBeUndefined();
  });
  it('refuses unconfirmed replacement and preserves the prior log', () => {
    const storage = memoryStorage();
    const draft = newDraft('2026-10-02');
    const saved = saveDraft(storage, emptySnapshot('2026-10-02'), draft);
    const raw = storage.getItem(STORAGE_KEY);
    expect(() => saveDraft(storage, saved, newDraft(draft.date, ['replacement', '', '', '', '', '']))).toThrow('Confirm');
    expect(storage.getItem(STORAGE_KEY)).toBe(raw);
  });
  it.each(['{bad json', JSON.stringify({ schemaVersion: 2 }), JSON.stringify({ ...emptySnapshot('2026-10-02'), draftsByDate: { '2026-10-02': { ...newDraft('2026-10-02'), answers: ['wrong count'] } } })])('keeps unreadable raw data unchanged', raw => {
    const storage = memoryStorage(); storage.setItem(STORAGE_KEY, raw);
    expect(() => loadSnapshot(storage, '2026-10-02')).toThrow();
    expect(storage.getItem(STORAGE_KEY)).toBe(raw);
  });
  it('surfaces unavailable storage instead of creating a false empty history', () => {
    expect(() => loadSnapshot({ getItem() { throw new Error('Access denied'); } }, '2026-10-02')).toThrow('Access denied');
  });
});
