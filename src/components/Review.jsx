import { prompts } from '../config.js';
import { formatDay } from '../lib/calendar.js';
export default function Review({ draft, onChange, onSave }) {
  return <section className="card"><p className="eyebrow">One last look</p><h1>Your day, in your words.</h1><p className="hint">{formatDay(draft.date)} · Change anything you like before saving.</p><div className="review-fields">{prompts.map((prompt, i) => <div key={prompt.label}><label htmlFor={`review-${i}`}><span className="number">{i + 1}.</span> {prompt.label}</label><textarea id={`review-${i}`} rows="3" value={draft.answers[i]} placeholder="No answer — leaving this blank is okay." onChange={event => onChange(i, event.target.value)}/></div>)}</div><div className="card-footer"><p className="small">A small record for your future self.</p><button className="primary" onClick={onSave}>Save log <span aria-hidden="true">✓</span></button></div></section>;
}
