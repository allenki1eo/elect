import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import VotePoster from '../components/VotePoster';
import ShareButtons from '../components/ShareButtons';

export default function SharePage() {
  const { token } = useParams<{ token: string }>();
  const data = useQuery(api.votes.getVoteByShareToken, { shareToken: token ?? '' });

  if (data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-accent) transparent transparent transparent' }}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Vote not found
        </h2>
        <Link
          to="/vote"
          className="px-6 py-3 rounded-xl font-semibold text-white"
          style={{ background: 'var(--color-accent)' }}
        >
          Cast Your Vote
        </Link>
      </div>
    );
  }

  const { vote, candidate } = data;
  if (!candidate) return null;

  return (
    <motion.div
      className="min-h-screen px-6 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-sm mx-auto">
        <Link to="/" className="text-sm mb-8 inline-block" style={{ color: 'var(--color-text-muted)' }}>
          ← Back to Home
        </Link>

        <div
          className="rounded-2xl overflow-hidden mb-6 p-8 text-center"
          style={{ background: 'var(--color-surface-2)', border: `2px solid ${candidate.colorHex}` }}
        >
          {candidate.photoUrl ? (
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              style={{ border: `3px solid ${candidate.colorHex}` }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold"
              style={{ background: `${candidate.colorHex}22`, color: candidate.colorHex }}
            >
              {candidate.name.charAt(0)}
            </div>
          )}
          <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>I voted for</p>
          <h2
            className="text-2xl font-extrabold mb-1"
            style={{ fontFamily: 'var(--font-display)', color: candidate.colorHex }}
          >
            {candidate.name}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>as School President!</p>
          <p className="text-sm" style={{ color: 'var(--color-text)' }}>
            Voted by: <strong>{vote.voterName}</strong> · {vote.voterClass}
          </p>
        </div>

        <ShareButtons candidateName={candidate.name} token={token ?? ''} />
      </div>

      <VotePoster candidate={candidate} vote={vote} />
    </motion.div>
  );
}
