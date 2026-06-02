import { Candidate, Vote } from '../types';

interface Props {
  candidate: Candidate;
  vote: Vote;
}

export default function VotePoster({ candidate, vote }: Props) {
  return (
    <div
      id="vote-poster"
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        width: '1080px',
        height: '1080px',
        background: '#0A0A0F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Syne', sans-serif",
        color: '#F0F0FF',
        padding: '60px',
        textAlign: 'center',
        border: `4px solid ${candidate.colorHex}`,
        borderRadius: '32px',
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 4, marginBottom: 8, color: candidate.colorHex }}>
        ★ VOTES ZIKO ONLINE ★
      </div>
      <div style={{ fontSize: 18, color: '#8080A0', marginBottom: 48 }}>
        Tenri Primary School Elections 2026
      </div>
      {candidate.photoUrl ? (
        <img
          src={candidate.photoUrl}
          alt={candidate.name}
          style={{ width: 240, height: 240, borderRadius: '50%', objectFit: 'cover', border: `6px solid ${candidate.colorHex}`, marginBottom: 40 }}
        />
      ) : (
        <div style={{ width: 240, height: 240, borderRadius: '50%', background: `${candidate.colorHex}22`, border: `6px solid ${candidate.colorHex}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, fontWeight: 800, color: candidate.colorHex, marginBottom: 40 }}>
          {candidate.name.charAt(0)}
        </div>
      )}
      <div style={{ fontSize: 28, color: '#8080A0', marginBottom: 8 }}>I voted for</div>
      <div style={{ fontSize: 56, fontWeight: 800, color: candidate.colorHex, marginBottom: 4, lineHeight: 1.1 }}>
        {candidate.name.toUpperCase()}
      </div>
      <div style={{ fontSize: 24, color: '#8080A0', marginBottom: 40 }}>as School President!</div>
      <div style={{ fontSize: 22, color: '#F0F0FF', marginBottom: 64 }}>
        Voted by: <strong>{vote.voterName}</strong> · {vote.voterClass}
      </div>
      <div style={{ fontSize: 16, color: '#8080A0', marginTop: 'auto' }}>
        🗳️ Vote too at: <strong style={{ color: candidate.colorHex }}>tenrivotes.vercel.app</strong>
      </div>
    </div>
  );
}
