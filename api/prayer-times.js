// api/prayer-times.js
// Vercel serverless function. Prayer times are CALCULATED (astronomical formulas
// via the open-source `adhan` library) for each city's coordinates. Nothing is
// scraped from third-party sites, so there is no scraping/legal risk, no
// dependency on someone else's website, and DST is handled by Europe/Skopje.

const { Coordinates, CalculationMethod, PrayerTimes } = require('adhan');

const TIME_ZONE = 'Europe/Skopje';

// Frontend city names (Albanian) -> coordinates.
const CITIES = {
    'Kumanovë': [42.1322, 21.7144],
    'Shkup': [41.9981, 21.4254],
    'Tetovë': [42.0069, 20.9715],
    'Gostivar': [41.7958, 20.9089],
    'Strugë': [41.1778, 20.6783],
    'Prilep': [41.3464, 21.5542],
    'Kërçovë': [41.5129, 20.9589],
    'Dibër': [41.5236, 20.5278],
    'Veles': [41.7156, 21.7756],
    'Strumicë': [41.4378, 22.6428],
    'Shtip': [41.7458, 22.1996],
    'Kocan': [41.9164, 22.4129],
    'Valandov': [41.3183, 22.5567],
    'Dellcev': [41.9667, 22.7667],
    'Presp': [41.0889, 21.0122],
    'Manastir': [41.0297, 21.3347],
    'Oher': [41.1231, 20.8016],
};

function skopjeDateParts(instant = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(instant);
    const get = (t) => Number(parts.find((p) => p.type === t).value);
    return { year: get('year'), month: get('month'), day: get('day') };
}
const dateKey = ({ year, month, day }) =>
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const hhmmFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
const hhmm = (instant) => hhmmFormatter.format(instant);

function secondsUntilSkopjeMidnight(now = new Date()) {
    const [h, m] = hhmm(now).split(':').map(Number);
    return Math.max(60, (1440 - (h * 60 + m)) * 60);
}

// Muslim World League method (Fajr 18°, Isha 17°), Shafi'i Asr.
// This reproduces islamishqip.org's published Skopje table within 2 minutes.
function calculate(city, dateParts) {
    const [lat, lon] = CITIES[city];
    const pt = new PrayerTimes(
        new Coordinates(lat, lon),
        new Date(dateParts.year, dateParts.month - 1, dateParts.day),
        CalculationMethod.MuslimWorldLeague()
    );
    return {
        Fajr: hhmm(pt.fajr),
        Sunrise: hhmm(pt.fajr),   // existing app convention: the "Sabahu" slot
        Dhuhr: hhmm(pt.dhuhr),
        Asr: hhmm(pt.asr),
        Maghrib: hhmm(pt.maghrib),
        Sunset: hhmm(pt.maghrib),
        Isha: hhmm(pt.isha),
    };
}

module.exports = async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff'); // same-origin only: no CORS headers

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const rawCity = req.query && req.query.city;
    const city = rawCity === undefined ? 'Shkup' : rawCity;
    if (typeof city !== 'string' || !Object.prototype.hasOwnProperty.call(CITIES, city)) {
        return res.status(400).json({ success: false, error: 'Unknown city' });
    }

    try {
        const now = new Date();
        const dateParts = skopjeDateParts(now);
        const data = calculate(city, dateParts);

        res.setHeader('Cache-Control',
            `public, s-maxage=${Math.min(3600, secondsUntilSkopjeMidnight(now))}, stale-while-revalidate=60`);
        return res.status(200).json({
            success: true, data, date: dateKey(dateParts), timeZone: TIME_ZONE, source: 'calculated-mwl',
        });
    } catch (error) {
        console.error('Error:', error);
        res.setHeader('Cache-Control', 'no-store');
        return res.status(500).json({ success: false, error: 'Failed to calculate prayer times' });
    }
};

module.exports._test = { calculate, skopjeDateParts, CITIES };
