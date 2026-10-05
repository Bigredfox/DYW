import { describe, expect, it } from 'vitest';
import { localToday, isValidDate, canLogDate, mondayFor, weekNumber, groupSavedWeeks } from './calendar.js';
describe('local calendar and week history', () => {
  it('uses local calendar parts instead of UTC date truncation', () => {
    expect(localToday({ getFullYear: () => 2026, getMonth: () => 9, getDate: () => 4, toISOString: () => '2026-10-05T02:00:00Z' })).toBe('2026-10-04');
  });
  it('accepts valid past dates and rejects invalid or future dates', () => {
    expect(canLogDate('2026-10-04', '2026-10-04')).toBe(true);
    expect(canLogDate('2026-09-30', '2026-10-04')).toBe(true);
    for (const date of ['', '2026-02-30', '2026-13-01', '2026-10-05', '26-10-04']) expect(canLogDate(date, '2026-10-04')).toBe(false);
    expect(isValidDate('2024-02-29')).toBe(true);
    expect(isValidDate('2026-02-29')).toBe(false);
  });
  it('keeps first Friday and Sunday in Week 1 and next Monday in Week 2', () => {
    const first = mondayFor('2026-10-02');
    expect(first).toBe('2026-09-28');
    expect(weekNumber('2026-10-02', first)).toBe(1);
    expect(weekNumber('2026-10-04', first)).toBe(1);
    expect(weekNumber('2026-10-05', first)).toBe(2);
    expect(weekNumber('2026-10-19', first)).toBe(4);
  });
  it('handles year boundaries and daylight-saving dates with calendar arithmetic', () => {
    expect(mondayFor('2027-01-01')).toBe('2026-12-28');
    expect(weekNumber('2027-01-04', '2026-12-28')).toBe(2);
    expect(weekNumber('2026-03-09', '2026-03-02')).toBe(2);
    expect(weekNumber('2026-11-02', '2026-10-26')).toBe(2);
  });
  it('lists only populated weeks, newest first, with actual days in chronological order', () => {
    const dates = ['2026-10-02', '2026-09-30', '2026-09-28', '2026-10-19', '2026-09-25'];
    const saved = Object.fromEntries(dates.map(date => [date, { date }]));
    const weeks = groupSavedWeeks(saved, '2026-09-28');
    expect(weeks.map(week => week.label)).toEqual(['Week 4', 'Week 1', 'Before first use']);
    expect(weeks[1].entries.map(entry => entry.date)).toEqual(['2026-09-28', '2026-09-30', '2026-10-02']);
    expect(weeks[2].monday).toBe('2026-09-21');
    expect(weeks[2].sunday).toBe('2026-09-27');
    expect(groupSavedWeeks({}, '2026-09-28')).toEqual([]);
  });
});
