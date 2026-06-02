import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
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
    <motion.div
      className="min-h-screen px-6 py-12"
      style={{ background: 'var(--color-bg)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-1" /> Home</Link>
          </Button>
          <Logo size={40} />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Choose Your School President 🗳️
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Tenri Primary School Elections 2026 · One vote per person
          </p>
        </div>

        {hasVoted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-2xl flex items-center gap-3"
            style={{ background: 'rgba(34,211,160,0.08)', border: '1px solid rgba(34,211,160,0.3)' }}
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
            <p className="text-sm" style={{ color: 'var(--color-success)' }}>
              You've already cast your vote!{' '}
              <Link to="/results" className="underline font-semibold">See live results →</Link>
            </p>
          </motion.div>
        )}

        {!candidates ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-52 rounded-2xl animate-pulse" style={{ background: 'var(--color-surface)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {candidates.map((c) => (
              <CandidateCard
                key={c._id}
                candidate={c}
                voteCount={getVoteCount(c._id)}
                onClick={() => setSelected(c)}
                disabled={hasVoted}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <VoteModal
            candidate={selected}
            onClose={() => setSelected(null)}
            onVoted={(token) => { markVoted(token); setSelected(null); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
