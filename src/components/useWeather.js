import {useQuery} from "@tanstack/react-query";
import {getWeather} from "../service/apiWeather.js";

export function useWeather() {
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ["weather"],
        queryFn: getWeather,
    });

    return {isLoading, error, data};
}