// Runs before first paint (external file, so it is allowed by the CSP).
// Picks the saved theme, or the system theme the first time.
(function () {
    try {
        var t = localStorage.getItem('theme');
        if (t !== 'light' && t !== 'dark') {
            t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', t);
        var m = document.querySelector('meta[name="theme-color"]');
        if (m) m.setAttribute('content', t === 'dark' ? '#0e1117' : '#cfc8b8');
    } catch (e) { /* storage blocked: stay on light */ }
})();
