import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Trophy, Vote, ChevronRight, Zap } from 'lucide-react';
import ParticleField from '../components/ParticleField';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import Logo from '../components/Logo';
import CountUp from '../components/CountUp';
import { CandidateWithVotes } from '../types';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

export default function HomePage() {
  const results = useQuery(api.votes.getResults) as CandidateWithVotes[] | undefined;
  const totalVotes = useQuery(api.votes.getTotalVotes) ?? 0;
  const top3 = results?.slice(0, 3) ?? [];
  const MEDALS = ['👑', '🥈', '🥉'];

  return (
    <motion.div
      className="relative min-h-screen flex flex-col"
      style={{ background: 'var(--color-bg)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">
        <ParticleField />
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-3xl mx-auto">
          {/* Logo + badge */}
          <motion.div variants={item} className="flex items-center justify-center gap-3 mb-6">
            <Logo size={64} />
            <div className="text-left">
              <div className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}>
                IEBC wa MCHONGO
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Tenri Primary School</div>
            </div>
          </motion.div>

          <motion.div variants={item} className="mb-3">
            <Badge className="text-xs px-3 py-1 bg-accent/10 text-accent border-accent/30">
              <Zap className="w-3 h-3 mr-1" /> Elections 2026 · Live
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl sm:text-7xl font-extrabold mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Votes Ziko{' '}
            <span className="relative">
              <span style={{ color: 'var(--color-accent)' }}>Online</span>
              <span className="absolute -bottom-1 left-0 w-full h-1 rounded-full" style={{ background: 'var(--color-accent)', opacity: 0.5 }} />
            </span>
            {' '}🗳️
          </motion.h1>

          <motion.p variants={item} className="text-lg sm:text-xl mb-10 max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Choose your School President. Real-time results. Your voice, your vote!
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="text-base font-bold shadow-lg shadow-accent/30">
              <Link to="/vote">
                <Vote className="w-5 h-5" />
                Cast Your Vote
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/results">
                <Trophy className="w-5 h-5" />
                Live Leaderboard
              </Link>
            </Button>
          </motion.div>

          {/* Total votes pill */}
          {totalVotes > 0 && (
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <CountUp value={totalVotes} className="font-bold font-mono" style={{ color: 'var(--color-success)' }} />
              <span style={{ color: 'var(--color-text-muted)' }}>votes cast live</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Mini leaderboard */}
      {top3.length > 0 && (
        <div className="px-6 pb-16 max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <Trophy className="w-5 h-5" style={{ color: 'var(--color-gold)' }} />
              Current Leaders
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/results">
                Full results <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {top3.map((c, i) => {
              const pct = totalVotes > 0 ? Math.round((c.voteCount / totalVotes) * 100) : 0;
              return (
                <Card key={c._id} className={i === 0 && c.voteCount > 0 ? 'gold-glow border-gold/50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl w-7">{MEDALS[i]}</span>
                      {c.photoUrl
                        ? <img src={c.photoUrl} alt={c.name} className="w-10 h-10 rounded-full object-cover" style={{ border: `2px solid ${c.colorHex}` }} />
                        : <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: `${c.colorHex}22`, color: c.colorHex }}>{c.name.charAt(0)}</div>
                      }
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{c.class}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-sm" style={{ color: c.colorHex }}>{c.voteCount}</span>
                        <span className="text-xs ml-1" style={{ color: 'var(--color-text-muted)' }}>{pct}%</span>
                      </div>
                    </div>
                    <Progress value={pct} indicatorColor={c.colorHex} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-sm border-t border-border" style={{ color: 'var(--color-text-muted)' }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Logo size={20} />
          <span>IEBC wa MCHONGO · Tenri Primary School Elections 2026</span>
        </div>
        <span className="text-xs">#VotesZikoOnline</span>
      </footer>
    </motion.div>
  );
}
