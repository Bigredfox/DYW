import { useEffect, useRef, useState } from 'react';
import { prompts } from '../config.js';
import { formatDay } from '../lib/calendar.js';
export default function GuidedEntry({ draft, onChange, onAdvance }) {
  const [moving, setMoving] = useState(false);
  const input = useRef(null);
  const timer = useRef(null);
  useEffect(() => { input.current?.focus(); return () => clearTimeout(timer.current); }, [draft.promptIndex]);
  const prompt = prompts[draft.promptIndex];
  function done() {
    if (moving || timer.current) return;
    setMoving(true);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200;
    timer.current = setTimeout(() => { timer.current = null; onAdvance(); setMoving(false); }, delay);
  }
  return <section className="card"><div className="section-meta"><p className="eyebrow">Your daily reflection</p><p className="small">{formatDay(draft.date)}</p></div><div className="progress" aria-label={`Prompt ${draft.promptIndex + 1} of 6`}>{prompts.map((_, i) => <span key={i} className={i <= draft.promptIndex ? 'filled' : ''}/>)}</div><div className={moving ? 'prompt moving' : 'prompt'}><p className="step">{String(draft.promptIndex + 1).padStart(2, '0')} / 06</p><h1><label htmlFor="answer">{prompt.label}</label></h1><p className="hint" id="answer-hint">{prompt.hint} You can leave this blank.</p><textarea ref={input} id="answer" readOnly={moving} aria-describedby="answer-hint" value={draft.answers[draft.promptIndex]} placeholder={prompt.placeholder} onChange={event => onChange(draft.promptIndex, event.target.value)}/></div><div className="card-footer"><p className="small" role="status">{moving ? '✓ A little progress, recorded.' : 'Your draft is kept as you write.'}</p><button className="primary" disabled={moving} onClick={done}>Done <span aria-hidden="true">→</span></button></div></section>;
}
