import { formatDay } from '../lib/calendar.js';
export default function DraftsBrowser({ draftsByDate, onResume, onStart, onDiscard, savedByDate }) {
  const drafts = Object.values(draftsByDate).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return <section className="card">
    <p className="eyebrow">Profile / Drafts</p><h1>Pick up where you left off.</h1>
    <p className="hint">Unfinished reflections keep their answers and original date.</p>
    {!drafts.length ? <div className="empty-state"><p>No unfinished reflections right now.</p><button className="primary" onClick={onStart}>Create a new log</button></div> :
      <div className="browse-list">{drafts.map(draft => {
        const label = savedByDate[draft.date] ? 'Discard changes' : 'Discard draft';
        return <div className="draft-row" key={draft.date}>
          <button className="browse-item" onClick={() => onResume(draft)}><span><strong>{formatDay(draft.date)}</strong><span className="item-detail">{draft.stage === 'review' ? 'Ready for review' : `Prompt ${draft.promptIndex + 1} of 6`} ? Updated {new Date(draft.updatedAt).toLocaleString()}</span></span><span aria-hidden="true">?</span></button>
          <button className="text-button danger" aria-label={`${label} for ${formatDay(draft.date)}`} onClick={() => onDiscard(draft.date)}>{label}</button>
        </div>;
      })}</div>}
  </section>;
}
