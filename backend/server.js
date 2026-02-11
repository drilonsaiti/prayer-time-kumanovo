const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 3001;

const CITY_OFFSETS = {
    "Shkup": 0,
    "Kumanovë": 0,
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

function adjustTime(timeString, offsetMinutes) {
    if (offsetMinutes === 0) return timeString;

    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;

    const date = new Date();
    date.setHours(hour24, minutes + offsetMinutes, 0, 0);

    let newHours = date.getHours();
    const newMinutes = date.getMinutes();
    const newPeriod = newHours >= 12 ? 'PM' : 'AM';

    if (newHours > 12) newHours -= 12;
    if (newHours === 0) newHours = 12;

    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')} ${newPeriod}`;
}

app.get('/api/prayer-times/:city?', async (req, res) => {
    try {
        const city = req.params.city || 'Shkup';

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

        prayerTimes.Fajr = extractTime('Sabahu');
        prayerTimes.Dhuhr = extractTime('Dreka');
        prayerTimes.Asr = extractTime('Iqindia');
        prayerTimes.Maghrib = extractTime('Akshami');
        prayerTimes.Isha = extractTime('Jacia');

        const missing = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].filter(p => !prayerTimes[p]);
        if (missing.length > 0) {
            throw new Error(`Could not extract: ${missing.join(', ')}`);
        }

        const offset = CITY_OFFSETS[city] || 0;
        const adjusted = {};

        Object.keys(prayerTimes).forEach(prayer => {
            adjusted[prayer] = adjustTime(prayerTimes[prayer], offset);
        });

        adjusted.Sunrise = adjustTime(adjusted.Fajr, 24);
        adjusted.Sunset = adjusted.Maghrib;

        res.json({ success: true, data: adjusted });

    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});