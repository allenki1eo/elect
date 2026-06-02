import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Candidate } from '../types';
import { useFingerprint } from '../hooks/useFingerprint';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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
        body: JSON.stringify({ candidateId: candidate._id, voterName: voterName.trim(), voterClass, fingerprint: fingerprint || 'unknown' }),
      });
      const data = await res.json();
      if (data.error === 'ALREADY_VOTED') { setErrorMsg(data.message); setStep('error'); return; }
      setShareToken(data.shareToken);
      setStep('success');
      onVoted(data.shareToken);
      confetti({ particleCount: 150, spread: 80, colors: ['#6C63FF', '#F5C842', '#FF6584', '#22D3A0'], origin: { y: 0.6 } });
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStep('error');
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <AnimatePresence mode="wait">
          {step === 'confirm' && (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle>Confirm Your Vote</DialogTitle>
              </DialogHeader>
              <p className="text-sm mt-1 mb-4" style={{ color: 'var(--color-text-muted)' }}>You're about to vote for:</p>
              <div className="flex items-center gap-4 p-4 rounded-2xl mb-6" style={{ background: `${candidate.colorHex}12`, border: `1px solid ${candidate.colorHex}40` }}>
                {candidate.photoUrl
                  ? <img src={candidate.photoUrl} alt={candidate.name} className="w-16 h-16 rounded-full object-cover" />
                  : <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: `${candidate.colorHex}22`, color: candidate.colorHex }}>{candidate.name.charAt(0)}</div>
                }
                <div>
                  <p className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)', color: candidate.colorHex }}>{candidate.name}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{candidate.class}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button className="flex-1" onClick={() => setStep('form')} style={{ background: candidate.colorHex }}>
                  Yes, Vote! 🗳️
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle>Who Are You? 👋</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>First Name *</label>
                  <Input
                    value={voterName}
                    onChange={(e) => setVoterName(e.target.value)}
                    placeholder="e.g. Baraka"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Your Class *</label>
                  <Select value={voterClass} onValueChange={setVoterClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your class..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('confirm')}>Back</Button>
                <Button
                  className="flex-1"
                  disabled={!voterName.trim() || !voterClass}
                  onClick={handleSubmit}
                  style={{ background: candidate.colorHex }}
                >
                  Cast My Vote 🗳️
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: `${candidate.colorHex} transparent transparent transparent` }} />
              <p style={{ color: 'var(--color-text-muted)' }}>Casting your vote...</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-success)' }}>
                Vote Counted!
              </h2>
              <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
                Your vote for <strong style={{ color: candidate.colorHex }}>{candidate.name}</strong> is in!
              </p>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => window.location.href = `/share/${shareToken}`} style={{ background: candidate.colorHex }}>
                  Share My Vote 📲
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/results'}>
                  Leaderboard 🏆
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="text-6xl mb-4">😊</div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Already Voted!</h2>
              <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
                {errorMsg || 'Kura yako tayari imehesabiwa! You already voted.'}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
                <Button className="flex-1" onClick={() => window.location.href = '/results'}>
                  See Leaderboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
