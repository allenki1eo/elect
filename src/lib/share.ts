export function buildWhatsAppUrl(candidateName: string, token: string, siteUrl: string): string {
  const text = `🗳️ Nimepiga kura! Napiga kura kwa ${candidateName} kuwa School President wa Tenri Primary School!\nWewe pia piga kura hapa: ${siteUrl}/share/${token}\n#VotesZikoOnline #TenriPrimary`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function buildShareUrl(token: string, siteUrl: string): string {
  return `${siteUrl}/share/${token}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
