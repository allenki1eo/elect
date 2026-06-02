import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import {
  LayoutDashboard, Users, BarChart3, Settings, Plus, Upload,
  Trash2, Edit3, Eye, EyeOff, ChevronRight, Vote, Trophy, LogOut,
  X, Save, ImagePlus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import Logo from '../components/Logo';
import CountUp from '../components/CountUp';
import { Candidate, CandidateWithVotes } from '../types';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'tenri2026admin';

const CANDIDATE_COLORS = [
  { label: 'Violet', hex: '#6C63FF' },
  { label: 'Pink', hex: '#FF6584' },
  { label: 'Teal', hex: '#22D3A0' },
  { label: 'Gold', hex: '#F5C842' },
  { label: 'Orange', hex: '#FF8C42' },
  { label: 'Blue', hex: '#3B82F6' },
  { label: 'Red', hex: '#EF4444' },
  { label: 'Purple', hex: '#A855F7' },
];

type Tab = 'dashboard' | 'candidates' | 'results' | 'settings';

interface CandidateForm {
  name: string;
  nickname: string;
  class: string;
  bio: string;
  manifesto: string[];
  colorHex: string;
  order: number;
}

const emptyForm: CandidateForm = {
  name: '', nickname: '', class: '', bio: '',
  manifesto: ['', '', ''], colorHex: '#6C63FF', order: 1,
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [form, setForm] = useState<CandidateForm>(emptyForm);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const allCandidates = useQuery(api.candidates.getAllCandidates) as Candidate[] | undefined;
  const results = useQuery(api.votes.getResults) as CandidateWithVotes[] | undefined;
  const allVotes = useQuery(api.votes.getAllVotesAdmin);
  const totalVotes = useQuery(api.votes.getTotalVotes) ?? 0;

  const addCandidate = useMutation(api.candidates.addCandidate);
  const updateCandidate = useMutation(api.candidates.updateCandidate);
  const deleteCandidate = useMutation(api.candidates.deleteCandidate);
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

  const openAdd = () => {
    const nextOrder = (allCandidates?.length ?? 0) + 1;
    setForm({ ...emptyForm, order: nextOrder });
    setEditingCandidate(null);
    setShowAddModal(true);
  };

  const openEdit = (c: Candidate) => {
    setForm({
      name: c.name,
      nickname: c.nickname,
      class: c.class,
      bio: c.bio,
      manifesto: [...c.manifesto, '', '', ''].slice(0, 3),
      colorHex: c.colorHex,
      order: c.order,
    });
    setEditingCandidate(c);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.nickname.trim()) return;
    const manifesto = form.manifesto.filter(m => m.trim());

    if (editingCandidate) {
      await updateCandidate({
        id: editingCandidate._id,
        name: form.name.trim(),
        nickname: form.nickname.trim(),
        class: form.class.trim(),
        bio: form.bio.trim(),
        manifesto,
        colorHex: form.colorHex,
        order: form.order,
      });
    } else {
      await addCandidate({
        name: form.name.trim(),
        nickname: form.nickname.trim(),
        class: form.class.trim(),
        bio: form.bio.trim(),
        manifesto,
        colorHex: form.colorHex,
        order: form.order,
      });
    }
    setShowAddModal(false);
    setEditingCandidate(null);
  };

  const handleToggleActive = async (c: Candidate) => {
    await updateCandidate({ id: c._id, isActive: !c.isActive });
  };

  const handleDelete = async (id: string) => {
    await deleteCandidate({ id: id as any });
    setDeleteConfirm(null);
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

  const updateManifesto = (index: number, value: string) => {
    const updated = [...form.manifesto];
    updated[index] = value;
    setForm({ ...form, manifesto: updated });
  };

  // --- Login Screen ---
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4"><Logo size={64} /></div>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>IEBC wa MCHONGO · Election Management</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                placeholder="Enter admin password"
              />
              {pwError && <p className="text-sm" style={{ color: 'var(--color-accent-2)' }}>{pwError}</p>}
              <Button className="w-full" onClick={handleLogin}>Login</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // --- Sidebar Nav Items ---
  const navItems: { icon: typeof LayoutDashboard; label: string; tab: Tab }[] = [
    { icon: LayoutDashboard, label: 'Dashboard', tab: 'dashboard' },
    { icon: Users, label: 'Candidates', tab: 'candidates' },
    { icon: BarChart3, label: 'Live Results', tab: 'results' },
    { icon: Settings, label: 'Settings', tab: 'settings' },
  ];

  // Class distribution from votes
  const classDistribution = allVotes
    ? Object.entries(
        allVotes.reduce<Record<string, number>>((acc, v) => {
          acc[v.voterClass] = (acc[v.voterClass] ?? 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-border p-6" style={{ background: 'var(--color-surface)' }}>
        <div className="flex items-center gap-3 mb-8">
          <Logo size={36} />
          <div>
            <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>IEBC wa MCHONGO</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Election Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ icon: Icon, label, tab: t }) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: tab === t ? 'var(--color-accent)' : 'transparent',
                color: tab === t ? 'white' : 'var(--color-text-muted)',
              }}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>

        <Separator className="my-4" />

        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/"><Vote className="w-4 h-4 mr-2" /> Vote Page</Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/results"><Trophy className="w-4 h-4 mr-2" /> Public Results</Link>
          </Button>
        </div>

        <Separator className="my-4" />

        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setAuthed(false)}>
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* --- DASHBOARD TAB --- */}
          {tab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Tenri Primary School · Elections 2026</p>
                </div>
                <Badge className="bg-success/10 text-success border-success/30 text-sm px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse mr-2 inline-block" />
                  Active
                </Badge>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(108,99,255,0.15)' }}>
                        <Vote className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Total Votes</p>
                        <CountUp value={totalVotes} className="text-3xl font-bold font-mono" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,211,160,0.15)' }}>
                        <Users className="w-6 h-6" style={{ color: 'var(--color-success)' }} />
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Candidates</p>
                        <p className="text-3xl font-bold font-mono">{allCandidates?.length ?? 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,200,66,0.15)' }}>
                        <BarChart3 className="w-6 h-6" style={{ color: 'var(--color-gold)' }} />
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Classes Voting</p>
                        <p className="text-3xl font-bold font-mono">{classDistribution.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => { setTab('candidates'); setTimeout(openAdd, 100); }}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/15">
                      <Plus className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Add Candidate</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Register a new candidate for the election</p>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto" style={{ color: 'var(--color-text-muted)' }} />
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => setTab('results')}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gold/15">
                      <Trophy className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>View Results</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>See live vote counts and rankings</p>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto" style={{ color: 'var(--color-text-muted)' }} />
                  </CardContent>
                </Card>
              </div>

              {/* Vote Distribution by Class */}
              {classDistribution.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Votes by Class</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {classDistribution.map(([cls, count]) => (
                        <div key={cls} className="flex items-center justify-between py-2">
                          <span className="text-sm">{cls}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${totalVotes > 0 ? (count / totalVotes) * 100 : 0}%`,
                                  background: 'var(--color-accent)',
                                }}
                              />
                            </div>
                            <span className="text-sm font-mono font-semibold w-12 text-right" style={{ color: 'var(--color-accent)' }}>{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* --- CANDIDATES TAB --- */}
          {tab === 'candidates' && (
            <motion.div key="candidates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Candidates</h1>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Manage election candidates</p>
                </div>
                <Button onClick={openAdd}>
                  <Plus className="w-4 h-4" /> Add Candidate
                </Button>
              </div>

              {!allCandidates || allCandidates.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>No candidates yet</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Add your first candidate to get started.</p>
                    <Button onClick={openAdd}><Plus className="w-4 h-4" /> Add Candidate</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {allCandidates.map((c) => {
                    const voteCount = results?.find(r => r._id === c._id)?.voteCount ?? 0;
                    return (
                      <Card key={c._id} className={!c.isActive ? 'opacity-50' : ''}>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4">
                            {/* Photo */}
                            <div className="relative group">
                              {c.photoUrl ? (
                                <img src={c.photoUrl} alt={c.name} className="w-16 h-16 rounded-2xl object-cover" style={{ border: `2px solid ${c.colorHex}` }} />
                              ) : (
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ background: `${c.colorHex}18`, color: c.colorHex, border: `2px solid ${c.colorHex}40` }}>
                                  {c.name.charAt(0)}
                                </div>
                              )}
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
                                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                {uploading === c._id ? (
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <ImagePlus className="w-5 h-5 text-white" />
                                )}
                              </button>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-bold text-lg truncate" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</h3>
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.colorHex }} />
                                {!c.isActive && <Badge variant="outline" className="text-xs">Hidden</Badge>}
                              </div>
                              <p className="text-sm" style={{ color: c.colorHex }}>{c.nickname}</p>
                              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{c.class} · Order #{c.order}</p>
                            </div>

                            {/* Vote count */}
                            <div className="text-right mr-4">
                              <p className="text-2xl font-bold font-mono">{voteCount}</p>
                              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>votes</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openEdit(c)} title="Edit">
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleToggleActive(c)} title={c.isActive ? 'Hide' : 'Show'}>
                                {c.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(c._id)} title="Delete">
                                <Trash2 className="w-4 h-4" style={{ color: 'var(--color-accent-2)' }} />
                              </Button>
                            </div>
                          </div>

                          {/* Manifesto */}
                          {c.manifesto.length > 0 && (
                            <div className="mt-3 ml-20 flex flex-wrap gap-2">
                              {c.manifesto.map((m, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{m}</Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* --- RESULTS TAB --- */}
          {tab === 'results' && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Live Results</h1>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{totalVotes} total votes cast</p>
              </div>

              {results && results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((c, i) => {
                    const pct = totalVotes > 0 ? Math.round((c.voteCount / totalVotes) * 100) : 0;
                    const medals = ['👑', '🥈', '🥉', ''];
                    return (
                      <Card key={c._id} className={i === 0 && c.voteCount > 0 ? 'gold-glow border-gold/50' : ''}>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-2xl w-8">{medals[i] ?? ''}</span>
                            {c.photoUrl ? (
                              <img src={c.photoUrl} alt={c.name} className="w-12 h-12 rounded-full object-cover" style={{ border: `3px solid ${c.colorHex}` }} />
                            ) : (
                              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ background: `${c.colorHex}22`, color: c.colorHex }}>{c.name.charAt(0)}</div>
                            )}
                            <div className="flex-1">
                              <p className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</p>
                              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{c.class}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold font-mono">{c.voteCount}</p>
                              <p className="text-sm font-semibold" style={{ color: c.colorHex }}>{pct}%</p>
                            </div>
                          </div>
                          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: c.colorHex }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
                    <p style={{ color: 'var(--color-text-muted)' }}>No votes yet.</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* --- SETTINGS TAB --- */}
          {tab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Manage election settings</p>
              </div>

              <Card className="mb-6" style={{ borderColor: 'var(--color-accent-2)' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: 'var(--color-accent-2)' }}>
                    <Trash2 className="w-5 h-5" /> Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                    Reset all votes. This removes every vote from the database. This action cannot be undone.
                  </p>
                  {!resetConfirm ? (
                    <Button variant="destructive" onClick={() => setResetConfirm(true)}>
                      <Trash2 className="w-4 h-4" /> Reset All Votes
                    </Button>
                  ) : (
                    <div className="flex gap-3 max-w-sm">
                      <Button variant="outline" className="flex-1" onClick={() => setResetConfirm(false)}>Cancel</Button>
                      <Button variant="destructive" className="flex-1" onClick={handleReset}>Yes, Reset Everything</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- ADD/EDIT CANDIDATE MODAL --- */}
      <Dialog open={showAddModal} onOpenChange={(open) => { if (!open) { setShowAddModal(false); setEditingCandidate(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Full Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Amina Juma" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Nickname *</label>
                <Input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} placeholder="e.g. Team Amina" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Class</label>
                <Input value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} placeholder="e.g. Standard 7A" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Display Order</label>
                <Input type="number" min={1} value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Campaign Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Short campaign pitch (1-2 sentences)"
                rows={2}
                className="flex w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Manifesto Points (up to 3)</label>
              <div className="space-y-2">
                {form.manifesto.map((m, i) => (
                  <Input
                    key={i}
                    value={m}
                    onChange={(e) => updateManifesto(i, e.target.value)}
                    placeholder={`Point ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Theme Color</label>
              <div className="flex flex-wrap gap-2">
                {CANDIDATE_COLORS.map(({ hex }) => (
                  <button
                    key={hex}
                    onClick={() => setForm({ ...form, colorHex: hex })}
                    className="w-8 h-8 rounded-full transition-transform"
                    style={{
                      background: hex,
                      transform: form.colorHex === hex ? 'scale(1.3)' : 'scale(1)',
                      boxShadow: form.colorHex === hex ? `0 0 0 3px var(--color-bg), 0 0 0 5px ${hex}` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={() => { setShowAddModal(false); setEditingCandidate(null); }}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={!form.name.trim() || !form.nickname.trim()}>
              <Save className="w-4 h-4" />
              {editingCandidate ? 'Save Changes' : 'Add Candidate'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Candidate?</DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            This will permanently remove this candidate and cannot be undone. Existing votes for this candidate will remain in the database.
          </p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
