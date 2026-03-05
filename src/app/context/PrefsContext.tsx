import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface AdminPreferences {
    dateFormat: string;   // 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
    timezone: string;
    emailNotifications: boolean;
    browserNotifications: boolean;
}

const DEFAULT_PREFS: AdminPreferences = {
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Africa/Lagos',
    emailNotifications: true,
    browserNotifications: false,
};

interface PrefsContextValue {
    prefs: AdminPreferences;
    setPrefs: (prefs: AdminPreferences) => void;
    savePrefs: (prefs: AdminPreferences) => Promise<void>;
    browserPermission: NotificationPermission | null;
    setBrowserPermission: (p: NotificationPermission) => void;
    requestBrowserPermission: () => Promise<void>;
    formatDate: (dateStr: string) => string;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
    const [prefs, setPrefsState] = useState<AdminPreferences>(DEFAULT_PREFS);
    const [browserPermission, setBrowserPermission] = useState<NotificationPermission | null>(null);

    // Load prefs from Supabase user_metadata (fallback to localStorage)
    useEffect(() => {
        async function load() {
            if ('Notification' in window) {
                setBrowserPermission(Notification.permission);
            }
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.admin_prefs) {
                setPrefsState({ ...DEFAULT_PREFS, ...user.user_metadata.admin_prefs });
                return;
            }
            const stored = localStorage.getItem('lof_admin_prefs');
            if (stored) {
                try { setPrefsState({ ...DEFAULT_PREFS, ...JSON.parse(stored) }); } catch { }
            }
        }
        load();
    }, []);

    // Start the realtime listener permanently if permission is already granted
    useEffect(() => {
        if (browserPermission === 'granted' && prefs.browserNotifications) {
            startInquiryListener();
        }
    }, [browserPermission, prefs.browserNotifications]);

    const setPrefs = (p: AdminPreferences) => setPrefsState(p);

    const savePrefs = async (p: AdminPreferences) => {
        setPrefsState(p);
        localStorage.setItem('lof_admin_prefs', JSON.stringify(p));
        await supabase.auth.updateUser({ data: { admin_prefs: p } });
    };

    const requestBrowserPermission = async () => {
        if (!('Notification' in window)) return;
        const permission = await Notification.requestPermission();
        setBrowserPermission(permission);
    };

    const startInquiryListener = () => {
        supabase
            .channel('lof_inquiry_alerts')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'contact_submissions',
            }, (payload: any) => {
                if (Notification.permission === 'granted') {
                    new Notification('📬 New Inquiry — LOF Command Center', {
                        body: `From: ${payload.new.full_name} — ${payload.new.email}`,
                        icon: '/favicon.ico',
                        tag: 'lof-inquiry',
                        requireInteraction: true,
                    });
                }
            })
            .subscribe();
    };

    // Format a date string using the saved date format preference
    const formatDate = (dateStr: string): string => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        switch (prefs.dateFormat) {
            case 'MM/DD/YYYY': return `${month}/${day}/${year}`;
            case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
            case 'DD/MM/YYYY':
            default: return `${day}/${month}/${year}`;
        }
    };

    return (
        <PrefsContext.Provider value={{ prefs, setPrefs, savePrefs, browserPermission, setBrowserPermission, requestBrowserPermission, formatDate }}>
            {children}
        </PrefsContext.Provider>
    );
}

export function usePrefs() {
    const ctx = useContext(PrefsContext);
    if (!ctx) throw new Error('usePrefs must be used within PrefsProvider');
    return ctx;
}
