import {useCallback, useEffect, useState} from 'react';

const THEME_COLOR = {light: '#cfc8b8', dark: '#0e1117'};

function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
}

// "light" | "dark". Starts from what theme-init.js already set (no flash).
// Follows the system until the visitor picks one with the switch.
export function useTheme() {
    const [theme, setThemeState] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');

    const setTheme = useCallback((next) => {
        apply(next);
        setThemeState(next);
        try { localStorage.setItem('theme', next); } catch { /* storage blocked */ }
    }, []);

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = (e) => {
            let saved = null;
            try { saved = localStorage.getItem('theme'); } catch { /* ignore */ }
            if (saved === 'light' || saved === 'dark') return;
            const next = e.matches ? 'dark' : 'light';
            apply(next);
            setThemeState(next);
        };
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    return [theme, setTheme];
}
