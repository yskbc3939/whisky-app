'use client';
import { Check } from 'lucide-react';

interface Candidate {
    name: string;
    distilledYear?: string;
    bottledYear?: string;
    region?: string;
    tastingNotes?: string;
}

interface Props {
    candidates: Candidate[];
    onSelect: (candidate: Candidate) => void;
    onCancel: () => void;
}

export function CandidateList({ candidates, onSelect, onCancel }: Props) {
    if (candidates.length === 0) {
        return (
            <div className="glass-panel p-8 text-center" style={{ padding: '2rem', textAlign: 'center' }}>
                <p>No candidates found. Try again or add manually.</p>
                <button onClick={onCancel} className="btn-secondary" style={{ marginTop: '1rem' }}>Back</button>
            </div>
        );
    }

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem', overflowY: 'auto' }}>
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Select Best Match</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We found these candidates based on your photo.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {candidates.map((c, i) => (
                        <div
                            key={i}
                            onClick={() => onSelect(c)}
                            style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; e.currentTarget.style.background = 'rgba(207,170,112,0.05)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                        >
                            <div>
                                <h3 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>{c.name}</h3>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                    {c.region && <span>Region: {c.region}</span>}
                                    {(c.distilledYear || c.bottledYear) && <span>Year: {c.distilledYear || '?'} - {c.bottledYear || '?'}</span>}
                                </div>
                                {c.tastingNotes && <p style={{ fontSize: '0.875rem', margin: 0 }}>{c.tastingNotes.slice(0, 100)}...</p>}
                            </div>
                            <Check className="lucide-check" style={{ color: 'var(--accent-gold)', opacity: 0.5 }} />
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                    <button onClick={onCancel} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
}
