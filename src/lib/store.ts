import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Whisky {
    id: string;
    name: string;
    distilledYear: string;
    bottledYear: string;
    region: string;
    tastingNotes: string;
    openedDate: string; // ISO date string
    imageUrl?: string;
    addedAt: string;
}

export interface AppState {
    apiKey: string;
    model: string;
    whiskies: Whisky[];
    setApiKey: (key: string) => void;
    setModel: (model: string) => void;
    addWhisky: (whisky: Whisky) => void;
    updateWhisky: (id: string, updates: Partial<Whisky>) => void;
    removeWhisky: (id: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            apiKey: '',
            model: 'gemini-2.5-flash',
            whiskies: [],
            setApiKey: (key) => set({ apiKey: key }),
            setModel: (model) => set({ model }),
            addWhisky: (whisky) => set((state) => ({ whiskies: [whisky, ...state.whiskies] })),
            updateWhisky: (id, updates) => set((state) => ({
                whiskies: state.whiskies.map((w) => w.id === id ? { ...w, ...updates } : w)
            })),
            removeWhisky: (id) => set((state) => ({ whiskies: state.whiskies.filter(w => w.id !== id) }))
        }),
        {
            name: 'whisky-vault-storage',
        }
    )
);
