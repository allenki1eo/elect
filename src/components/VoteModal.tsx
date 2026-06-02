import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Candidate } from '../types';
import { useFingerprint } from '../hooks/useFingerprint';

interface Props {
  candidate: Candidate;
  onClose: () => void;
  onVoted: (shareToken: string) => void;
}

const CLASSES = [
  'Std 1A', 'Std 1B', 'Std 2A', 'Std 2B', 'Std 3A', 'Std 3B',
  'Std 4A', 'Std 4B', 'Std 5A', 'Std 5B', 'Std 6A', 'Std 6B',
  'Std 7A', 'Std 7B', 'Teacher', 'Parent',
];

type Step = 'confirm' | 'form' | 'processing' | 'success' | 'error';

export default function VoteModal({ candidate, onClose, onVoted }: Props) {
  const [step, setStep] = useState<Step>('confirm');
  const [voterName, setVoterName] = useState('');
  const [voterClass, setVoterClass] = useState('');
  const [shareToken, setShareToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fingerprint = useFingerprint();

  const handleSubmit = async () => {
    if (!voterName.trim() || !voterClass) return;
    setStep('processing');

    try {
      const convexSiteUrl = import.meta.env.VITE_CONVEX_URL?.replace('.cloud', '.site') ?? '';
      const res = await fetch(`${convexSiteUrl}/cast-vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidate._id,
          voterName: voterName.trim(),
          voterClass,
          fingerprint: fingerprint || 'unknown',
        }),
      });

      const data = await res.json();

      if (data.error === 'ALREADY_VOTED') {
        setErrorMsg(data.message);
        setStep('error');
        return;
      }

      setShareToken(data.shareToken);
      setStep('success');
      onVoted(data.shareToken);

      confetti({
        particleCount: 150,
        spread: 80,
        colors: ['#6C63FF', '#F5C842', '#FF6584', '#22D3A0'],
        origin: { y: 0.6 },
      });
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStep('error');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="w-full max-w-md rounded-3xl p-8 relative"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <AnimatePresence mode="wait">
          {step === 'confirm' && (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Confirm Your Vote
              </h2>
              <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
                You're voting for:
              </p>
              <div className="flex items-center gap-4 p-4 rounded-xl mb-6" style={{ background: `${candidate.colorHex}15`, border: `1px solid ${candidate.colorHex}40` }}>
                {candidate.photoUrl ? (
                  <img src={candidate.photoUrl} alt={candidate.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: `${candidate.colorHex}22`, color: candidate.colorHex }}>
                    {candidate.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: candidate.colorHex }}>{candidate.name}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{candidate.class}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
                  Cancel
                </button>
                <button onClick={() => setStep('form')} className="flex-1 py-3 rounded-xl font-semibold text-white" style={{ background: candidate.colorHex }}>
                  Yes, Vote!
                </button>
              </div>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Who Are You? 👋
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>First Name *</label>
                  <input
                    type="text"
                    value={voterName}
                    onChange={(e) => setVoterName(e.target.value)}
                    placeholder="e.g. Baraka"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>Your Class *</label>
                  <select
                    value={voterClass}
                    onChange={(e) => setVoterClass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: voterClass ? 'var(--color-text)' : 'var(--color-text-muted)' }}
                  >
                    <option value="">Select your class...</option>
                    {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('confirm')} className="flex-1 py-3 rounded-xl font-semibold" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!voterName.trim() || !voterClass}
                  className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-40"
                  style={{ background: candidate.colorHex }}
                >
                  Cast My Vote 🗳️
                </button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: `${candidate.colorHex} transparent transparent transparent` }} />
              <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>Sending your vote...</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-success)' }}>
                Vote Counted!
              </h2>
              <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Your vote for <strong style={{ color: candidate.colorHex }}>{candidate.name}</strong> has been counted!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = `/share/${shareToken}`}
                  className="flex-1 py-3 rounded-xl font-semibold text-white"
                  style={{ background: candidate.colorHex }}
                >
                  Share My Vote 📲
                </button>
                <button
                  onClick={() => window.location.href = '/results'}
                  className="flex-1 py-3 rounded-xl font-semibold"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
                >
                  Leaderboard 🏆
                </button>
              </div>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="text-5xl mb-4">😊</div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Already Voted!
              </h2>
              <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
                {errorMsg || 'Kura yako tayari imehesabiwa! You already voted.'}
              </p>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
                  Close
                </button>
                <button onClick={() => window.location.href = '/results'} className="flex-1 py-3 rounded-xl font-semibold text-white" style={{ background: 'var(--color-accent)' }}>
                  See Leaderboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
