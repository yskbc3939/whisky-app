'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppStore, Whisky } from '@/lib/store';
import { X } from 'lucide-react';

interface Props {
    initialData?: Partial<Whisky>;
    onClose: () => void;
    isEditing?: boolean;
}

export function WhiskyForm({ initialData, onClose, isEditing = false }: Props) {
    const addWhisky = useAppStore((state) => state.addWhisky);
    const updateWhisky = useAppStore((state) => state.updateWhisky);

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        distilledYear: initialData?.distilledYear || '',
        bottledYear: initialData?.bottledYear || '',
        region: initialData?.region || '',
        tastingNotes: initialData?.tastingNotes || '',
        openedDate: initialData?.openedDate || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && initialData?.id) {
            updateWhisky(initialData.id, formData);
        } else {
            addWhisky({
                id: uuidv4(),
                ...formData,
                addedAt: new Date().toISOString(),
            });
        }
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem', overflowY: 'auto' }}>
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '2rem' }}>{isEditing ? 'Edit Whisky' : 'Save to My List'}</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label className="input-label">Whisky Name</label>
                        <input name="name" className="input-field" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="input-label">Distilled Year</label>
                            <input name="distilledYear" className="input-field" value={formData.distilledYear} onChange={handleChange} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="input-label">Bottled Year</label>
                            <input name="bottledYear" className="input-field" value={formData.bottledYear} onChange={handleChange} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="input-label">Region</label>
                            <input name="region" className="input-field" value={formData.region} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Tasting Notes</label>
                        <textarea
                            name="tastingNotes"
                            className="input-field"
                            style={{ minHeight: '100px', resize: 'vertical' }}
                            value={formData.tastingNotes}
                            onChange={handleChange}
                            placeholder="Describe the aroma, palate, and finish..."
                        />
                    </div>

                    <div>
                        <label className="input-label">Bottle Opened Date</label>
                        <input type="date" name="openedDate" className="input-field" value={formData.openedDate} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Save Whisky</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
