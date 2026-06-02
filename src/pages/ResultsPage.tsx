import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ArrowLeft, Trophy, Vote } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import Logo from '../components/Logo';
import CountUp from '../components/CountUp';
import { CandidateWithVotes } from '../types';

const MEDALS = ['👑', '🥈', '🥉', ''];
const MEDAL_LABELS = ['1st Place', '2nd Place', '3rd Place', '4th Place'];

export default function ResultsPage() {
  const results = useQuery(api.votes.getResults) as CandidateWithVotes[] | undefined;
  const totalVotes = useQuery(api.votes.getTotalVotes) ?? 0;

  return (
    <motion.div
      className="min-h-screen px-6 py-12"
      style={{ background: 'var(--color-bg)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-1" /> Home</Link>
          </Button>
          <Logo size={40} />
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-success/10 text-success border-success/30 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse mr-1.5 inline-block" />
              Live
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
            <Trophy style={{ color: 'var(--color-gold)' }} className="w-10 h-10" />
            Leaderboard
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Tenri Primary School Elections 2026</p>
        </div>

        {/* Total votes */}
        <Card className="mb-6">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(108,99,255,0.15)' }}>
              🗳️
            </div>
            <div>
              <CountUp value={totalVotes} className="text-4xl font-bold font-mono" />
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>total votes cast</p>
            </div>
          </CardContent>
        </Card>

        <Separator className="mb-6" />

        {/* Leaderboard */}
        {!results ? (
          <div className="space-y-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: 'var(--color-surface)' }} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((c, i) => {
              const pct = totalVotes > 0 ? Math.round((c.voteCount / totalVotes) * 100) : 0;
              const isLeader = i === 0 && c.voteCount > 0;
              return (
                <motion.div
                  key={c._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={isLeader ? 'gold-glow border-gold/60' : ''}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-center w-8">
                          <div className="text-2xl">{MEDALS[i]}</div>
                          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{MEDAL_LABELS[i]}</div>
                        </div>
                        {c.photoUrl ? (
                          <img src={c.photoUrl} alt={c.name} className="w-14 h-14 rounded-full object-cover" style={{ border: `3px solid ${c.colorHex}` }} />
                        ) : (
                          <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: `${c.colorHex}22`, color: c.colorHex, border: `3px solid ${c.colorHex}` }}>
                            {c.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</p>
                          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{c.class}</p>
                        </div>
                        <div className="text-right">
                          <CountUp value={c.voteCount} className="text-2xl font-bold font-mono" />
                          <p className="text-sm font-semibold" style={{ color: c.colorHex }}>{pct}%</p>
                        </div>
                      </div>
                      <Progress value={pct} indicatorColor={c.colorHex} className="h-2.5" />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link to="/vote">
              <Vote className="w-5 h-5" />
              Cast Your Vote 🗳️
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
