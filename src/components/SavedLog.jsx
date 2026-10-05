import { useEffect, useRef, useState } from 'react';
import { prompts } from '../config.js';
import { formatDay } from '../lib/calendar.js';
export default function SavedLog({ entry, onEdit, onRestart }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const menu = useRef(null);
  useEffect(() => { if (open) menu.current?.querySelector('button')?.focus(); }, [open]);
  function keyboard(event) {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); trigger.current.focus(); }
    if (open && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const items = [...menu.current.querySelectorAll('button')];
      const current = items.indexOf(document.activeElement);
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[index].focus();
    }
  }
  return <section className="card saved-card"><div className="saved-actions" onKeyDown={keyboard} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}><button ref={trigger} className="more-button" aria-label="Saved log actions" aria-haspopup="menu" aria-expanded={open} aria-controls="saved-actions-menu" onClick={() => setOpen(!open)} onKeyDown={event => { if (!open && event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); } }}>⋯</button>{open && <div ref={menu} id="saved-actions-menu" className="nav-popover" role="menu" aria-label="Saved log actions"><button role="menuitem" onClick={onEdit}>Edit</button><button role="menuitem" onClick={onRestart}>Start Over</button></div>}</div><p className="eyebrow">A day to remember</p><h1>{formatDay(entry.date)}</h1><p className="hint">Your saved reflection</p><dl className="saved-answers">{prompts.map((prompt, i) => <div key={prompt.label}><dt><span className="number">{i + 1}.</span> {prompt.label}</dt><dd className={entry.answers[i] ? '' : 'blank'}>{entry.answers[i] || 'No answer'}</dd></div>)}</dl></section>;
}
