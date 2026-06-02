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
      whileHover={disabled ? {} : { y: -4, scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      className={`rounded-3xl overflow-hidden transition-all duration-200 ${disabled ? 'opacity-70 cursor-default' : 'cursor-pointer hover:shadow-xl'}`}
      style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.borderColor = candidate.colorHex; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; }}
    >
      <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${candidate.colorHex}, ${candidate.colorHex}88)` }} />

      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {candidate.photoUrl ? (
            <img src={candidate.photoUrl} alt={candidate.name}
              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
              style={{ border: `3px solid ${candidate.colorHex}30` }} />
          ) : (
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold flex-shrink-0"
              style={{ background: `${candidate.colorHex}10`, color: candidate.colorHex, border: `3px solid ${candidate.colorHex}20`, fontFamily: 'var(--font-display)' }}>
              {candidate.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="font-extrabold text-xl leading-tight mb-0.5 truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {candidate.name}
            </h3>
            <p className="text-sm font-semibold mb-1.5" style={{ color: candidate.colorHex }}>{candidate.nickname}</p>
            <span className="inline-block text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: `${candidate.colorHex}10`, color: candidate.colorHex }}>
              {candidate.class}
            </span>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
          {candidate.bio}
        </p>

        {candidate.manifesto.length > 0 && (
          <div className="space-y-1.5 mb-4">
            {candidate.manifesto.slice(0, 2).map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: candidate.colorHex }} />
                {m}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          {!disabled ? (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: `${candidate.colorHex}12`, color: candidate.colorHex }}>
              Vote for {candidate.nickname} →
            </span>
          ) : <span />}
          {voteCount !== undefined && (
            <span className="text-sm font-bold font-mono" style={{ color: 'var(--color-text-muted)' }}>
              {voteCount} <span className="font-normal text-xs">votes</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
