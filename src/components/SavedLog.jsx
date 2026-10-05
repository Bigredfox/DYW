import { prompts } from '../config.js';
import { formatDay } from '../lib/calendar.js';
export default function SavedLog({ entry }) {
  return <section className="card"><p className="eyebrow">A day to remember</p><h1>{formatDay(entry.date)}</h1><p className="hint">Your saved reflection</p><dl className="saved-answers">{prompts.map((prompt, i) => <div key={prompt.label}><dt><span className="number">{i + 1}.</span> {prompt.label}</dt><dd className={entry.answers[i] ? '' : 'blank'}>{entry.answers[i] || 'No answer'}</dd></div>)}</dl></section>;
}
