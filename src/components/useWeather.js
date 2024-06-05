import {useQuery} from "@tanstack/react-query";
import {getWeather} from "../service/apiWeather.js";

export function useWeather(city) {
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ["weather", city],
        queryFn: () => getWeather(city),
    });

    return {isLoading, error, data};
}