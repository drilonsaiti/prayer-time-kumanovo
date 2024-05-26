import {useQuery} from "@tanstack/react-query";
import {getLocation} from "../service/apiLocation.js";

export function useLocation() {
    const {
        isLoading,
        data: address,
        error,
    } = useQuery({
        queryKey: ["location"],
        queryFn: getLocation,
    });


    return {isLoading, error, address};
}