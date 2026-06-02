import { useState } from 'react';
import { buildWhatsAppUrl, buildShareUrl, copyToClipboard } from '../lib/share';
import { generatePosterPng, downloadPng } from '../lib/poster';

interface Props {
  candidateName: string;
  token: string;
}

export default function ShareButtons({ candidateName, token }: Props) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const siteUrl = import.meta.env.VITE_SITE_URL ?? 'https://tenrivotes.vercel.app';
  const shareUrl = buildShareUrl(token, siteUrl);
  const waUrl = buildWhatsAppUrl(candidateName, token, siteUrl);

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const png = await generatePosterPng('vote-poster');
      downloadPng(png, `vote-${candidateName.toLowerCase().replace(' ', '-')}.png`);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <button onClick={handleDownload} disabled={generating} className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: 'var(--color-accent)' }}>
        {generating ? 'Generating...' : '⬇️ Download Poster'}
      </button>
      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl font-semibold text-center text-white block" style={{ background: '#25D366' }}>
        📲 Share on WhatsApp
      </a>
      <button onClick={handleCopy} className="w-full py-3 rounded-xl font-semibold" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}>
        {copied ? '✅ Link Copied!' : '🔗 Copy Link'}
      </button>
      <a href="/vote" className="w-full py-3 rounded-xl font-semibold text-center block" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
        🗳️ Vote Too!
      </a>
    </div>
  );
}
