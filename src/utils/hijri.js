// Hijri date for the label under the timer.
// Online: aladhan.com (Diyanet calendar, method 13). The data for the current and
// next month is saved on the device, so it also works offline.
// Nothing saved yet (first visit while offline): no date is shown. The browser's own
// Umm al-Qura calendar is NOT used, because it is two days off the community calendar.

const STORAGE_KEY = 'hijri-cache-v1';
const MONTHS_SQ = ['Muharrem', 'Safer', 'Rebi’ul Euel', 'Rebi’ul Akhir', 'Xhumadal Euel', 'Xhumadal Akhir',
    'Rexheb', 'Shaban', 'Ramazan', 'Shevval', 'Dhul Kaa’de', 'Dhul Hixhe'];

const two = (n) => String(n).padStart(2, '0');
const keyOf = ({year, month, day}) => `${year}-${two(month)}-${two(day)}`;

let cache = (() => {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
})();

function save() {
    try {
        // keep it small: only the most recent ~100 days
        const keys = Object.keys(cache).sort();
        for (const k of keys.slice(0, Math.max(0, keys.length - 100))) delete cache[k];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch { /* storage full or blocked: keep working from memory */ }
}

// parts: {year, month, day} (Skopje calendar date) -> "14 Xhumadal Euel 1448"
export function hijriLabel(parts) {
    const hit = cache[keyOf(parts)];
    if (!hit) return '';
    return `${hit[0]} ${MONTHS_SQ[hit[1] - 1] || ''} ${hit[2]}`;
}

async function fetchMonth(year, month) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
        const url = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}`
            + '?city=Skopje&country=North%20Macedonia&method=13';
        const res = await fetch(url, {signal: ctrl.signal});
        if (!res.ok) throw new Error(`aladhan ${res.status}`);
        const json = await res.json();
        for (const item of json.data || []) {
            const [d, m, y] = item.date.gregorian.date.split('-').map(Number);
            const h = item.date.hijri;
            const hm = Number(h.month && h.month.number);
            if (d && m && y && h.day && hm && h.year) {
                cache[keyOf({year: y, month: m, day: d})] = [Number(h.day), hm, Number(h.year)];
            }
        }
        return true;
    } finally {
        clearTimeout(timer);
    }
}

// Saves this month and next month. Safe to call any time; fails quietly when offline.
export async function refreshHijriCache(parts) {
    try {
        const next = parts.month === 12 ? {year: parts.year + 1, month: 1} : {year: parts.year, month: parts.month + 1};
        await fetchMonth(parts.year, parts.month);
        await fetchMonth(next.year, next.month).catch(() => {});
        save();
        return true;
    } catch {
        return false;
    }
}
