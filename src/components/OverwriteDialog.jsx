import { useEffect, useRef } from 'react';
import { formatDay } from '../lib/calendar.js';
export default function OverwriteDialog({ date, onCancel, onConfirm }) {
  const dialog = useRef(null);
  const cancel = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const element = dialog.current;
    element.showModal();
    cancel.current.focus();
    return () => { element.close(); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, []);
  return <dialog ref={dialog} className="overwrite-dialog" aria-labelledby="overwrite-title" aria-describedby="overwrite-description" onCancel={event => { event.preventDefault(); onCancel(); }}><p className="eyebrow">Keep your work safe</p><h2 id="overwrite-title">Replace this saved log?</h2><p id="overwrite-description">Your reflection for {formatDay(date)} already exists. Confirming will replace its saved answers with the ones you just reviewed.</p><div className="button-row"><button ref={cancel} className="secondary" onClick={onCancel}>Cancel</button><button className="primary" onClick={onConfirm}>Replace saved log</button></div></dialog>;
}
