import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Candidate } from '../types';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'tenri2026admin';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [resetConfirm, setResetConfirm] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const candidates = useQuery(api.candidates.getCandidates) as Candidate[] | undefined;
  const allVotes = useQuery(api.votes.getAllVotesAdmin);
  const totalVotes = useQuery(api.votes.getTotalVotes) ?? 0;
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const savePhotoUrl = useMutation(api.storage.savePhotoUrl);
  const resetVotes = useMutation(api.votes.resetAllVotes);

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setPwError('Wrong password. Try again.');
    }
  };

  const handlePhotoUpload = async (candidate: Candidate, file: File) => {
    setUploading(candidate._id);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const { storageId } = await res.json();
      const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
      const url = `${convexUrl}/api/storage/${storageId}`;
      await savePhotoUrl({ candidateId: candidate._id, storageId, url });
    } finally {
      setUploading(null);
    }
  };

  const handleReset = async () => {
    await resetVotes();
    setResetConfirm(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          className="w-full max-w-sm p-8 rounded-3xl"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Admin Access 🔐
          </h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-xl mb-3 outline-none"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          {pwError && (
            <p className="text-sm mb-3" style={{ color: 'var(--color-accent-2)' }}>
              {pwError}
            </p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl font-semibold text-white"
            style={{ background: 'var(--color-accent)' }}
          >
            Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Admin Panel
        </h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Total votes: <strong style={{ color: 'var(--color-accent)' }}>{totalVotes}</strong>
        </p>

        <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Candidates
        </h2>
        <div className="space-y-4 mb-12">
          {candidates?.map((c) => (
            <div
              key={c._id}
              className="p-5 rounded-2xl flex items-center gap-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              {c.photoUrl ? (
                <img
                  src={c.photoUrl}
                  alt={c.name}
                  className="w-14 h-14 rounded-full object-cover"
                  style={{ border: `2px solid ${c.colorHex}` }}
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl"
                  style={{ background: `${c.colorHex}22`, color: c.colorHex }}
                >
                  {c.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{c.class}</p>
              </div>
              <div>
                <input
                  ref={(el) => { fileRefs.current[c._id] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handlePhotoUpload(c, f);
                  }}
                />
                <button
                  onClick={() => fileRefs.current[c._id]?.click()}
                  disabled={uploading === c._id}
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    background: 'var(--color-surface-2)',
                    color: uploading === c._id ? 'var(--color-text-muted)' : 'var(--color-text)',
                  }}
                >
                  {uploading === c._id ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Vote Stats
        </h2>
        <div
          className="p-5 rounded-2xl mb-8"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <p style={{ color: 'var(--color-text-muted)' }}>{allVotes?.length ?? 0} votes recorded.</p>
          {allVotes && allVotes.length > 0 && (
            <div className="mt-3 space-y-1">
              {Object.entries(
                allVotes.reduce<Record<string, number>>((acc, v) => {
                  acc[v.voterClass] = (acc[v.voterClass] ?? 0) + 1;
                  return acc;
                }, {})
              )
                .sort((a, b) => b[1] - a[1])
                .map(([cls, count]) => (
                  <div key={cls} className="flex justify-between text-sm">
                    <span>{cls}</span>
                    <span style={{ color: 'var(--color-accent)' }}>{count} votes</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div
          className="p-5 rounded-2xl"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-accent-2)' }}
        >
          <h3 className="font-bold mb-2" style={{ color: 'var(--color-accent-2)' }}>
            Danger Zone
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Reset all votes. This cannot be undone.
          </p>
          {!resetConfirm ? (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-5 py-2 rounded-xl font-semibold text-white"
              style={{ background: 'var(--color-accent-2)' }}
            >
              Reset All Votes
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setResetConfirm(false)}
                className="flex-1 py-2 rounded-xl"
                style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl font-bold text-white"
                style={{ background: 'var(--color-accent-2)' }}
              >
                Yes, Reset Everything
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
