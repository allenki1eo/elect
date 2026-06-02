import html2canvas from 'html2canvas';

export async function generatePosterPng(elementId: string): Promise<string> {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Poster element not found');

  const canvas = await html2canvas(el, {
    width: 1080,
    height: 1080,
    scale: 1,
    useCORS: true,
    logging: false,
  });

  return canvas.toDataURL('image/png');
}

export function downloadPng(dataUrl: string, filename = 'my-vote.png') {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
