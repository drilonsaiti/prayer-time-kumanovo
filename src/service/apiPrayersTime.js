import {apiRequest} from "../utils/service.js";
import {scrapePrayerTimes} from "./apiPrayersTimeScraper.js";

export async function getPrayersTime(city) {
    try {
        // Get scraped prayer times for today
        const scrapedTimes = await scrapePrayerTimes(city);

        // Get Hijri/Gregorian dates from API
        const response = await apiRequest(city);
        const apiData = response.data.data;

        // Get today's date entry
        const today = new Date();
        const todayFormatted = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

        const todayData = apiData.find(item => item.date.gregorian.date === todayFormatted);

        if (!todayData) {
            throw new Error('Today\'s date not found in API response');
        }

        // Combine: use scraped times but keep API date info
        return [{
            ...todayData,
            timings: {
                ...todayData.timings,
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