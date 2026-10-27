import {useMemo} from "react";
import {calculateTimings} from "../utils/prayerCalc.js";
import {skopjeDateParts} from "../utils/helpers.js";

// Times are calculated on the device, so there is nothing to load and nothing
// that can fail offline. The Skopje date is part of the memo key, so a new day
// (or the clock-change day) always gets fresh values.
export function usePrayersTime(city) {
    const {year, month, day} = skopjeDateParts();

    return useMemo(() => {
        try {
            const timings = calculateTimings(city, {year, month, day}, new Date());
            return {isLoading: false, error: null, data: [{timings}]};
        } catch (error) {
            console.error('Could not calculate prayer times:', error);
            return {isLoading: false, error, data: null};
        }
    }, [city, year, month, day]);
}
