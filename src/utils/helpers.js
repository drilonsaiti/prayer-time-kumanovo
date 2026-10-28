import {format} from 'date-fns';
import {BsCloudSun, BsMoonStars, BsSun, BsSunrise, BsSunset} from "react-icons/bs";
import {WiCloud, WiCloudy, WiDayFog, WiDaySunny, WiFog, WiRain, WiSleet, WiSnow, WiThunderstorm} from 'react-icons/wi';

export const ICONS = {
    'Fajr': BsSunrise,
    'Sunrise': BsSunrise,
    'Dhuhr': BsSun,
    'Asr': BsCloudSun,
    'Sunset': BsSunset,
    'Maghrib': BsSunset,
    'Isha': BsMoonStars,
};
export const WEATHER_ICONS = {
    0: WiCloud, // Unknown
    1000: WiDaySunny, // Clear, Sunny
    1100: WiDaySunny, // Mostly Clear
    1101: WiCloud, // Partly Cloudy
    1102: WiCloudy, // Mostly Cloudy
    1001: WiCloudy, // Cloudy
    2000: WiFog, // Fog
    2100: WiDayFog, // Light Fog
    4000: WiRain, // Drizzle
    4001: WiRain, // Rain
    4200: WiRain, // Light Rain
    4201: WiRain, // Heavy Rain
    5000: WiSnow, // Snow
    5001: WiSnow, // Flurries
    5100: WiSnow, // Light Snow
    5101: WiSnow, // Heavy Snow
    6000: WiSleet, // Freezing Drizzle
    6001: WiSleet, // Freezing Rain
    6200: WiSleet, // Light Freezing Rain
    6201: WiSleet, // Heavy Freezing Rain
    7000: WiSleet, // Ice Pellets
    7101: WiSleet, // Heavy Ice Pellets
    7102: WiSleet, // Light Ice Pellets
    8000: WiThunderstorm  // Thunderstorm
};


export const WEATHER = {
    0: "Unknown",
    1000: "Clear, Sunny",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    1001: "Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm"
}

export const PRAYERS = {
    'Imsak': 'Imsaku',
    'Shuruq': 'Lindja e Diellit',
    'Hyrja': 'Hyrja e drekës',
    'Fajr': 'Sabahu',
    'Sunrise': 'Sabahu',
    'Dhuhr': 'Dreka',
    'Asr': 'Ikindia',
    'Sunset': 'Akshami',
    'Maghrib': 'Akshami',
    'Isha': 'Jacia',
}

const MONTHS = {
    "January": "Janar",
    "February": "Shkurt",
    "March": "Mars",
    "April": "Prill",
    "May": "Maj",
    "June": "Qershor",
    "July": "Korrik",
    "August": "Gusht",
    "September": "Shtator",
    "October": "Tetor",
    "November": "Nëntor",
    "December": "Dhjetor"
};

const HIJRIMONTHS = {
    "Mu\u1E25arram": "Muharrem",
    "\u1E62afar": "Safer",
    "Rab\u012B\u02BF al-awwal": "Rebi’ul Euel",
    "Rab\u012B\u02BF al-th\u0101n\u012B": "Rebi‘ul Akhir",
    "Jum\u0101d\u00E1 al-\u016Bl\u0101": "Xhumadal Euel",
    "Jum\u0101d\u00E1 al-\u0101khirah": "Xhumadal Akhir",
    "Rajab": "Rexheb ",
    "Sh\u02BF\u0101b\u0101n": "Shaban ",
    "Ram\u1E0D\u0101n": "Ramazan",
    "Shaww\u0101l": "Shevval",
    "Dh\u016B al-Qa\u02BFdah": "Dhul Kaa’de",
    "Dh\u016B al-\u1E24\u0069\u006A\u006A\u0061\u0068": "Dhul Hixhe "
};

export const backgroundGradient = {
    'Fajr':    'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    'Sunrise': 'linear-gradient(160deg, #fc5c7d 0%, #6a3093 100%)',
    'Dhuhr':   'linear-gradient(160deg, #1a6b3c 0%, #0f4c2a 50%, #0a2e1a 100%)',
    'Asr':     'linear-gradient(160deg, #c79a2a 0%, #8b6914 50%, #5a4209 100%)',
    'Sunset':  'linear-gradient(160deg, #c94b4b 0%, #4b134f 100%)',
    'Maghrib': 'linear-gradient(160deg, #ee0979 0%, #ff6a00 100%)',
    'Isha':    'linear-gradient(160deg, #0a0a1a 0%, #0d1b4b 50%, #1a1a3e 100%)',
};
// ───────────────────────── Skopje-time helpers ─────────────────────────
// Everything below works in Europe/Skopje, so the displayed times and the
// countdown are correct on the clock-change days and for visitors who are
// in another timezone. Prayer times arrive as "HH:mm" strings (Skopje wall time).
export const TIME_ZONE = 'Europe/Skopje';
// Only the five prayers (namaze) count for "Namazi i radhës" and the timer.
// Imsaku, Lindja e Diellit and Hyrja e drekës are shown in the table but are not prayers.
const TIMINGS_TO_SHOW = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const partsFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

function skopjeParts(instant = new Date()) {
    const out = {};
    for (const p of partsFormatter.formatToParts(instant)) out[p.type] = Number(p.value);
    return out; // {year, month, day, hour, minute, second}
}

// UTC offset (ms) of Skopje at a given instant.
function skopjeOffsetMs(instant) {
    const p = skopjeParts(instant);
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

// Real instant for a Skopje wall-clock time (handles DST).
function skopjeWallTimeToDate(year, month, day, hour, minute) {
    const naive = Date.UTC(year, month - 1, day, hour, minute);
    let guess = naive - skopjeOffsetMs(new Date(naive));
    guess = naive - skopjeOffsetMs(new Date(guess)); // second pass near transitions
    return new Date(guess);
}

// {year, month, day} of the Skopje calendar date, optionally shifted by whole days.
export const skopjeDateParts = (instant = new Date(), dayOffset = 0) => {
    const p = skopjeParts(instant);
    const d = new Date(Date.UTC(p.year, p.month - 1, p.day + dayOffset));
    return {year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate()};
};

export const skopjeDateString = (instant = new Date()) => {
    const p = skopjeParts(instant);
    return `${String(p.day).padStart(2, '0')}-${String(p.month).padStart(2, '0')}-${p.year}`;
};

export const skopjeMinutesOfDay = (instant = new Date()) => {
    const p = skopjeParts(instant);
    return p.hour * 60 + p.minute;
};

// "HH:mm" (Skopje wall time) -> Date, on today's Skopje date + dayOffset.
function timeOnDay(hhmm, now, dayOffset = 0) {
    const [h, m] = hhmm.split(' ')[0].split(':').map(Number);
    const p = skopjeParts(now);
    const day = new Date(Date.UTC(p.year, p.month - 1, p.day + dayOffset));
    return skopjeWallTimeToDate(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), h, m);
}

// Returns the next prayer entry { key, at } or null when all of today's have passed.
function findNext(timings, now = new Date()) {
    for (const key of TIMINGS_TO_SHOW) {
        if (!timings[key]) continue;
        const at = timeOnDay(timings[key], now);
        if (at.getTime() > now.getTime()) return {key, at};
    }
    return null;
}

export const formatDate = (date) => format(new Date(date), 'dd-MM-yyyy');

export const nextPrayer = (timings) => findNext(timings)?.key ?? TIMINGS_TO_SHOW[0];

export const nextPrayerIconColor = (timings) => findNext(timings)?.key ?? TIMINGS_TO_SHOW[TIMINGS_TO_SHOW.length - 1];

export const nextPrayerTime = (timings) => {
    const next = findNext(timings);
    return timings[next ? next.key : TIMINGS_TO_SHOW[0]];
};

export const convertStringToDate = (date, time) => {
    const [h, m] = time.split(' ')[0].split(':').map(Number);
    const [day, month, year] = date.split('-').map(Number);
    return skopjeWallTimeToDate(year, month, day, h, m);
};

// "HH:mm" minus 24 minutes, pure minute arithmetic (no Date, no DST issues).
export const fajrTime = (timings) => {
    const [h, m] = timings.split(' ')[0].split(':').map(Number);
    const total = (((h * 60 + m - 24) % 1440) + 1440) % 1440;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

function formatTimeDifference(difference) {
    const seconds = Math.max(0, Math.floor(difference / 1000));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let formattedTime = '';
    if (hours > 0) formattedTime += `${hours}h `;
    if (minutes > 0) formattedTime += `${minutes}m `;
    if (hours === 0 && minutes === 0) formattedTime += `${remainingSeconds}s`;
    return formattedTime.trim();
}

export const calculateTimeDifference = (timings) => {
    const now = new Date();
    const next = findNext(timings, now);
    // After Isha: count down to tomorrow's first prayer.
    const target = next ? next.at : timeOnDay(timings[TIMINGS_TO_SHOW[0]], now, 1);
    return formatTimeDifference(target.getTime() - now.getTime());
};

export const getNextPrayer = (timings, now = new Date()) => {
    const next = findNext(timings, now);
    if (next) return next;
    // after Isha: tomorrow's first prayer
    const first = TIMINGS_TO_SHOW[0];
    return {key: first, at: timeOnDay(timings[first], now, 1)};
};

// How far we are (0–1) between the previous moment of the day and the next one.
export const getProgress = (timings, now = new Date()) => {
    const next = getNextPrayer(timings, now);
    let prevAt = null;
    for (let i = TIMINGS_TO_SHOW.length - 1; i >= 0; i--) {
        const t = timings[TIMINGS_TO_SHOW[i]];
        if (!t) continue;
        const at = timeOnDay(t, now);
        if (at.getTime() <= now.getTime()) { prevAt = at; break; }
    }
    if (!prevAt) {
        // before the first moment of the day: measure from last night's Isha
        const last = [...TIMINGS_TO_SHOW].reverse().find((k) => timings[k]);
        prevAt = timeOnDay(timings[last], now, -1);
    }
    const span = next.at.getTime() - prevAt.getTime();
    if (span <= 0) return 0;
    return Math.min(1, Math.max(0, (now.getTime() - prevAt.getTime()) / span));
};

export const hasPassed = (hhmm, now = new Date()) => timeOnDay(hhmm, now).getTime() <= now.getTime();

const WEEKDAYS = ['e diel', 'e hënë', 'e martë', 'e mërkurë', 'e enjte', 'e premte', 'e shtunë'];
const MONTHS_SQ = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];

// e.g. "e hënë, 26 Tetor 2026" (Skopje date)
export const skopjeDateLabel = (instant = new Date()) => {
    const p = skopjeParts(instant);
    const weekday = new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();
    return `${WEEKDAYS[weekday]}, ${p.day} ${MONTHS_SQ[p.month - 1]} ${p.year}`;
};

export const gregorianDate = (gregorian) => {
    if (!gregorian || !gregorian.month || !gregorian.month.en) return '';
    return `${gregorian.day} ${MONTHS[gregorian.month.en]}`;
}

function toUnicode(str) {
    return str.split('').map(function (value, index, array) {
        var temp = value.charCodeAt(0).toString(16).toUpperCase();
        if (temp.length > 2) {
            return '\\u' + ('0000' + temp).slice(-4); // Ensure four hexadecimal digits
        }
        return value;
    }).join('');
}

export const hijriDate = (hijri) => {
    if (!hijri || !hijri.month || !hijri.month.en) return '';

    const hijriMonth = hijri.month.en;

    const mapMonthName = (monthName) => {
        const normalizedMonth = monthName.replace(/ū/g, "\u016B");
        return HIJRIMONTHS[normalizedMonth];
    };

    const monthName = mapMonthName(hijriMonth);

    return `${hijri.day} ${monthName || hijriMonth}`;
}

const findLocationUser = () => {
    return new Promise((resolve, reject) => {
        let city = "";
        let country = "";
        if ("geolocation" in navigator) {
            // Get the user's current position
            navigator.geolocation.getCurrentPosition(async function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                if (data.address) {
                    city = data.address.city || data.address.town || data.address.village;
                    country = data.address.country;

                    resolve({userCity: city, country});
                } else {
                    reject("Error: Could not find address details for the given coordinates.");
                }
            }, function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        reject("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        reject("An unknown error occurred.");
                        break;
                }
            });
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
};

export const getUserLocation = () => {
    let getCity = "";
    let getCountry = "";

    findLocationUser()
        .then(({userCity, country}) => {
            getCity = userCity;
            getCountry = country
        })
        .catch(error => {
            console.error(error);
        });

    return {getCity, getCountry};
}