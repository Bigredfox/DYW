import { useEffect, useRef, useState } from 'react';
import Home from './components/Home.jsx';
import GuidedEntry from './components/GuidedEntry.jsx';
import Review from './components/Review.jsx';
import Completion from './components/Completion.jsx';
import SavedLog from './components/SavedLog.jsx';
import { localToday, formatDay } from './lib/calendar.js';
import { loadSnapshot, newDraft, withDraft, writeSnapshot, saveDraft } from './lib/storage.js';

export default function App() {
  const [snapshot, setSnapshot] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [writeError, setWriteError] = useState('');
  const [draft, setDraft] = useState(null);
  const [screen, setScreen] = useState('home');
  const [savedDate, setSavedDate] = useState(null);
  const pending = useRef(null);
  const main = useRef(null);
  const today = localToday();
  function load() {
    try { setSnapshot(loadSnapshot(window.localStorage, localToday())); setLoadError(''); }
    catch (error) { setLoadError(`We couldn’t open your local logs. ${error.message} Nothing has been reset.`); }
  }
  useEffect(load, []);
  useEffect(() => { if (screen !== 'prompt') main.current?.focus(); }, [screen]);
  function persistDraft(nextDraft) {
    setDraft(nextDraft);
    const next = withDraft(snapshot, nextDraft);
    try { setSnapshot(writeSnapshot(window.localStorage, next)); pending.current = null; setWriteError(''); }
    catch { pending.current = next; setWriteError('Your latest changes are only in this tab. Keep it open and retry to preserve your draft.'); }
  }
  function retry() {
    if (!pending.current) return;
    try { setSnapshot(writeSnapshot(window.localStorage, pending.current)); pending.current = null; setWriteError(''); }
    catch { setWriteError('Storage is still unavailable. Your latest answers remain in this tab. Please keep it open and retry.'); }
  }
  function start() {
    const existing = pending.current?.draftsByDate[today] ?? snapshot.draftsByDate[today];
    if (existing) { setDraft(existing); setScreen(existing.stage); }
    else if (snapshot.savedByDate[today]) { setSavedDate(today); setScreen('saved'); }
    else { persistDraft(newDraft(today)); setScreen('prompt'); }
  }
  function change(index, value) {
    const answers = [...draft.answers]; answers[index] = value;
    persistDraft({ ...draft, answers, updatedAt: new Date().toISOString() });
  }
  function advance() {
    const next = { ...draft, stage: draft.promptIndex === 5 ? 'review' : 'prompt', promptIndex: Math.min(5, draft.promptIndex + 1), updatedAt: new Date().toISOString() };
    persistDraft(next); setScreen(next.stage);
  }
  function save() {
    try {
      const next = saveDraft(window.localStorage, pending.current ?? snapshot, draft);
      setSnapshot(next); pending.current = null; setWriteError(''); setSavedDate(draft.date); setDraft(null); setScreen('complete');
    } catch (error) { setWriteError(`Your log wasn’t saved. ${error.message} Your answers remain here; try Save log again.`); }
  }
  function home() { if (draft) setDraft(null); setScreen('home'); }
  return <div className="app"><header className="site-header"><button className="brand" onClick={home}><span className="brand-mark" aria-hidden="true">◒</span> Daily Work Log</button><span className="header-note">A moment for yourself</span></header><main ref={main} tabIndex="-1">
    {loadError ? <section className="card" role="alert"><h1>Let’s keep your work safe.</h1><p>{loadError}</p><button className="primary" onClick={load}>Retry opening logs</button></section> : !snapshot ? <p role="status">Opening your space…</p> : <>
      {screen !== 'home' && <button className="back-link" onClick={home}>← Home</button>}
      {writeError && <div className="error-banner" role="alert"><p>{writeError}</p>{pending.current && <button className="secondary" onClick={retry}>Retry draft storage</button>}</div>}
      {screen === 'home' && <Home today={formatDay(today)} draft={(pending.current ?? snapshot).draftsByDate[today]} saved={snapshot.savedByDate[today]} onStart={start} onView={() => { setSavedDate(today); setScreen('saved'); }}/>}
      {screen === 'prompt' && draft && <GuidedEntry draft={draft} onChange={change} onAdvance={advance}/>}
      {screen === 'review' && draft && <Review draft={draft} onChange={change} onSave={save}/>}
      {screen === 'complete' && <Completion onHome={home} onView={() => setScreen('saved')}/>}
      {screen === 'saved' && snapshot.savedByDate[savedDate] && <SavedLog entry={snapshot.savedByDate[savedDate]}/>}
    </>}
  </main><footer className="site-footer">Made for reflection. Kept in this browser.</footer></div>;
}
