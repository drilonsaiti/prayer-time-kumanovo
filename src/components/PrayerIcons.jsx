// Thin line icons, one per moment of the day. Drawn for this app (24×24, currentColor).
const PATHS = {
    // UI icons
    Pin: <>
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/>
        <circle cx="12" cy="10" r="2.4"/>
    </>,
    Chevron: <path d="m6 9 6 6 6-6"/>,
    Check: <path d="m5 12.5 4.5 4.5L19 7.5"/>,
    // Imsaku: crescent
    Imsak: <path d="M19 14.2A7.6 7.6 0 1 1 9.8 5a6 6 0 0 0 9.2 9.2z"/>,
    // Sabahu: sun rising, arrow up
    Fajr: <>
        <path d="M5 18.5h14M7.6 18.5a4.4 4.4 0 0 1 8.8 0"/>
        <path d="M12 4.2v5.6M9.6 6.6 12 4.2l2.4 2.4"/>
    </>,
    // Lindja e diellit: half sun with rays
    Shuruq: <>
        <path d="M3.5 18.5h17M7.6 18.5a4.4 4.4 0 0 1 8.8 0"/>
        <path d="M12 8.2v2M5.9 11.1l1.4 1.4M18.1 11.1l-1.4 1.4M3.6 15.2h1.9M18.5 15.2h1.9"/>
    </>,
    // Hyrja e drekës: outlined sun
    Hyrja: <>
        <circle cx="12" cy="12" r="3.6"/>
        <path d="M12 3.8v2.2M12 18v2.2M3.8 12H6M18 12h2.2M6.2 6.2l1.5 1.5M16.3 16.3l1.5 1.5M17.8 6.2l-1.5 1.5M7.7 16.3l-1.5 1.5"/>
    </>,
    // Dreka: solid sun
    Dhuhr: <>
        <circle cx="12" cy="12" r="3.6" fill="currentColor"/>
        <path d="M12 3.8v2.2M12 18v2.2M3.8 12H6M18 12h2.2M6.2 6.2l1.5 1.5M16.3 16.3l1.5 1.5M17.8 6.2l-1.5 1.5M7.7 16.3l-1.5 1.5"/>
    </>,
    // Ikindia: sun behind a cloud
    Asr: <>
        <path d="M7 19.5h9.2a3.7 3.7 0 0 0 .5-7.4 5.2 5.2 0 0 0-9.9 1.2A3.1 3.1 0 0 0 7 19.5z"/>
        <path d="M16.2 3.6v1.6M20.2 7.6h-1.6M19 4.8l-1.1 1.1M12.6 5.6l1.1 1.1"/>
    </>,
    // Akshami: sun setting, arrow down
    Maghrib: <>
        <path d="M3.5 19.5h17M7.6 19.5a4.4 4.4 0 0 1 8.8 0"/>
        <path d="M12 4v6M9.6 7.6 12 10l2.4-2.4"/>
    </>,
    // Jacia: crescent and a small star
    Isha: <>
        <path d="M17.6 15.4A7 7 0 1 1 9.6 6.4a5.5 5.5 0 0 0 8 9z"/>
        <path d="M18 3.6v4M16 5.6h4"/>
    </>,
};

const PrayerIcon = ({name, size = 22}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {PATHS[name]}
    </svg>
);

export default PrayerIcon;
