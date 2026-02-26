'use client';
import Link from 'next/link';
import { Settings, GlassWater } from 'lucide-react';
import { useState } from 'react';
import { SettingsModal } from './Settings';

export function Header() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <header className="app-header">
                <Link href="/" className="brand">
                    <GlassWater size={28} />
                    Whisky Vault
                </Link>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" aria-label="Settings" onClick={() => setIsSettingsOpen(true)}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                </div>
            </header>

            {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
        </>
    );
}
