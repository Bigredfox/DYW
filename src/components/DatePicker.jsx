import { useState } from 'react';
import { canLogDate, formatDay } from '../lib/calendar.js';
export default function DatePicker({ today, onStart }) {
  const [date, setDate] = useState(today);
  const [error, setError] = useState('');
  function submit(event) {
    event.preventDefault();
    if (!canLogDate(date, today)) { setError('Choose today or a valid date in the past.'); return; }
    onStart(date);
  }
  return <section className="card"><p className="eyebrow">Make room for your day</p><h1>What day are we reflecting on?</h1><p className="hint">Today is a good place to start. You can also catch up on a past day.</p><form onSubmit={submit} noValidate><label className="field-label" htmlFor="log-date">Log date</label><input autoFocus id="log-date" type="date" value={date} max={today} required onChange={event => { setDate(event.target.value); setError(''); }} aria-describedby={error ? 'date-error' : 'date-intro'}/>{error ? <p id="date-error" role="alert" className="date-error">{error}</p> : <p id="date-intro" className="hint">{canLogDate(date, today) ? `${date === today ? 'Today' : formatDay(date)}: six prompts, at your own pace. Blank answers are welcome.` : 'Select a date before continuing.'}</p>}<button className="primary" type="submit">Begin reflection →</button></form></section>;
}
