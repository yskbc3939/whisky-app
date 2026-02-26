'use client';
import { useAppStore } from '@/lib/store';
import { X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    onClose: () => void;
}

export function SettingsModal({ onClose }: Props) {
    const { apiKey, model, setApiKey, setModel } = useAppStore();

    const [localKey, setLocalKey] = useState(apiKey);
    const [localModel, setLocalModel] = useState(model);

    const handleSave = () => {
        setApiKey(localKey);
        setModel(localModel);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '2rem' }}>AI Settings</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <label className="input-label">Gemini API Key</label>
                        <input
                            type="password"
                            className="input-field"
                            value={localKey}
                            onChange={(e) => setLocalKey(e.target.value)}
                            placeholder="Leave blank to use environment variable"
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Used for image recognition and grounded web search. Note: Your key is stored securely in your browser's local storage and only sent temporarily to the app's backend to authorize requests.
                        </p>
                    </div>

                    <div>
                        <label className="input-label">AI Model</label>
                        <select
                            className="input-field"
                            value={localModel}
                            onChange={(e) => setLocalModel(e.target.value)}
                        >
                            <option value="gemini-2.0-flash">gemini-2.0-flash (Fast, Recommended)</option>
                            <option value="gemini-2.5-flash">gemini-2.5-flash (Newest)</option>
                            <option value="gemini-2.0-pro-exp">gemini-2.0-pro-exp (High Accuracy Experimental)</option>
                        </select>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <button onClick={handleSave} className="btn-primary">Save Settings</button>
                </div>
            </div>
        </div>
    );
}
