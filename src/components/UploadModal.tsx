'use client';
import { useState, useRef } from 'react';
import { Upload, Loader2, X } from 'lucide-react';

interface Props {
    onClose: () => void;
    onCandidatesFound: (candidates: any[]) => void;
    apiKey: string;
    model: string;
}

export function UploadModal({ onClose, onCandidatesFound, apiKey, model }: Props) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(''); // 'recognizing' | 'searching'
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        const reader = new FileReader();
        reader.onloadend = async () => {
            setLoading(true);
            try {
                const base64String = (reader.result as string).split(',')[1];

                // Step 1: Recognize Name
                setStep('recognizing');
                const recRes = await fetch('/api/recognize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imageBase64: base64String,
                        mimeType: file.type,
                        apiKey,
                        model,
                    })
                });

                if (!recRes.ok) {
                    const err = await recRes.json();
                    throw new Error(err.error || 'Failed to recognize image');
                }

                const recData = await recRes.json();
                const whiskyName = recData.name;

                // Step 2: Search Candidates
                setStep('searching');
                const searchRes = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: whiskyName,
                        apiKey,
                        model,
                    })
                });

                if (!searchRes.ok) {
                    const err = await searchRes.json();
                    throw new Error(err.error || 'Failed to search details');
                }

                const searchData = await searchRes.json();
                onCandidatesFound(searchData.candidates);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
                setStep('');
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel animate-fade-in" style={{ width: '90%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '2rem' }}>Add Whisky</h2>

                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

                {!loading ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{ border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                    >
                        <Upload size={48} style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }} />
                        <h3>Upload Photo</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Click or drag a photo of the bottle</p>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <Loader2 size={48} className="lucide-spin" style={{ color: 'var(--accent-gold)', animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
                        <h3>{step === 'recognizing' ? 'Analyzing Label...' : 'Gathering Informations...'}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Using Gemini AI to find details</p>
                        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                )}
            </div>
        </div>
    );
}
