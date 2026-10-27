import {apiRequest} from "../utils/service.js";
import {scrapePrayerTimes} from "./apiPrayersTimeScraper.js";
import {skopjeDateString} from "../utils/helpers.js";

export async function getPrayersTime(city) {
    try {
        const scrapedTimes = await scrapePrayerTimes(city);

        const todayFormatted = skopjeDateString();

        const fallbackDate = {
            gregorian: { date: todayFormatted },
            hijri: null,
        };

        let dateInfo = fallbackDate;

        try {
            const response = await apiRequest(city);
            const apiData = response.data.data;
            const todayData = apiData.find(item => item.date.gregorian.date === todayFormatted);
            if (todayData) dateInfo = todayData.date;
        } catch (apiErr) {
            console.warn('aladhan API unavailable, continuing without date info:', apiErr.message);
        }

        return [{
            date: dateInfo,
            timings: {
                Fajr: scrapedTimes.Fajr,
                Sunrise: scrapedTimes.Sunrise,
                Dhuhr: scrapedTimes.Dhuhr,
                Asr: scrapedTimes.Asr,
                Sunset: scrapedTimes.Sunset,
                Maghrib: scrapedTimes.Maghrib,
                Isha: scrapedTimes.Isha,
            }
        }];

    } catch (err) {
        console.error('Error fetching prayer times:', err);
        throw new Error(err);
    }
}