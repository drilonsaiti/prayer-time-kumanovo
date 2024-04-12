import {useQuery} from "@tanstack/react-query";
import {getPrayersTime} from "../service/apiPrayersTime.js";

export function usePrayersTime() {
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ["prayersTime"],
        queryFn: getPrayersTime,
    });

    return {isLoading, error, data};
}