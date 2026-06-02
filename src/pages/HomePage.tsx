import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ParticleField from '../components/ParticleField';
import Leaderboard from '../components/Leaderboard';
import { CandidateWithVotes } from '../types';

export default function HomePage() {
  const results = useQuery(api.votes.getResults) as CandidateWithVotes[] | undefined;
  const totalVotes = useQuery(api.votes.getTotalVotes) ?? 0;
  const top2 = results?.slice(0, 2) ?? [];

  return (
    <motion.div
      className="relative min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <ParticleField />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
          >
            Tenri Primary School · Elections 2025
          </motion.div>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-display)', lineHeight: 1.1 }}
          >
            Votes Ziko{' '}
            <span style={{ color: 'var(--color-accent)' }}>Online</span>
            {' '}🗳️
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl mb-10 max-w-lg mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Choose your School President. Live results. Real-time leaderboard. Your vote counts!
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/vote"
              className="px-8 py-4 rounded-2xl font-bold text-lg text-white"
              style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
            >
              Cast Your Vote 🗳️
            </Link>
            <Link
              to="/results"
              className="px-8 py-4 rounded-2xl font-bold text-lg"
              style={{
                background: 'var(--color-surface-2)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-display)',
              }}
            >
              See Live Results 🏆
            </Link>
          </motion.div>
        </div>
      </div>

      {top2.length > 0 && (
        <div className="px-6 pb-16 max-w-lg mx-auto w-full">
          <h2
            className="text-xl font-bold mb-4 text-center"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}
          >
            Current Leaders
          </h2>
          <Leaderboard results={top2} totalVotes={totalVotes} mini />
        </div>
      )}

      <footer
        className="py-6 text-center text-sm"
        style={{ color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)' }}
      >
        Tenri Primary School Elections 2025 · #VotesZikoOnline
      </footer>
    </motion.div>
  );
}
