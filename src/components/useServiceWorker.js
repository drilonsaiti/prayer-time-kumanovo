import {useCallback, useEffect, useState} from 'react';

// Registers the offline service worker (production only) and tells the app when a
// newer version is ready, so the visitor can choose when to refresh.
export function useServiceWorker() {
    const [waiting, setWaiting] = useState(null);

    useEffect(() => {
        if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return undefined;

        let registration = null;
        let reloading = false;
        const onControllerChange = () => {
            if (reloading) return;
            reloading = true;
            window.location.reload();
        };
        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

        navigator.serviceWorker.register('/sw.js').then((reg) => {
            registration = reg;
            if (reg.waiting && navigator.serviceWorker.controller) setWaiting(reg.waiting);
            reg.addEventListener('updatefound', () => {
                const worker = reg.installing;
                worker?.addEventListener('statechange', () => {
                    if (worker.state === 'installed' && navigator.serviceWorker.controller) setWaiting(worker);
                });
            });
        }).catch((err) => console.warn('Service worker not registered:', err));

        // look for a new version whenever the app comes back to the foreground
        const onVisible = () => {
            if (document.visibilityState === 'visible') registration?.update().catch(() => {});
        };
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, []);

    const applyUpdate = useCallback(() => waiting?.postMessage({type: 'SKIP_WAITING'}), [waiting]);
    return {updateReady: Boolean(waiting), applyUpdate};
}
