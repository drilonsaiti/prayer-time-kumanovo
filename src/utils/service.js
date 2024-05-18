import axios from "axios";

export const URL = 'https://api.aladhan.com/v1/calendarByCity/';
export const PARAMS = {
    city: "Kumanovo",
    country: "North Macedonia",
    method: 13
}
export const YEAR = new Date().getFullYear();
export const MONTH = new Date().getMonth() + 1;


export const apiRequest = async () => {
    try {
        const config = {
            method: "GET",
            url: `${URL}/${YEAR}/${MONTH}`,
            params: {...PARAMS}
        };

        return await axios(config);
    } catch (error) {
        console.error(error.response.data);
        throw new Error(error.response.data);
    }
};

export const apiRequestWeather = async () => {
    const URL_WEATHER = 'https://api.tomorrow.io/v4/weather/realtime';
    const PARAMS = {
        location: "kumanovo",
        apikey: import.meta.env.VITE_WEATHER_API_KEY

    }
    try {
        const config = {
            method: "GET",
            url: `${URL_WEATHER}`,
            params: {...PARAMS}
        };
        return await axios(config);
    } catch (error) {
        console.error(error.response.data);
        throw new Error(error.response.data);
    }
}