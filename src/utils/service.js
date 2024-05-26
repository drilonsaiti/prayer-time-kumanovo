import axios from "axios";

export const URL = 'https://api.aladhan.com/v1/calendarByCity/';
export const PARAMS = {
    city: "Kumanovo",
    country: "North Macedonia",
    method: 13
}
export const YEAR = new Date().getFullYear();
export const MONTH = new Date().getMonth() + 1;
const cities = {
    "Kumanovë": "Kumanovo",
    "Tetovë": "Tetovo"
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
            url: `${URL}/${YEAR}/${MONTH}`,
            params: {...PARAMS}
        };

        return await axios(config);
    } catch (error) {
        console.error(error.response.data);
        throw new Error(error.response.data);
    }
};

export const apiRequestWeather = async (city) => {
    const URL_WEATHER = 'https://api.tomorrow.io/v4/weather/realtime';
    const location = cities[city].toLocaleString().toLocaleLowerCase()
    const PARAMS = {
        location: location,
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

export const apiLocation = async (latitude, longitude) => {
    const URL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    try {
        const config = {
            method: "GET",
            url: `${URL}`,
        };
        return await axios(config);
    } catch (error) {
        console.error(error.response.data);
        throw new Error(error.response.data);
    }
}