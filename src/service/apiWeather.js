import {apiRequestWeather} from "../utils/service.js";

export async function getWeather() {
    try {
        const response = await apiRequestWeather();
        return response.data;

    } catch (err) {
        console.error(err);
        throw new Error(err);
    }

}