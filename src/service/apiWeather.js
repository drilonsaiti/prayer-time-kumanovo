import {apiRequestWeather} from "../utils/service.js";

export async function getWeather(city) {
    try {
        const response = await apiRequestWeather(city);
        return response.data;

    } catch (err) {
        console.error(err);
        throw new Error(err);
    }

}