import { motion } from 'framer-motion';
import { Candidate } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

interface Props {
  candidate: Candidate;
  voteCount?: number;
  onClick: () => void;
  disabled?: boolean;
}

export default function CandidateCard({ candidate, voteCount, onClick, disabled }: Props) {
  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      className={cn("cursor-pointer group", disabled && "opacity-75 cursor-default")}
    >
      <Card
        className="overflow-hidden transition-all duration-200 group-hover:shadow-lg"
        onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.borderColor = candidate.colorHex; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ''; }}
      >
        <div className="h-1.5 w-full transition-all duration-200" style={{ background: candidate.colorHex }} />
        <CardContent className="p-5">
          <div className="flex items-start gap-4 mb-3">
            {candidate.photoUrl ? (
              <img
                src={candidate.photoUrl}
                alt={candidate.name}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                style={{ border: `2px solid ${candidate.colorHex}` }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold flex-shrink-0"
                style={{ background: `${candidate.colorHex}18`, border: `2px solid ${candidate.colorHex}40`, color: candidate.colorHex, fontFamily: 'var(--font-display)' }}
              >
                {candidate.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg leading-tight truncate" style={{ fontFamily: 'var(--font-display)' }}>
                {candidate.name}
              </h3>
              <p className="text-sm font-semibold" style={{ color: candidate.colorHex }}>{candidate.nickname}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{candidate.class}</p>
            </div>
          </div>

          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
            {candidate.bio}
          </p>

          <div className="flex items-center justify-between">
            {!disabled && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: `${candidate.colorHex}18`, color: candidate.colorHex }}
              >
                Tap to vote →
              </span>
            )}
            {voteCount !== undefined && (
              <Badge variant="outline" className="ml-auto font-mono">
                {voteCount} votes
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
