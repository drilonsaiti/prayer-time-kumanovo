import {apiRequest} from "../utils/service.js";

export async function getPrayersTime(city) {
    try {
        const response = await apiRequest(city);
        return response.data.data;

    } catch (err) {
        console.error(err);
        throw new Error(err);
    }

}



