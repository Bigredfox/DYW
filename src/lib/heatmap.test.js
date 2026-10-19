import { describe, expect, it } from 'vitest';
import { buildHeatmap, heatmapYears } from './heatmap.js';

const dates = result => result.weeks.flatMap(week => week.days).filter(day => day.inYear);

describe('saved-log contribution calendar', () => {
  it.each([[2026, 365], [2024, 366]])('includes every day once in %i with Monday-first weeks', (year, count) => {
    const result = buildHeatmap({}, year, '2026-10-18');
    const days = dates(result);
    expect(days).toHaveLength(count);
    expect(new Set(days.map(day => day.date)).size).toBe(count);
    expect(days[0].date).toBe(`${year}-01-01`);
    expect(days.at(-1).date).toBe(`${year}-12-31`);
    for (const week of result.weeks) {
      expect(new Date(`${week.start}T12:00:00Z`).getUTCDay()).toBe(1);
      expect(week.days).toHaveLength(7);
    }
    expect(result.weeks.filter(week => week.month !== null).map(week => week.month)).toEqual(Array.from({ length: 12 }, (_, i) => i));
  });
  it('counts saved days by log date, including blank answers and catch-up days, but excludes future and other years', () => {
    const saved = {
      '2025-12-31': { answers: ['old'] },
      '2026-01-01': { answers: Array(6).fill(''), updatedAt: '2026-10-18T12:00:00Z' },
      '2026-10-18': { answers: ['today'] },
      '2026-10-19': { answers: ['future'] },
    };
    const result = buildHeatmap(saved, 2026, '2026-10-18');
    expect(result.savedDays).toBe(2);
    expect(dates(result).filter(day => day.saved).map(day => day.date)).toEqual(['2026-01-01', '2026-10-18']);
    expect(dates(result).find(day => day.date === '2026-10-19')).toMatchObject({ future: true, saved: false });
  });
  it('reflects edits and deletions without incrementing contributions or changing source data', () => {
    const saved = { '2026-10-01': { answers: ['original'] } };
    expect(buildHeatmap(saved, 2026, '2026-10-18').savedDays).toBe(1);
    expect(buildHeatmap({ ...saved, '2026-10-01': { answers: ['edited'] } }, 2026, '2026-10-18').savedDays).toBe(1);
    expect(buildHeatmap({}, 2026, '2026-10-18').savedDays).toBe(0);
    expect(saved['2026-10-01'].answers).toEqual(['original']);
  });
  it('offers current and historical years in descending order without duplicates', () => {
    expect(heatmapYears({ '2024-02-29': {}, '2024-05-01': {}, '2025-01-01': {} }, '2026-10-18')).toEqual([2026, 2025, 2024]);
    expect(heatmapYears({}, '2026-10-18')).toEqual([2026]);
  });
  it('keeps daylight-saving boundary days consecutive', () => {
    const all = dates(buildHeatmap({}, 2026, '2026-12-31')).map(day => day.date);
    for (const start of ['2026-03-07', '2026-10-31']) {
      const index = all.indexOf(start);
      expect(all.slice(index, index + 3)).toEqual(start === '2026-03-07' ? ['2026-03-07', '2026-03-08', '2026-03-09'] : ['2026-10-31', '2026-11-01', '2026-11-02']);
    }
  });
});
