import {apiRequest} from "../utils/service.js";

export async function getPrayersTime() {
    try {
        const response = await apiRequest();
        return response.data.data;

    } catch (err) {
        console.error(err);
        throw new Error(err);
    }

}



