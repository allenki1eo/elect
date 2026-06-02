import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Leaderboard from '../components/Leaderboard';
import CountUp from '../components/CountUp';
import { CandidateWithVotes } from '../types';

export default function ResultsPage() {
  const results = useQuery(api.votes.getResults) as CandidateWithVotes[] | undefined;
  const totalVotes = useQuery(api.votes.getTotalVotes) ?? 0;

  return (
    <motion.div
      className="min-h-screen px-6 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-sm mb-8 inline-block" style={{ color: 'var(--color-text-muted)' }}>
          ← Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          🏆 Live Leaderboard
        </h1>
        <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Votes Ziko Online · Real-time results
        </p>

        <div
          className="flex items-center gap-3 mb-8 p-4 rounded-xl"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
        >
          <span className="text-2xl">🗳️</span>
          <div>
            <CountUp value={totalVotes} className="text-3xl font-bold font-mono" />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>total votes cast so far</p>
          </div>
        </div>

        {!results ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: 'var(--color-surface)' }} />
            ))}
          </div>
        ) : (
          <Leaderboard results={results} totalVotes={totalVotes} />
        )}

        <div className="mt-8 text-center">
          <Link
            to="/vote"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: 'var(--color-accent)' }}
          >
            Cast Your Vote 🗳️
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
