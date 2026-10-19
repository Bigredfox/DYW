import { useState } from 'react';
import { formatDay, localToday } from '../lib/calendar.js';
import { buildHeatmap, heatmapYears } from '../lib/heatmap.js';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ContributionHeatmap({ savedByDate, onOpen }) {
  const today = localToday();
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const years = [...new Set([year, ...heatmapYears(savedByDate, today)])].sort((a, b) => b - a);
  const { weeks, savedDays } = buildHeatmap(savedByDate, year, today);
  return <section className="heatmap" aria-labelledby="heatmap-title">
    <div className="heatmap-heading"><div><h2 id="heatmap-title">Your year in reflections</h2><p className="small" role="status">{savedDays} saved {savedDays === 1 ? 'day' : 'days'} in {year}</p></div><label className="heatmap-year">Year<select value={year} onChange={event => setYear(Number(event.target.value))}>{years.map(value => <option key={value} value={value}>{value}</option>)}</select></label></div>
    <p className="small" id="heatmap-help">One square per day. Open a filled square to revisit its log. Drafts are not counted.</p>
    <div className="heatmap-scroll" tabIndex="0" role="region" aria-label={`Reflection calendar for ${year}; scroll horizontally to see all months`} aria-describedby="heatmap-help">
      <div className="heatmap-chart">
        <div className="heatmap-weekdays" aria-hidden="true">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}</div>
        <div className="heatmap-weeks">{weeks.map(week => <div className="heatmap-week" key={week.start}>
          <span className="heatmap-month" aria-hidden="true">{week.month !== null ? months[week.month] : ''}</span>
          {week.days.map(day => {
            if (!day.inYear) return <span className="heatmap-cell outside" key={day.date} aria-hidden="true"/>;
            const label = `${formatDay(day.date)}: ${day.future ? 'Future day' : day.saved ? 'Saved log. Open reflection' : 'No saved log'}`;
            return day.saved ? <button key={day.date} className={`heatmap-cell logged${day.date === today ? ' is-today' : ''}`} title={label} aria-label={label} onClick={() => onOpen(day.date)}/> : <span key={day.date} className={`heatmap-cell${day.future ? ' future' : ''}${day.date === today ? ' is-today' : ''}`} role="img" aria-label={label} title={label}/>;
          })}
        </div>)}</div>
      </div>
    </div>
    <div className="heatmap-legend" aria-label="Calendar legend"><span><i className="heatmap-cell" aria-hidden="true"/>No saved log</span><span><i className="heatmap-cell logged" aria-hidden="true"/>Saved log</span><span><i className="heatmap-cell is-today" aria-hidden="true"/>Today</span></div>
    {savedDays === 0 && <p className="small">{Object.keys(savedByDate).length ? 'No saved logs in this year. Choose another year to see your reflections.' : 'Your first saved reflection will light up a day here.'}</p>}
  </section>;
}
