import { motion, AnimatePresence } from 'framer-motion';
import { CandidateWithVotes } from '../types';
import CountUp from './CountUp';

interface Props {
  results: CandidateWithVotes[];
  totalVotes: number;
  mini?: boolean;
}

const MEDALS = ['👑', '🥈', '🥉', ''];

export default function Leaderboard({ results, totalVotes, mini }: Props) {
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {results.map((c, i) => {
          const pct = totalVotes > 0 ? Math.round((c.voteCount / totalVotes) * 100) : 0;
          const isLeader = i === 0 && c.voteCount > 0;
          return (
            <motion.div
              key={c._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl p-4 ${isLeader ? 'gold-glow' : ''}`}
              style={{
                background: 'var(--color-surface)',
                border: `1.5px solid ${isLeader ? 'var(--color-gold)' : 'var(--color-border)'}`,
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl w-8">{MEDALS[i] || ''}</span>
                {c.photoUrl ? (
                  <img src={c.photoUrl} alt={c.name} className="w-10 h-10 rounded-full object-cover" style={{ border: `2px solid ${c.colorHex}` }} />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: `${c.colorHex}22`, color: c.colorHex, fontFamily: 'var(--font-display)' }}>
                    {c.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</p>
                  {!mini && <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{c.class}</p>}
                </div>
                <div className="text-right">
                  <CountUp value={c.voteCount} className="text-xl font-bold font-mono" />
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{pct}%</p>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: c.colorHex }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
