// api/prayer-times.js
// Vercel Serverless Function with Caching

const axios = require('axios');

const CITY_OFFSETS = {
    "Shkup": 0,
    "Kumanovë": -1,
    "Prilep": -1,
    "Veles": -2,
    "Shtip": -3,
    "Kocan": -4,
    "Strumicë": -5,
    "Valandov": -5,
    "Dellcev": -6,
    "Presp": 1,
    "Manastir": 1,
    "Tetovë": 2,
    "Gostivar": 2,
    "Kërçovë": 2,
    "Dibër": 5,
    "Strugë": 5,
    "Oher": 5,
};

// In-memory cache
let cache = {
    data: null,
    timestamp: null,
    date: null
};

function isCacheValid() {
    if (!cache.data || !cache.timestamp) return false;

    const now = new Date();
    const cacheDate = cache.date;

    if (!cacheDate || cacheDate !== now.toDateString()) {
        return false;
    }

    return true;
}

function adjustTime(timeString, offsetMinutes = 0) {
    const [time, period] = timeString.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes + offsetMinutes, 0, 0);

    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

async function scrapePrayerTimes() {
    if (isCacheValid()) {
        return cache.data;
    }

    try {
        const response = await axios.get('https://bfi.mk/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const html = response.data;
        const prayerTimes = {};

        const extractTime = (prayerName) => {
            const patterns = [
                new RegExp(`<h6[^>]*>${prayerName}<\\/h6>[\\s\\S]*?<i[^>]*>Koha:<\\/i>\\s*([0-9]{1,2}:[0-9]{2}\\s*[AP]M)`, 'i'),
                new RegExp(`>${prayerName}<[\\s\\S]*?Koha:<\\/i>\\s*([0-9]{1,2}:[0-9]{2}\\s*[AP]M)`, 'i'),
            ];

            for (const pattern of patterns) {
                const match = html.match(pattern);
                if (match && match[1]) return match[1].trim();
            }
            return null;
        };

        prayerTimes.Fajr    = extractTime('Sabahu');
        prayerTimes.Dhuhr   = extractTime('Dreka');
        prayerTimes.Asr     = extractTime('Iqindia');
        prayerTimes.Maghrib = extractTime('Akshami');
        prayerTimes.Isha    = extractTime('Jacia');

        const missing = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].filter(p => !prayerTimes[p]);
        if (missing.length > 0) {
            throw new Error(`Could not extract: ${missing.join(', ')}`);
        }

        cache.data = prayerTimes;
        cache.timestamp = Date.now();
        cache.date = new Date().toDateString();

        return prayerTimes;

    } catch (error) {
        if (cache.data) return cache.data;
        throw error;
    }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const city = req.query.city || 'Shkup';
        const baseTimes = await scrapePrayerTimes();
        const offset = CITY_OFFSETS[city] || 0;

        const adjusted = {
            Fajr:    adjustTime(baseTimes.Fajr,    offset),
            Sunrise: adjustTime(baseTimes.Fajr,    offset),
            Dhuhr:   adjustTime(baseTimes.Dhuhr,   offset),
            Asr:     adjustTime(baseTimes.Asr,     offset),
            Maghrib: adjustTime(baseTimes.Maghrib, offset),
            Sunset:  adjustTime(baseTimes.Maghrib, offset),
            Isha:    adjustTime(baseTimes.Isha,    offset + 20),
        };

        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        const secondsUntilMidnight = Math.floor((endOfDay - now) / 1000);

        res.setHeader('Cache-Control', `public, s-maxage=${secondsUntilMidnight}, stale-while-revalidate=86400`);

        res.status(200).json({
            success: true,
            data: adjusted,
            cached: isCacheValid(),
            cacheDate: cache.date
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};