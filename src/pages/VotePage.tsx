import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ArrowLeft, CheckCircle2, Vote } from 'lucide-react';
import CandidateCard from '../components/CandidateCard';
import VoteModal from '../components/VoteModal';
import { useVoteStatus } from '../hooks/useVoteStatus';
import { Button } from '../components/ui/button';
import Logo from '../components/Logo';
import { Candidate, CandidateWithVotes } from '../types';

export default function VotePage() {
  const candidates = useQuery(api.candidates.getCandidates) as Candidate[] | undefined;
  const results = useQuery(api.votes.getResults) as CandidateWithVotes[] | undefined;
  const [selected, setSelected] = useState<Candidate | null>(null);
  const { hasVoted, markVoted } = useVoteStatus();

  const getVoteCount = (id: string) => results?.find((r) => r._id === id)?.voteCount ?? 0;

  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-border backdrop-blur-md" style={{ background: 'rgba(248,249,252,0.9)' }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-1" /> Home</Link>
          </Button>
          <Logo size={36} />
          <Link to="/results" className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Results →</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(108,99,255,0.08)', color: 'var(--color-accent)', border: '1px solid rgba(108,99,255,0.15)' }}>
            <Vote className="w-4 h-4" /> Tenri Primary School Elections 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Choose Your President 🗳️
          </h1>
          <p className="text-lg max-w-md mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Tap a candidate to cast your vote. One vote per person.
          </p>
        </div>

        {hasVoted && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 rounded-2xl flex items-center gap-3 max-w-lg mx-auto"
            style={{ background: 'rgba(22,160,122,0.08)', border: '1px solid rgba(22,160,122,0.25)' }}>
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
            <p className="text-sm" style={{ color: 'var(--color-success)' }}>
              You've already voted! <Link to="/results" style={{ fontWeight: 700, textDecoration: 'underline' }}>See live results →</Link>
            </p>
          </motion.div>
        )}

        {!candidates ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[1,2,3,4].map((i) => <div key={i} className="h-52 rounded-3xl animate-pulse" style={{ background: 'var(--color-surface-2)' }} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {candidates.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <CandidateCard candidate={c} voteCount={getVoteCount(c._id)} onClick={() => setSelected(c)} disabled={hasVoted} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <VoteModal candidate={selected} onClose={() => setSelected(null)}
            onVoted={(token) => { markVoted(token); setSelected(null); }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
