import { useState, useEffect } from 'react';

export function useVoteStatus() {
  const [hasVoted, setHasVoted] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('vzo_vote');
    if (stored) {
      const data = JSON.parse(stored);
      setHasVoted(true);
      setShareToken(data.shareToken);
    }
  }, []);

  const markVoted = (token: string) => {
    localStorage.setItem('vzo_vote', JSON.stringify({ shareToken: token, votedAt: Date.now() }));
    setHasVoted(true);
    setShareToken(token);
  };

  return { hasVoted, shareToken, markVoted };
}
