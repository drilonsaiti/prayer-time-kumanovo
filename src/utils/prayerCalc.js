// Prayer times are CALCULATED in the browser (astronomical formulas via the
// open-source `adhan` library). No server, no scraping, works offline.
import {CalculationMethod, Coordinates, PrayerTimes} from 'adhan';

export const TIME_ZONE = 'Europe/Skopje';

// City name (as shown in the app) -> [latitude, longitude]
export const CITIES = {
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
};

// ───────── Calculation settings (one place to adjust) ─────────
// Diyanet-style method: Fajr 15°, Isha 18°, Shafi'i Asr, plus the usual safety
// margins (sunrise -7, Dhuhr +5, Asr +4, Maghrib +7 are built into the method).
// EXTRA_MINUTES nudges the result to match takvimi.net's published Skopje times
// for 27.10.2026. This is tuned on ONE day: check it against other seasons.
const FAJR_ANGLE = 15;
const ISHA_ANGLE = 18;
const EXTRA_MINUTES = {sunrise: 1, dhuhr: 2, asr: 2, maghrib: 1};
const IMSAK_MINUTES_BEFORE_FAJR = 20;
// Dreka is prayed at a fixed clock time in the Albanian community calendars:
// 12:00 in winter time, 13:00 in summer time. "Hyrja e drekës" is when Dhuhr begins.
const DREKA_WINTER = '12:00';
const DREKA_SUMMER = '13:00';

const hhmmFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
const hhmm = (instant) => hhmmFormatter.format(instant);

// True while Skopje is on summer time (UTC+2).
function isSummerTime(instant) {
    const part = new Intl.DateTimeFormat('en-GB', {timeZone: TIME_ZONE, timeZoneName: 'shortOffset'})
        .formatToParts(instant).find((p) => p.type === 'timeZoneName');
    return Boolean(part) && part.value === 'GMT+2';
}

// dateParts: {year, month, day} = the calendar date in Skopje.
export function calculateTimings(city, dateParts, instant = new Date()) {
    const coords = CITIES[city] || CITIES['Kumanovë'];
    const params = CalculationMethod.Turkey();
    params.fajrAngle = FAJR_ANGLE;
    params.ishaAngle = ISHA_ANGLE;
    params.adjustments = {...params.adjustments, ...EXTRA_MINUTES};

    // adhan reads the local Y/M/D of this Date, so build it from the Skopje date parts.
    const pt = new PrayerTimes(
        new Coordinates(coords[0], coords[1]),
        new Date(dateParts.year, dateParts.month - 1, dateParts.day),
        params
    );
    const imsak = new Date(pt.fajr.getTime() - IMSAK_MINUTES_BEFORE_FAJR * 60000);

    return {
        Imsak: hhmm(imsak),
        Fajr: hhmm(pt.fajr),        // Sabahu
        Shuruq: hhmm(pt.sunrise),   // Lindja e diellit
        Hyrja: hhmm(pt.dhuhr),      // Hyrja e drekës (Dhuhr begins)
        // Dreka (fixed time). Use noon of that date to decide winter/summer time.
        Dhuhr: isSummerTime(new Date(Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day, 11)))
            ? DREKA_SUMMER : DREKA_WINTER,
        Asr: hhmm(pt.asr),          // Ikindia
        Maghrib: hhmm(pt.maghrib),  // Akshami
        Isha: hhmm(pt.isha),        // Jacia
    };
}
