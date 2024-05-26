import {useQuery} from "@tanstack/react-query";
import {getPrayersTime} from "../service/apiPrayersTime.js";

export function usePrayersTime(city) {

    console.log("CITY IN USE", city)
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ["prayersTime", city], // Pass queryKey as an array
        queryFn: () => getPrayersTime(city), // Pass queryFn as a function that fetches prayer times based on the city
    });

    return {isLoading, error, data};
}