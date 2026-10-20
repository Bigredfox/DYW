import { describe, expect, it } from 'vitest';
import { calculateStreaks } from './streaks.js';

const saved = (...dates) => Object.fromEntries(dates.map(date => [date, { answers: [] }]));

describe('reflection streaks', () => {
  it('starts empty and counts a saved reflection with blank answers', () => {
    expect(calculateStreaks({}, '2026-10-20')).toEqual({ current: 0, longest: 0 });
    expect(calculateStreaks(saved('2026-10-20'), '2026-10-20')).toEqual({ current: 1, longest: 1 });
  });
  it('keeps yesterday’s streak active until today ends', () => {
    const entries = saved('2026-10-18', '2026-10-19');
    expect(calculateStreaks(entries, '2026-10-20')).toEqual({ current: 2, longest: 2 });
    expect(calculateStreaks(entries, '2026-10-21')).toEqual({ current: 0, longest: 2 });
  });
  it('rebuilds a streak when a past gap is filled and recalculates on deletion', () => {
    const entries = saved('2026-10-17', '2026-10-18', '2026-10-20');
    expect(calculateStreaks(entries, '2026-10-20')).toEqual({ current: 1, longest: 2 });
    entries['2026-10-19'] = {};
    expect(calculateStreaks(entries, '2026-10-20')).toEqual({ current: 4, longest: 4 });
    delete entries['2026-10-18'];
    expect(calculateStreaks(entries, '2026-10-20')).toEqual({ current: 2, longest: 2 });
  });
  it('counts across years, leap days, and daylight-saving boundaries', () => {
    for (const dates of [
      ['2025-12-31', '2026-01-01', '2026-01-02'],
      ['2024-02-28', '2024-02-29', '2024-03-01'],
      ['2026-03-07', '2026-03-08', '2026-03-09'],
    ]) expect(calculateStreaks(saved(...dates.reverse()), dates[0])).toEqual({ current: 3, longest: 3 });
  });
  it('retains the longest historical run and ignores future or invalid dates', () => {
    const entries = saved('2026-10-01', '2026-10-02', '2026-10-03', '2026-10-20', '2026-10-21', 'invalid');
    expect(calculateStreaks(entries, '2026-10-20')).toEqual({ current: 1, longest: 3 });
  });
});
