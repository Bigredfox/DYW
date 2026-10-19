import { useEffect, useRef, useState } from 'react';
import { formatDay } from '../lib/calendar.js';

export default function DiscardDialog({ action, onCancel, onConfirm }) {
  const dialog = useRef(null);
  const cancel = useRef(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const previous = document.activeElement;
    const element = dialog.current;
    element.showModal();
    cancel.current.focus();
    return () => { element.close(); if (previous?.isConnected) previous.focus(); };
  }, []);
  const deleting = action.kind === 'saved';
  const label = deleting ? 'Delete saved log' : action.hasSaved ? 'Discard changes' : 'Discard draft';
  return <dialog ref={dialog} className="overwrite-dialog" aria-labelledby="discard-title" aria-describedby="discard-description" onCancel={event => { event.preventDefault(); onCancel(); }}>
    <p className="eyebrow">Keep what matters</p><h2 id="discard-title">{label}?</h2>
    <p id="discard-description">{formatDay(action.date)}. {deleting ? 'This permanently removes the saved log. Any unfinished draft for this day will stay available.' : action.hasSaved ? 'This removes the unfinished answers and edits for this day. Your saved log will stay unchanged.' : 'This permanently removes the unfinished answers for this day.'} This cannot be undone.</p>
    {error && <p role="alert">{error}</p>}
    <div className="button-row"><button ref={cancel} className="secondary" onClick={onCancel}>Cancel</button><button className="secondary danger" onClick={() => { try { onConfirm(); } catch { setError('Storage is unavailable. Nothing was removed. Keep this tab open and try again.'); } }}>{label}</button></div>
  </dialog>;
}
