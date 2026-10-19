import { addDays, isValidDate, mondayFor } from './calendar.js';

export function heatmapYears(savedByDate, today) {
  return [...new Set([Number(today.slice(0, 4)), ...Object.keys(savedByDate).map(date => Number(date.slice(0, 4)))])].sort((a, b) => b - a);
}

export function buildHeatmap(savedByDate, year, today) {
  if (!Number.isInteger(year) || year < 1 || year > 9999 || !isValidDate(today)) throw new Error('Choose a valid year and date.');
  const first = `${String(year).padStart(4, '0')}-01-01`;
  const last = `${String(year).padStart(4, '0')}-12-31`;
  const weeks = [];
  let savedDays = 0;
  for (let start = mondayFor(first); start <= last; start = addDays(start, 7)) {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = addDays(start, index);
      const inYear = date >= first && date <= last;
      const future = date > today;
      const saved = inYear && !future && Boolean(savedByDate[date]);
      if (saved) savedDays += 1;
      return { date, inYear, future, saved };
    });
    const monthStart = days.find(day => day.inYear && day.date.endsWith('-01'));
    weeks.push({ start, days, month: monthStart ? Number(monthStart.date.slice(5, 7)) - 1 : null });
  }
  return { weeks, savedDays };
}
