import axios from "axios";
import {skopjeDateString} from "./helpers.js";

const skopjeYear = () => Number(skopjeDateString().slice(6));
const skopjeMonth = () => Number(skopjeDateString().slice(3, 5));

export const URL = 'https://api.aladhan.com/v1/calendarByCity';
export const PARAMS = {
    city: "Kumanovo",
    country: "North Macedonia",
    method: 13
}
const cities = {
    "Kumanovë": "Kumanovo",
    "Tetovë": "Tetovo",
    "Strugë": "Struga",
    "Shkup": "Skopje",
    "Gostivar": "Gostivar",
    "Prilep": "Prilep",
    "Kërçovë": "Kičevo",
    "Dibër": "Debar",
    "Veles": "Veles",
    "Strumicë": "Strumica"
}

export const apiRequest = async (city) => {
    const PARAMS = {
        city: cities[city],
        country: "North Macedonia",
        method: 13
    }
    try {
        const config = {
            method: "GET",
            url: `${URL}/${skopjeYear()}/${skopjeMonth()}`,
            params: {...PARAMS}
        };

        return await axios(config);
    } catch (error) {
        console.error(error.response?.data ?? error.message);
        throw new Error(error.response?.data?.message ?? error.message);
    }
};

export const apiLocation = async (latitude, longitude) => {
    const URL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    try {
        const config = {
            method: "GET",
            url: `${URL}`,
        };
        return await axios(config);
    } catch (error) {
        console.error(error.response?.data ?? error.message);
        throw new Error(error.response?.data?.message ?? error.message);
    }
}