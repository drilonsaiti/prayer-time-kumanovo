// api/prayer-times.js
// Vercel serverless function. Source of truth: bfi.mk (Islamic Community).
// All date logic is done in Europe/Skopje, never in the server's timezone.

const axios = require('axios');
const { Coordinates, CalculationMethod, PrayerTimes } = require('adhan');

const TIME_ZONE = 'Europe/Skopje';
const BFI_URL = 'https://bfi.mk/';

// Minutes relative to Skopje (the reference city of bfi.mk).
const CITY_OFFSETS = {
    'Shkup': 0, 'Kumanovë': -1, 'Prilep': -1, 'Veles': -2, 'Shtip': -3,
    'Kocan': -4, 'Strumicë': -5, 'Valandov': -5, 'Dellcev': -6, 'Presp': 1,
    'Manastir': 1, 'Tetovë': 2, 'Gostivar': 2, 'Kërçovë': 2, 'Dibër': 5,
    'Strugë': 5, 'Oher': 5,
};
const ISHA_EXTRA_MINUTES = 20; // existing app convention
const SKOPJE = new Coordinates(41.9981, 21.4254);

// ---------- Skopje time helpers (DST-safe, independent of server TZ) ----------
function skopjeDateParts(instant = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(instant);
    const get = (t) => Number(parts.find((p) => p.type === t).value);
    return { year: get('year'), month: get('month'), day: get('day') };
}
const dateKey = ({ year, month, day }) =>
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

function skopjeMinutesOfDay(instant) {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(instant);
    const get = (t) => Number(parts.find((p) => p.type === t).value) % 24;
    return get('hour') * 60 + get('minute');
}

function secondsUntilSkopjeMidnight(now = new Date()) {
    const mins = skopjeMinutesOfDay(now);
    return Math.max(60, (1440 - mins) * 60 - now.getSeconds());
}

// ---------- time string helpers (pure minute arithmetic, no Date) ----------
const wrap = (m) => ((m % 1440) + 1440) % 1440;

function parseToMinutes(str) {
    const m = /^\s*(\d{1,2}):(\d{2})\s*([AP]M)?\s*$/i.exec(str || '');
    if (!m) return null;
    let h = Number(m[1]);
    const min = Number(m[2]);
    const period = m[3] && m[3].toUpperCase();
    if (min > 59 || h > 23 || (period && (h < 1 || h > 12))) return null;
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + min;
}

function formatMinutes(total) {
    const t = wrap(total);
    return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

// Reference prayer times calculated for Skopje on a given date (minutes, Skopje time).
function calculatedMinutes(dateParts, instantForTz) {
    const params = CalculationMethod.Turkey();
    const pt = new PrayerTimes(
        SKOPJE,
        new Date(dateParts.year, dateParts.month - 1, dateParts.day),
        params
    );
    return {
        Fajr: skopjeMinutesOfDay(pt.fajr),
        Dhuhr: skopjeMinutesOfDay(pt.dhuhr),
        Asr: skopjeMinutesOfDay(pt.asr),
        Maghrib: skopjeMinutesOfDay(pt.maghrib),
        Isha: skopjeMinutesOfDay(pt.isha),
    };
}

const signedDiff = (a, b) => {
    let d = (a - b) % 1440;
    if (d > 720) d -= 1440;
    if (d <= -720) d += 1440;
    return d;
};

// Detects a source that did not follow the clock change (+/- 1 hour off).
// Dhuhr and Maghrib are used because they hardly depend on calculation method.
function detectHourShift(base, dateParts) {
    const calc = calculatedMinutes(dateParts);
    const diffs = [signedDiff(base.Dhuhr, calc.Dhuhr), signedDiff(base.Maghrib, calc.Maghrib)];
    const avg = (diffs[0] + diffs[1]) / 2;
    if (Math.abs(avg) <= 15) return { shift: 0, diffs };
    if (Math.abs(avg - 60) <= 15 && Math.abs(diffs[0] - diffs[1]) <= 15) return { shift: -60, diffs };
    if (Math.abs(avg + 60) <= 15 && Math.abs(diffs[0] - diffs[1]) <= 15) return { shift: 60, diffs };
    return { shift: 0, diffs, mismatch: true };
}

// ---------- cache (per Skopje calendar day) ----------
let cache = { key: null, data: null };

async function fetchBase(dateParts) {
    const key = dateKey(dateParts);
    if (cache.key === key && cache.data) return cache.data;

    try {
        const response = await axios.get(BFI_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PrayerTimeKumanovo/1.0)' },
            timeout: 10000,
            maxRedirects: 2,
            maxContentLength: 5 * 1024 * 1024,
            responseType: 'text',
        });
        const html = String(response.data);

        const extract = (name) => {
            // bounded gaps ({0,800}) instead of unbounded [\s\S]*? to avoid regex slowdowns
            const re = new RegExp(
                `>\\s*${name}\\s*<[\\s\\S]{0,800}?Koha:\\s*<\\/i>\\s*([0-9]{1,2}:[0-9]{2}\\s*[AP]M)`, 'i');
            const m = html.match(re);
            return m ? parseToMinutes(m[1]) : null;
        };

        const base = {
            Fajr: extract('Sabahu'), Dhuhr: extract('Dreka'), Asr: extract('Iqindia'),
            Maghrib: extract('Akshami'), Isha: extract('Jacia'),
        };
        const missing = Object.keys(base).filter((k) => base[k] === null);
        if (missing.length) throw new Error(`Could not extract: ${missing.join(', ')}`);

        const { shift, diffs, mismatch } = detectHourShift(base, dateParts);
        if (shift !== 0) console.warn(`bfi.mk looks ${shift === -60 ? '+' : '-'}1h off (diffs ${diffs}); correcting`);
        if (mismatch) console.warn(`bfi.mk differs from calculation unusually (diffs ${diffs})`);

        const corrected = {};
        for (const k of Object.keys(base)) corrected[k] = wrap(base[k] + shift);

        cache = { key, data: { times: corrected, hourShift: shift, mismatch: !!mismatch, source: 'bfi.mk' } };
        return cache.data;
    } catch (err) {
        console.error('Scrape failed:', err.message);
        if (cache.data) return { ...cache.data, stale: true }; // better than nothing
        // last resort: calculated times (Skopje reference)
        const calc = calculatedMinutes(dateParts);
        return { times: calc, hourShift: 0, mismatch: false, source: 'calculated' };
    }
}

module.exports = async (req, res) => {
    // Same-origin only: no CORS headers on purpose.
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const rawCity = req.query && req.query.city;
    const city = rawCity === undefined ? 'Shkup' : rawCity;
    if (typeof city !== 'string' || !Object.prototype.hasOwnProperty.call(CITY_OFFSETS, city)) {
        return res.status(400).json({ success: false, error: 'Unknown city' });
    }

    try {
        const now = new Date();
        const dateParts = skopjeDateParts(now);
        const base = await fetchBase(dateParts);
        const o = CITY_OFFSETS[city];
        const t = base.times;

        const data = {
            Fajr: formatMinutes(t.Fajr + o),
            Sunrise: formatMinutes(t.Fajr + o),
            Dhuhr: formatMinutes(t.Dhuhr + o),
            Asr: formatMinutes(t.Asr + o),
            Maghrib: formatMinutes(t.Maghrib + o),
            Sunset: formatMinutes(t.Maghrib + o),
            Isha: formatMinutes(t.Isha + o + (base.source === 'bfi.mk' ? ISHA_EXTRA_MINUTES : 0)),
        };

        // Cache until Skopje midnight, but never more than 30 min, so a changed
        // offset (clock change) or a corrected source is picked up quickly.
        const maxAge = Math.min(1800, secondsUntilSkopjeMidnight(now));
        res.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=60`);

        return res.status(200).json({
            success: true,
            data,
            date: dateKey(dateParts),
            timeZone: TIME_ZONE,
            source: base.source,
        });
    } catch (error) {
        console.error('Error:', error);
        res.setHeader('Cache-Control', 'no-store');
        return res.status(500).json({ success: false, error: 'Failed to load prayer times' });
    }
};

module.exports._test = { detectHourShift, parseToMinutes, formatMinutes, skopjeDateParts, calculatedMinutes };
