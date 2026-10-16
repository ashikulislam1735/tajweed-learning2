import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { downloadResultPdf } from '../utils/pdf.js';
import { Loading, ErrorBox } from '../components/StateBox.jsx';

const mmss = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

export default function QuizTake() {
  const { id } = useParams();
  const storageKey = `tajweed_quiz_${id}`;
  usePageTitle('কুইজ');

  const { data: quizzes, loading: listLoading, error: listError } = useFetch(api.quizzes, [id]);
  const quizInfo = useMemo(() => (quizzes || []).find((q) => q._id === id), [quizzes, id]);

  // session = সার্ভারের দেওয়া টোকেন + প্রশ্ন; রিফ্রেশ করলেও যাতে হারিয়ে না যায় তাই sessionStorage এ রাখা হয়
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [result, setResult] = useState(null);
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const answersRef = useRef({});
  const submittingRef = useRef(false);
  answersRef.current = answers;

  // পেজ খুললে আগের চলমান কুইজ থাকলে ফিরিয়ে আনি
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
      if (saved && saved.session.expiresAt + 30000 > Date.now()) {
        setSession(saved.session);
        setAnswers(saved.answers || {});
        setIndex(saved.index || 0);
      } else {
        sessionStorage.removeItem(storageKey);
      }
    } catch {
      sessionStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    if (session && !result) sessionStorage.setItem(storageKey, JSON.stringify({ session, answers, index }));
  }, [session, answers, index, result, storageKey]);

  const submit = useCallback(async () => {
    if (!session || submittingRef.current) return;
    submittingRef.current = true;
    setBusy(true);
    setError('');
    try {
      const res = await api.submitQuiz(id, { token: session.token, answers: answersRef.current });
      sessionStorage.removeItem(storageKey);
      setResult(res);
    } catch (err) {
      setError(err.message);
      submittingRef.current = false;
    } finally {
      setBusy(false);
    }
  }, [id, session, storageKey]);

  // টাইমার: প্রতি সেকেন্ডে বাকি সময় হিসাব, ০ হলে অটো জমা
  useEffect(() => {
    if (!session || result) return undefined;
    const tick = () => {
      const left = Math.max(0, Math.ceil((session.expiresAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) submit();
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [session, result, submit]);

  async function start(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const s = await api.startQuiz(id, { studentName: name, studentClass });
      setSession(s);
      setAnswers({});
      setIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // ---------- ফলাফল ----------
  if (result) return <ResultView result={result} />;

  // ---------- কুইজ চলছে ----------
  if (session) {
    const questions = session.questions;
    const q = questions[index];
    const total = questions.length;
    const isLast = index === total - 1;
    const picked = answers[q.id];

    return (
      <section className="section">
        <div className="container narrow">
          <div className="quiz-bar">
            <span>প্রশ্ন {index + 1}/{total}</span>
            <span className={remaining <= 30 ? 'timer-low' : ''}>⏱ বাকি সময়: {mmss(remaining)}</span>
          </div>
          <div className="progress" aria-hidden="true"><div style={{ width: `${((index + 1) / total) * 100}%` }} /></div>

          {error && <ErrorBox message={error} />}

          <div className="question-block">
            <p className="question-text">{q.text}</p>
            {q.imageUrl && <img className="question-img" src={q.imageUrl} alt="প্রশ্নের ছবি" />}
            <div role="radiogroup" aria-label="উত্তর বেছে নিন">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <label key={opt} className={`option-label ${picked === opt ? 'picked' : ''}`}>
                  <input type="radio" name={`q_${q.id}`} checked={picked === opt} onChange={() => setAnswers({ ...answers, [q.id]: opt })} />
                  <span className="option-letter">{opt}</span>
                  {q.options[opt]}
                </label>
              ))}
            </div>
          </div>

          <div className="quiz-nav">
            <button className="btn btn-outline-dark" onClick={() => setIndex(index - 1)} style={{ visibility: index === 0 ? 'hidden' : 'visible' }}>← আগের প্রশ্ন</button>
            {isLast ? (
              <button className="btn btn-gold" onClick={submit} disabled={busy || !picked}>{busy ? 'জমা হচ্ছে...' : 'উত্তর জমা দিন'}</button>
            ) : (
              <button className="btn btn-gold" onClick={() => setIndex(index + 1)} disabled={!picked}>পরবর্তী প্রশ্ন →</button>
            )}
          </div>
          {!picked && <p className="muted small center">পরের ধাপে যেতে একটা উত্তর বেছে নিন।</p>}
        </div>
      </section>
    );
  }

  // ---------- শুরুর ফর্ম ----------
  if (listLoading) return <div className="container section"><Loading /></div>;
  if (listError) return <div className="container section"><ErrorBox message={listError} /></div>;
  if (!quizInfo) {
    return (
      <section className="section">
        <div className="container narrow center">
          <p>কুইজটি পাওয়া যায়নি বা এখন সক্রিয় নেই।</p>
          <Link to="/quiz" className="btn btn-gold">সব কুইজ দেখুন</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="form-card">
          <h2 className="section-title">{quizInfo.title}</h2>
          <p className="section-sub">
            {quizInfo.description ? `${quizInfo.description} — ` : ''}সময়সীমা: {quizInfo.timeLimitMinutes} মিনিট, মোট {quizInfo.questionCount} টি প্রশ্ন
          </p>
          {error && <ErrorBox message={error} />}
          <form onSubmit={start}>
            <div className="form-group">
              <label htmlFor="qname">তোমার নাম *</label>
              <input id="qname" value={name} onChange={(e) => setName(e.target.value)} required maxLength={150} />
            </div>
            <div className="form-group">
              <label htmlFor="qclass">ক্লাস / রোল</label>
              <input id="qclass" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} maxLength={100} />
            </div>
            <button type="submit" className="btn btn-gold" disabled={busy}>{busy ? 'শুরু হচ্ছে...' : 'কুইজ শুরু করুন'}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ResultView({ result }) {
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState('');

  async function onPdf() {
    setPdfBusy(true);
    setPdfError('');
    try {
      await downloadResultPdf(result);
    } catch (err) {
      setPdfError(err.message);
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="result-box">
          <p className="muted">কুইজ সম্পন্ন হয়েছে, {result.studentName}!</p>
          <div className="score">{result.score}/{result.total}</div>
          <p className="percent">{result.percentage}% সঠিক উত্তর</p>

          {result.wrong.length > 0 ? (
            <div className="wrong-list">
              <h3>যে প্রশ্নগুলো ভুল হয়েছে</h3>
              {result.wrong.map((w, i) => (
                <div className="wrong-card" key={i}>
                  <p className="wrong-q">{i + 1}. {w.question}</p>
                  <p className="wrong-given">তোমার উত্তর: {w.given}</p>
                  <p className="wrong-correct">সঠিক উত্তর: {w.correct}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="percent">মাশাআল্লাহ! সবগুলো প্রশ্নের উত্তর সঠিক হয়েছে!</p>
          )}

          {pdfError && <ErrorBox message={pdfError} />}
          <div className="btn-row center-row">
            <button className="btn btn-outline-dark" onClick={onPdf} disabled={pdfBusy}>{pdfBusy ? 'তৈরি হচ্ছে...' : 'PDF ডাউনলোড করুন'}</button>
            <Link to="/quiz" className="btn btn-outline-dark">আরও কুইজ দেখুন</Link>
            <Link to="/" className="btn btn-gold">হোমপেজে ফিরুন</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
