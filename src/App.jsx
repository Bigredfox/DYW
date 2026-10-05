import { useEffect, useRef, useState } from 'react';
import Home from './components/Home.jsx';
import GuidedEntry from './components/GuidedEntry.jsx';
import Review from './components/Review.jsx';
import Completion from './components/Completion.jsx';
import SavedLog from './components/SavedLog.jsx';
import DatePicker from './components/DatePicker.jsx';
import LogsBrowser from './components/LogsBrowser.jsx';
import DraftsBrowser from './components/DraftsBrowser.jsx';
import OverwriteDialog from './components/OverwriteDialog.jsx';
import { localToday, formatDay, canLogDate } from './lib/calendar.js';
import { loadSnapshot, newDraft, withDraft, writeSnapshot, saveDraft, prepareReplacement } from './lib/storage.js';

export default function App() {
  const [snapshot, setSnapshot] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [writeError, setWriteError] = useState('');
  const [draft, setDraft] = useState(null);
  const [screen, setScreen] = useState('home');
  const [savedDate, setSavedDate] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [overwriteOpen, setOverwriteOpen] = useState(false);
  const [notice, setNotice] = useState('');
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
    const next = withDraft(pending.current ?? snapshot, nextDraft);
    try { setSnapshot(writeSnapshot(window.localStorage, next)); pending.current = null; setWriteError(''); }
    catch { pending.current = next; setWriteError('Your latest changes are only in this tab. Keep it open and retry to preserve your draft.'); }
  }
  function retry() {
    if (!pending.current) return;
    try { setSnapshot(writeSnapshot(window.localStorage, pending.current)); pending.current = null; setWriteError(''); }
    catch { setWriteError('Storage is still unavailable. Your latest answers remain in this tab. Please keep it open and retry.'); }
  }
  function start(date = today) {
    if (!canLogDate(date, localToday())) { setWriteError('Choose today or a valid date in the past.'); return; }
    const existing = (pending.current ?? snapshot).draftsByDate[date];
    if (existing) { setDraft(existing); setScreen(existing.stage); }
    else if (snapshot.savedByDate[date]) { setSavedDate(date); setScreen('saved'); }
    else { persistDraft(newDraft(date)); setScreen('prompt'); }
  }
  function change(index, value) {
    const answers = [...draft.answers]; answers[index] = value;
    persistDraft({ ...draft, answers, updatedAt: new Date().toISOString() });
  }
  function advance() {
    const next = { ...draft, stage: draft.promptIndex === 5 ? 'review' : 'prompt', promptIndex: Math.min(5, draft.promptIndex + 1), updatedAt: new Date().toISOString() };
    persistDraft(next); setScreen(next.stage);
  }
  function save(confirmed = false) {
    if (snapshot.savedByDate[draft.date] && !confirmed) { setOverwriteOpen(true); return; }
    setOverwriteOpen(false);
    try {
      const next = saveDraft(window.localStorage, pending.current ?? snapshot, draft, confirmed);
      setSnapshot(next); pending.current = null; setWriteError(''); setNotice(''); setSavedDate(draft.date); setDraft(null); setScreen('complete');
    } catch (error) { setWriteError(`Your log wasn’t saved. ${error.message} Your answers remain here; try Save log again.`); }
  }
  function home() { setProfileOpen(false); setNotice(''); if (draft) setDraft(null); setScreen('home'); }
  function navigate(next) { setProfileOpen(false); setNotice(''); setDraft(null); setScreen(next); }
  function resume(entry) { setDraft(entry); setScreen(entry.stage); }
  function openSaved(date) { setSavedDate(date); setScreen('saved'); }
  function replace(mode) {
    const prepared = prepareReplacement(pending.current ?? snapshot, savedDate, mode);
    if (prepared.resumed) {
      setDraft(prepared.draft);
      setNotice('We found unfinished work for this day and resumed it. Your saved log is unchanged.');
    } else {
      persistDraft(prepared.draft);
      setNotice(mode === 'restart' ? 'You’re starting with blank answers. Your saved log stays safe until you confirm a replacement.' : 'Make your changes below. Your saved log stays safe until you confirm a replacement.');
    }
    setScreen(prepared.draft.stage);
  }
  return <div className="app"><header className="site-header"><button className="brand" onClick={home}><span className="brand-mark" aria-hidden="true">◒</span> Daily Work Log</button><div className="header-right"><span className="header-note">A moment for yourself</span>{snapshot && <div className="profile-nav" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setProfileOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') { setProfileOpen(false); event.currentTarget.querySelector('button').focus(); } }}><button className="secondary" aria-expanded={profileOpen} aria-controls="profile-links" onClick={() => setProfileOpen(!profileOpen)}>Profile <span aria-hidden="true">⌄</span></button>{profileOpen && <nav id="profile-links" aria-label="Profile" className="nav-popover"><button onClick={() => navigate('logs')}>Logs</button><button onClick={() => navigate('drafts')}>Drafts</button></nav>}</div>}</div></header><main ref={main} tabIndex="-1">
    {loadError ? <section className="card" role="alert"><h1>Let’s keep your work safe.</h1><p>{loadError}</p><button className="primary" onClick={load}>Retry opening logs</button></section> : !snapshot ? <p role="status">Opening your space…</p> : <>
      {screen !== 'home' && <button className="back-link" onClick={home}>← Home</button>}
      {writeError && <div className="error-banner" role="alert"><p>{writeError}</p>{pending.current && <button className="secondary" onClick={retry}>Retry draft storage</button>}</div>}
      {notice && <p className="notice-banner" role="status">{notice}</p>}
      {screen === 'home' && <Home today={formatDay(today)} draft={(pending.current ?? snapshot).draftsByDate[today]} saved={snapshot.savedByDate[today]} onStart={() => (pending.current ?? snapshot).draftsByDate[today] || snapshot.savedByDate[today] ? start() : setScreen('date')} onChooseDate={() => setScreen('date')} onView={() => openSaved(today)}/>}
      {screen === 'date' && <DatePicker today={today} onStart={start}/>}
      {screen === 'prompt' && draft && <GuidedEntry draft={draft} onChange={change} onAdvance={advance}/>}
      {screen === 'review' && draft && <Review draft={draft} onChange={change} onSave={() => save()}/>}
      {screen === 'complete' && <Completion date={savedDate} today={today} onHome={home} onView={() => setScreen('saved')}/>}
      {screen === 'saved' && snapshot.savedByDate[savedDate] && <SavedLog entry={snapshot.savedByDate[savedDate]} onEdit={() => replace('edit')} onRestart={() => replace('restart')}/>}
      {screen === 'logs' && <LogsBrowser snapshot={snapshot} onOpen={openSaved} onStart={() => start()}/>}
      {screen === 'drafts' && <DraftsBrowser draftsByDate={(pending.current ?? snapshot).draftsByDate} onResume={resume} onStart={() => start()}/>}
      {overwriteOpen && draft && <OverwriteDialog date={draft.date} onCancel={() => setOverwriteOpen(false)} onConfirm={() => save(true)}/>}
    </>}
  </main><footer className="site-footer">Made for reflection. Kept in this browser.</footer></div>;
}
