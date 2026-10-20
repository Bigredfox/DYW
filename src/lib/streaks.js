import { addDays, isValidDate } from './calendar.js';

export function calculateStreaks(savedByDate, today) {
  const dates = Object.keys(savedByDate)
    .filter(date => savedByDate[date] && isValidDate(date) && date <= today)
    .sort();
  let longest = 0;
  let run = 0;
  let previous = null;
  for (const date of dates) {
    run = previous && addDays(previous, 1) === date ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }
  const active = previous === today || previous === addDays(today, -1);
  return { current: active ? run : 0, longest };
}
