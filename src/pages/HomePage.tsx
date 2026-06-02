import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Trophy, Vote, ChevronRight, Zap, Users, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import Logo from '../components/Logo';
import CountUp from '../components/CountUp';
import { CandidateWithVotes } from '../types';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

export default function HomePage() {
  const results = useQuery(api.votes.getResults) as CandidateWithVotes[] | undefined;
  const totalVotes = useQuery(api.votes.getTotalVotes) ?? 0;
  const top4 = results?.slice(0, 4) ?? [];
  const MEDALS = ['👑', '🥈', '🥉', ''];

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-20 border-b border-border backdrop-blur-md" style={{ background: 'rgba(248,249,252,0.9)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <p className="font-bold text-sm leading-none" style={{ fontFamily: 'var(--font-display)' }}>Votes Ziko Online</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Tenri Primary School</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/results"><BarChart3 className="w-4 h-4 mr-1" /> Results</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/vote"><Vote className="w-4 h-4 mr-1" /> Vote Now</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <motion.div variants={container} initial="hidden" animate="show" className="py-20 md:py-28 text-center">
            <motion.div variants={item} className="mb-4">
              <Badge className="text-xs px-4 py-1.5 bg-accent/8 text-accent border-accent/20 font-semibold">
                <Zap className="w-3 h-3 mr-1.5" /> Elections 2026 · Live
              </Badge>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl sm:text-7xl font-extrabold mb-5 leading-[1.1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Choose Your{' '}
              <span className="relative inline-block">
                <span style={{ color: 'var(--color-accent)' }}>School President</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8 C 50 2, 100 2, 150 6 S 250 10, 298 4" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
              Tenri Primary School Elections 2026. Real-time results. Your voice, your vote. One click is all it takes!
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button asChild size="lg" className="text-base font-bold shadow-lg shadow-accent/20 px-10">
                <Link to="/vote">
                  <Vote className="w-5 h-5" />
                  Cast Your Vote
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link to="/results">
                  <Trophy className="w-5 h-5" />
                  See Live Results
                </Link>
              </Button>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={item} className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-success)' }} />
                <CountUp value={totalVotes} className="font-bold font-mono text-lg" />
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>votes cast</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <Users className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                <span className="font-bold font-mono text-lg">{top4.length}</span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>candidates</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Candidates Preview / Leaderboard */}
          {top4.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pb-20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                  <Trophy className="w-6 h-6" style={{ color: 'var(--color-gold)' }} />
                  Live Leaderboard
                </h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/results">
                    View all <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {top4.map((c, i) => {
                  const pct = totalVotes > 0 ? Math.round((c.voteCount / totalVotes) * 100) : 0;
                  const isLeader = i === 0 && c.voteCount > 0;
                  return (
                    <Card key={c._id} className={`transition-shadow hover:shadow-md ${isLeader ? 'ring-2 ring-gold/30' : ''}`}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-center w-8 flex-shrink-0">
                            <span className="text-2xl">{MEDALS[i]}</span>
                          </div>
                          {c.photoUrl ? (
                            <img src={c.photoUrl} alt={c.name} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" style={{ border: `2px solid ${c.colorHex}` }} />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0" style={{ background: `${c.colorHex}12`, color: c.colorHex, border: `2px solid ${c.colorHex}30` }}>
                              {c.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-lg truncate" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</p>
                            <p className="text-sm" style={{ color: c.colorHex }}>{c.nickname}</p>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{c.class}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-2xl font-bold font-mono">{c.voteCount}</p>
                            <p className="text-xs font-semibold" style={{ color: c.colorHex }}>{pct}%</p>
                          </div>
                        </div>
                        <Progress value={pct} indicatorColor={c.colorHex} className="h-2" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <Button asChild size="lg" className="shadow-lg shadow-accent/20">
                  <Link to="/vote">
                    <Vote className="w-5 h-5" />
                    Cast Your Vote Now
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo size={28} />
              <div>
                <p className="text-sm font-semibold">IEBC wa MCHONGO</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Tenri Primary School Elections 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <Link to="/vote" className="hover:text-accent transition-colors">Vote</Link>
              <Link to="/results" className="hover:text-accent transition-colors">Results</Link>
              <span>#VotesZikoOnline</span>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
