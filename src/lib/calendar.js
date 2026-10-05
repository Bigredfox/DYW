export function localToday(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
export function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
export function mondayFor(value) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
  return date.toISOString().slice(0, 10);
}
export function formatDay(value) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}
export function canLogDate(value, today = localToday()) {
  return isValidDate(value) && value <= today;
}
export function addDays(value, count) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0, 10);
}
export function weekNumber(value, firstUseMonday) {
  const diff = Date.parse(`${mondayFor(value)}T12:00:00Z`) - Date.parse(`${firstUseMonday}T12:00:00Z`);
  return Math.round(diff / (7 * 86400000)) + 1;
}
export function groupSavedWeeks(savedByDate, firstUseMonday) {
  const weeks = new Map();
  for (const entry of Object.values(savedByDate)) {
    const monday = mondayFor(entry.date);
    if (!weeks.has(monday)) {
      const number = weekNumber(monday, firstUseMonday);
      weeks.set(monday, { monday, sunday: addDays(monday, 6), label: number > 0 ? `Week ${number}` : 'Before first use', entries: [] });
    }
    weeks.get(monday).entries.push(entry);
  }
  return [...weeks.values()].sort((a, b) => b.monday.localeCompare(a.monday)).map(week => ({ ...week, entries: week.entries.sort((a, b) => a.date.localeCompare(b.date)) }));
}
