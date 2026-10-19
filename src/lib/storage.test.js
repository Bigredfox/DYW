import { describe, it, expect } from 'vitest';
import { STORAGE_KEY, emptySnapshot, loadSnapshot, newDraft, withDraft, writeSnapshot, saveDraft, prepareReplacement, removeEntry } from './storage.js';

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
  it('prepares editing with saved answers and start-over with blanks without altering the saved day', () => {
    const storage = memoryStorage();
    const saved = saveDraft(storage, emptySnapshot('2026-10-04'), newDraft('2026-09-30', ['original work', 'skill', '', '', '', 'person']));
    const raw = storage.getItem(STORAGE_KEY);
    const editing = prepareReplacement(saved, '2026-09-30', 'edit');
    expect(editing.draft.answers).toEqual(saved.savedByDate['2026-09-30'].answers);
    expect(editing.draft.stage).toBe('review');
    editing.draft.answers[0] = 'changed in draft';
    expect(saved.savedByDate['2026-09-30'].answers[0]).toBe('original work');
    const restart = prepareReplacement(saved, '2026-09-30', 'restart');
    expect(restart.draft.answers).toEqual(Array(6).fill(''));
    expect(restart.draft.stage).toBe('prompt');
    expect(restart.draft.date).toBe('2026-09-30');
    expect(storage.getItem(STORAGE_KEY)).toBe(raw);
  });
  it('resumes existing unfinished work instead of discarding it on Edit or Start Over', () => {
    const storage = memoryStorage();
    const saved = saveDraft(storage, emptySnapshot('2026-10-04'), newDraft('2026-09-30'));
    const draft = { ...newDraft('2026-09-30', ['unfinished', '', '', '', '', '']), promptIndex: 3 };
    const before = withDraft(saved, draft);
    for (const mode of ['edit', 'restart']) expect(prepareReplacement(before, draft.date, mode)).toEqual({ draft, resumed: true });
    expect(draft.answers[0]).toBe('unfinished');
  });
  it('keeps the original saved day and draft on failed replacement, then replaces atomically on retry', () => {
    const storage = memoryStorage();
    const original = saveDraft(storage, emptySnapshot('2026-10-04'), newDraft('2026-09-30', ['original', '', '', '', '', '']));
    const draft = prepareReplacement(original, '2026-09-30', 'edit').draft;
    draft.answers[0] = 'replacement';
    const unrelated = newDraft('2026-10-01', ['another day', '', '', '', '', '']);
    const before = withDraft(withDraft(original, draft), unrelated);
    writeSnapshot(storage, before);
    const raw = storage.getItem(STORAGE_KEY);
    const setItem = storage.setItem;
    storage.setItem = () => { throw new Error('Quota exceeded'); };
    expect(() => saveDraft(storage, before, draft, true)).toThrow('Quota exceeded');
    expect(storage.getItem(STORAGE_KEY)).toBe(raw);
    expect(before.savedByDate[draft.date].answers[0]).toBe('original');
    expect(before.draftsByDate[draft.date].answers[0]).toBe('replacement');
    storage.setItem = setItem;
    const after = saveDraft(storage, before, draft, true);
    expect(after.savedByDate[draft.date].answers[0]).toBe('replacement');
    expect(after.savedByDate[draft.date].createdAt).toBe(original.savedByDate[draft.date].createdAt);
    expect(Object.keys(after.savedByDate)).toEqual([draft.date]);
    expect(after.draftsByDate[draft.date]).toBeUndefined();
    expect(after.draftsByDate[unrelated.date]).toEqual(unrelated);
    expect(after.firstUseMonday).toBe('2026-09-28');
  });
});

describe('confirmed removal', () => {
  function fixture() {
    const storage = memoryStorage();
    let snapshot = saveDraft(storage, emptySnapshot('2026-10-04'), newDraft('2026-10-02', ['saved', '', '', '', '', '']));
    snapshot = saveDraft(storage, snapshot, newDraft('2026-10-01'));
    snapshot = withDraft(snapshot, newDraft('2026-10-02', ['edits', '', '', '', '', ''], 'edit'));
    snapshot = withDraft(snapshot, newDraft('2026-10-03', ['unfinished', '', '', '', '', '']));
    writeSnapshot(storage, snapshot);
    return { storage, snapshot };
  }
  it.each(['draft', 'saved'])('refuses unconfirmed %s removal and keeps durable data', kind => {
    const { storage, snapshot } = fixture();
    const raw = storage.getItem(STORAGE_KEY);
    expect(() => removeEntry(storage, snapshot, '2026-10-02', kind)).toThrow('Confirm');
    expect(storage.getItem(STORAGE_KEY)).toBe(raw);
  });
  it.each(['draft', 'saved'])('removes only the confirmed %s and preserves other work after reload', kind => {
    const { storage, snapshot } = fixture();
    const after = removeEntry(storage, snapshot, '2026-10-02', kind, true);
    const field = kind === 'saved' ? 'savedByDate' : 'draftsByDate';
    const otherField = kind === 'saved' ? 'draftsByDate' : 'savedByDate';
    expect(after[field]['2026-10-02']).toBeUndefined();
    expect(after[otherField]).toEqual(snapshot[otherField]);
    expect(after.savedByDate['2026-10-01']).toEqual(snapshot.savedByDate['2026-10-01']);
    expect(after.draftsByDate['2026-10-03']).toEqual(snapshot.draftsByDate['2026-10-03']);
    expect(after.firstUseMonday).toBe(snapshot.firstUseMonday);
    expect(snapshot[field]['2026-10-02']).toBeDefined();
    expect(loadSnapshot(storage, '2026-10-04')).toEqual(after);
  });
  it('discards a new unfinished day without affecting history', () => {
    const { storage, snapshot } = fixture();
    const after = removeEntry(storage, snapshot, '2026-10-03', 'draft', true);
    expect(after.draftsByDate['2026-10-03']).toBeUndefined();
    expect(after.savedByDate).toEqual(snapshot.savedByDate);
  });
  it.each(['draft', 'saved'])('preserves data on failed %s removal and permits retry', kind => {
    const { storage, snapshot } = fixture();
    const raw = storage.getItem(STORAGE_KEY);
    const originalWrite = storage.setItem;
    storage.setItem = () => { throw new Error('Unavailable'); };
    expect(() => removeEntry(storage, snapshot, '2026-10-02', kind, true)).toThrow('Unavailable');
    expect(storage.getItem(STORAGE_KEY)).toBe(raw);
    expect(snapshot.draftsByDate['2026-10-02'].answers[0]).toBe('edits');
    expect(snapshot.savedByDate['2026-10-02'].answers[0]).toBe('saved');
    storage.setItem = originalWrite;
    expect(() => removeEntry(storage, snapshot, '2026-10-02', kind, true)).not.toThrow();
  });
});

it('retains unrelated pending answers when another entry is removed', () => {
  const storage = memoryStorage();
  const saved = saveDraft(storage, emptySnapshot('2026-10-04'), newDraft('2026-10-02'));
  const pending = withDraft(saved, newDraft('2026-10-03', ['only in this tab', '', '', '', '', '']));
  const raw = storage.getItem(STORAGE_KEY);
  const write = storage.setItem;
  storage.setItem = () => { throw new Error('Unavailable'); };
  expect(() => removeEntry(storage, pending, '2026-10-02', 'saved', true)).toThrow();
  expect(storage.getItem(STORAGE_KEY)).toBe(raw);
  expect(pending.draftsByDate['2026-10-03'].answers[0]).toBe('only in this tab');
  storage.setItem = write;
  removeEntry(storage, pending, '2026-10-02', 'saved', true);
  expect(loadSnapshot(storage, '2026-10-04').draftsByDate['2026-10-03'].answers[0]).toBe('only in this tab');
});
