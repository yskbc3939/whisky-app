'use client';
import { useState, useEffect } from 'react';
import { useAppStore, Whisky } from '@/lib/store';
import { UploadModal } from '@/components/UploadModal';
import { CandidateList } from '@/components/CandidateList';
import { WhiskyForm } from '@/components/WhiskyForm';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Home() {
  const { whiskies, apiKey, model, removeWhisky } = useAppStore();
  const [isMounted, setIsMounted] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [editingWhisky, setEditingWhisky] = useState<Whisky | null>(null);

  // Hydration fix for Zustand with Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCandidatesFound = (found: any[]) => {
    setShowUpload(false);
    setCandidates(found);
  };

  const handleSelectCandidate = (candidate: any) => {
    setCandidates([]);
    setSelectedCandidate(candidate);
  };

  if (!isMounted) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>My Collection</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and explore your premium whisky bottles.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowUpload(true)}>
          <Plus size={20} /> Add Whisky
        </button>
      </div>

      {whiskies.length === 0 ? (
        <div className="glass-panel" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto', display: 'block' }}>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your vault is empty</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto' }}>
            Upload a photo of a whisky bottle to automatically identify and add it to your collection.
          </p>
          <button className="btn-primary" onClick={() => setShowUpload(true)}>Upload Photo</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {whiskies.map(whisky => (
            <div key={whisky.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
              {/* Card background styling */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--accent-gold), transparent)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--accent-gold)', flex: 1, paddingRight: '1rem', lineHeight: '1.3' }}>{whisky.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setEditingWhisky(whisky)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.2rem' }} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => { if (confirm('Remove this whisky?')) removeWhisky(whisky.id) }} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.2rem' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Region</span>
                  <span>{whisky.region || '--'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Distilled / Bottled</span>
                  <span>{whisky.distilledYear || '--'} / {whisky.bottledYear || '--'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Cask Type</span>
                  <span>{whisky.caskType || '--'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Cask No.</span>
                  <span>{whisky.caskNumber || '--'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Opened</span>
                  <span>{whisky.openedDate || 'Unopened'}</span>
                </div>

                {whisky.tastingNotes && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Tasting Notes</span>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                      {whisky.tastingNotes.length > 100 ? whisky.tastingNotes.slice(0, 100) + '...' : whisky.tastingNotes}
                    </p>
                  </div>
                )}

                <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(207, 170, 112, 0.08)', border: '1px solid rgba(207, 170, 112, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 600 }}>Whiskybase</span>
                    <span style={{ color: whisky.whiskybaseRating ? 'var(--accent-gold)' : 'var(--text-muted)', fontSize: whisky.whiskybaseRating ? '1.1rem' : '0.85rem', fontWeight: whisky.whiskybaseRating ? 700 : 400 }}>
                      {whisky.whiskybaseRating ? `★ ${whisky.whiskybaseRating}` : 'No rating'}
                      {whisky.whiskybaseRating && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/100</span>}
                    </span>
                  </div>
                  {whisky.whiskybaseUrl ? (
                    <a href={whisky.whiskybaseUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', textDecoration: 'underline', opacity: 0.8, marginTop: '0.25rem', display: 'inline-block' }}>
                      View on Whiskybase →
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'inline-block' }}>Link not available</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals Flow */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onCandidatesFound={handleCandidatesFound} apiKey={apiKey} model={model} />}
      {candidates.length > 0 && <CandidateList candidates={candidates} onSelect={handleSelectCandidate} onCancel={() => setCandidates([])} />}
      {selectedCandidate && <WhiskyForm initialData={selectedCandidate} onClose={() => setSelectedCandidate(null)} />}
      {editingWhisky && <WhiskyForm initialData={editingWhisky} isEditing onClose={() => setEditingWhisky(null)} />}
    </div>
  );
}
