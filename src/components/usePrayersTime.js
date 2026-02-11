import {useQuery} from "@tanstack/react-query";
import {getPrayersTime} from "../service/apiPrayersTime.js";

function getMillisecondsUntilAfterIsha() {
    const now = new Date();
    const tonight = new Date(now);

    // Set to 11:59 PM today (after Isha is guaranteed to have passed)
    tonight.setHours(23, 59, 0, 0);

    const msUntilMidnight = tonight.getTime() - now.getTime();

    // If it's already past 11:59 PM, cache until tomorrow's midnight
    if (msUntilMidnight < 0) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 0, 0);
        return tomorrow.getTime() - now.getTime();
    }

    return msUntilMidnight;
}

export function usePrayersTime(city) {
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ["prayersTime", city],
        queryFn: () => getPrayersTime(city),
        staleTime: getMillisecondsUntilAfterIsha(), // Cache until midnight
        cacheTime: getMillisecondsUntilAfterIsha() + 60000, // Keep in cache a bit longer
        refetchOnWindowFocus: false, // Don't refetch on focus
        refetchOnMount: false, // Don't refetch on mount if cache is valid
    });

    return {isLoading, error, data};
}