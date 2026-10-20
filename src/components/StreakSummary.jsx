import { calculateStreaks } from '../lib/streaks.js';

export default function StreakSummary({ savedByDate, today, showLongest = true, showDescription = true }) {
  const { current, longest } = calculateStreaks(savedByDate, today);
  if (!showLongest && !showDescription) {
    return <p className="streak-inline"><strong>{current}</strong> <span>day streak</span></p>;
  }
  return <div className="streak-summary">
    <dl className="streak-stats">
      <div><dt>Current streak</dt><dd>{current} {current === 1 ? 'day' : 'days'}</dd></div>
      {showLongest && <div><dt>Longest streak</dt><dd>{longest} {longest === 1 ? 'day' : 'days'}</dd></div>}
    </dl>
    {showDescription && <p className="small">{current === 0 ? 'Start your streak with a reflection. ' : !savedByDate[today] ? 'Save a reflection for today to keep your streak going. ' : 'You’ve reflected today. '}
      Consecutive saved dates count, including past dates you fill in. Drafts don’t count.</p>}
  </div>;
}
