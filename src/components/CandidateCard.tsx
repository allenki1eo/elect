import { motion } from 'framer-motion';
import { Candidate } from '../types';

interface Props {
  candidate: Candidate;
  voteCount?: number;
  onClick: () => void;
  disabled?: boolean;
}

export default function CandidateCard({ candidate, voteCount, onClick, disabled }: Props) {
  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'var(--color-surface)',
        border: `1.5px solid var(--color-border)`,
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.borderColor = candidate.colorHex;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
      }}
    >
      <div
        className="h-1.5 w-full"
        style={{ background: candidate.colorHex }}
      />
      <div className="p-5">
        <div className="flex items-center gap-4 mb-3">
          {candidate.photoUrl ? (
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              className="w-16 h-16 rounded-full object-cover"
              style={{ border: `2px solid ${candidate.colorHex}` }}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{
                background: `${candidate.colorHex}22`,
                border: `2px solid ${candidate.colorHex}`,
                color: candidate.colorHex,
                fontFamily: 'var(--font-display)',
              }}
            >
              {candidate.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              {candidate.name}
            </h3>
            <p className="text-sm" style={{ color: candidate.colorHex }}>
              {candidate.nickname}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {candidate.class}
            </p>
          </div>
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
          {candidate.bio}
        </p>
        {voteCount !== undefined && (
          <div
            className="text-right text-xs font-mono font-semibold"
            style={{ color: candidate.colorHex, fontFamily: 'var(--font-mono)' }}
          >
            {voteCount} votes
          </div>
        )}
      </div>
    </motion.div>
  );
}
