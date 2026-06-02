import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import CandidateCard from '../components/CandidateCard';
import VoteModal from '../components/VoteModal';
import { useVoteStatus } from '../hooks/useVoteStatus';
import { Candidate, CandidateWithVotes } from '../types';

export default function VotePage() {
  const candidates = useQuery(api.candidates.getCandidates) as Candidate[] | undefined;
  const results = useQuery(api.votes.getResults) as CandidateWithVotes[] | undefined;
  const [selected, setSelected] = useState<Candidate | null>(null);
  const { hasVoted, markVoted } = useVoteStatus();

  const getVoteCount = (id: string) =>
    results?.find((r) => r._id === id)?.voteCount ?? 0;

  return (
    <motion.div
      className="min-h-screen px-6 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-sm mb-8 inline-block" style={{ color: 'var(--color-text-muted)' }}>
          ← Back to Home
        </Link>
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Choose Your School President
        </h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Click a candidate to cast your vote. One vote per person.
        </p>

        {hasVoted && (
          <div
            className="mb-6 p-4 rounded-xl text-center"
            style={{
              background: 'rgba(34,211,160,0.1)',
              border: '1px solid var(--color-success)',
              color: 'var(--color-success)',
            }}
          >
            ✅ You've already cast your vote!{' '}
            <Link to="/results" style={{ color: 'var(--color-success)', textDecoration: 'underline' }}>
              See results →
            </Link>
          </div>
        )}

        {!candidates ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: 'var(--color-surface)' }} />
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
            onVoted={(token) => {
              markVoted(token);
              setSelected(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
