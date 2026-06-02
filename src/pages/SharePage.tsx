import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ArrowLeft } from 'lucide-react';
import VotePoster from '../components/VotePoster';
import ShareButtons from '../components/ShareButtons';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Logo from '../components/Logo';

export default function SharePage() {
  const { token } = useParams<{ token: string }>();
  const data = useQuery(api.votes.getVoteByShareToken, { shareToken: token ?? '' });

  if (data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent) transparent transparent transparent' }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: 'var(--color-bg)' }}>
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Vote not found</h2>
        <Button asChild><Link to="/vote">Cast Your Vote</Link></Button>
      </div>
    );
  }

  const { vote, candidate } = data;
  if (!candidate) return null;

  return (
    <motion.div
      className="min-h-screen px-6 py-12"
      style={{ background: 'var(--color-bg)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-1" /> Home</Link>
          </Button>
          <Logo size={36} />
        </div>

        <h1 className="text-3xl font-extrabold mb-6 text-center" style={{ fontFamily: 'var(--font-display)' }}>
          My Vote 🗳️
        </h1>

        <Card className="mb-6 overflow-hidden" style={{ border: `2px solid ${candidate.colorHex}40` }}>
          <div className="h-1.5 w-full" style={{ background: candidate.colorHex }} />
          <CardContent className="p-8 text-center">
            {candidate.photoUrl ? (
              <img src={candidate.photoUrl} alt={candidate.name} className="w-28 h-28 rounded-full object-cover mx-auto mb-4" style={{ border: `4px solid ${candidate.colorHex}` }} />
            ) : (
              <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl font-bold" style={{ background: `${candidate.colorHex}22`, color: candidate.colorHex, border: `4px solid ${candidate.colorHex}` }}>
                {candidate.name.charAt(0)}
              </div>
            )}
            <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>I voted for</p>
            <h2 className="text-3xl font-extrabold mb-1" style={{ fontFamily: 'var(--font-display)', color: candidate.colorHex }}>
              {candidate.name}
            </h2>
            <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>as School President!</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <span>Voted by</span>
              <strong>{vote.voterName}</strong>
              <span style={{ color: 'var(--color-text-muted)' }}>·</span>
              <span style={{ color: 'var(--color-text-muted)' }}>{vote.voterClass}</span>
            </div>
          </CardContent>
        </Card>

        <ShareButtons candidateName={candidate.name} token={token ?? ''} />
      </div>

      <VotePoster candidate={candidate} vote={vote} />
    </motion.div>
  );
}
