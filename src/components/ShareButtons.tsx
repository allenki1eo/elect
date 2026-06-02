import { useState } from 'react';
import { Download, MessageCircle, Link2, Vote } from 'lucide-react';
import { buildWhatsAppUrl, buildShareUrl, copyToClipboard } from '../lib/share';
import { generatePosterPng, downloadPng } from '../lib/poster';
import { Button } from './ui/button';

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
      <Button size="lg" onClick={handleDownload} disabled={generating} className="w-full">
        <Download className="w-4 h-4" />
        {generating ? 'Generating...' : 'Download Poster'}
      </Button>
      <Button size="lg" variant="whatsapp" className="w-full" asChild>
        <a href={waUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="w-4 h-4" />
          Share on WhatsApp
        </a>
      </Button>
      <Button size="lg" variant="outline" className="w-full" onClick={handleCopy}>
        <Link2 className="w-4 h-4" />
        {copied ? '✅ Copied!' : 'Copy Link'}
      </Button>
      <Button size="lg" variant="ghost" className="w-full" asChild>
        <a href="/vote">
          <Vote className="w-4 h-4" />
          Vote Too!
        </a>
      </Button>
    </div>
  );
}
