import {format} from 'date-fns';
import {BsCloudSun, BsMoonStars, BsSun, BsSunrise, BsSunset} from "react-icons/bs";
import {WiCloud, WiCloudy, WiDayFog, WiDaySunny, WiFog, WiRain, WiSleet, WiSnow, WiThunderstorm} from 'react-icons/wi';

export const ICONS = {
    'Fajr': BsSunrise,
    'Sunrise': BsSunrise,
    'Dhuhr': BsSun,
    'Asr': BsCloudSun,
    'Sunset': BsSunset,
    'Maghrib': BsSunset,
    'Isha': BsMoonStars,
};
export const WEATHER_ICONS = {
    0: WiCloud, // Unknown
    1000: WiDaySunny, // Clear, Sunny
    1100: WiDaySunny, // Mostly Clear
    1101: WiCloud, // Partly Cloudy
    1102: WiCloudy, // Mostly Cloudy
    1001: WiCloudy, // Cloudy
    2000: WiFog, // Fog
    2100: WiDayFog, // Light Fog
    4000: WiRain, // Drizzle
    4001: WiRain, // Rain
    4200: WiRain, // Light Rain
    4201: WiRain, // Heavy Rain
    5000: WiSnow, // Snow
    5001: WiSnow, // Flurries
    5100: WiSnow, // Light Snow
    5101: WiSnow, // Heavy Snow
    6000: WiSleet, // Freezing Drizzle
    6001: WiSleet, // Freezing Rain
    6200: WiSleet, // Light Freezing Rain
    6201: WiSleet, // Heavy Freezing Rain
    7000: WiSleet, // Ice Pellets
    7101: WiSleet, // Heavy Ice Pellets
    7102: WiSleet, // Light Ice Pellets
    8000: WiThunderstorm  // Thunderstorm
};


export const WEATHER = {
    0: "Unknown",
    1000: "Clear, Sunny",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    1001: "Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm"
}

export const PRAYERS = {
    'Fajr': 'Sabahu',
    'Sunrise': 'Sabahu',
    'Dhuhr': 'Dreka',
    'Asr': 'Ikindia',
    'Sunset': 'Akshami',
    'Maghrib': 'Akshami',
    'Isha': 'Jacia',
}

const MONTHS = {
    "January": "Janar",
    "February": "Shkurt",
    "March": "Mars",
    "April": "Prill",
    "May": "Maj",
    "June": "Qershor",
    "July": "Korrik",
    "August": "Gusht",
    "September": "Shtator",
    "October": "Tetor",
    "November": "Nëntor",
    "December": "Dhjetor"
};

const HIJRIMONTHS = {
    "Mu\u1E25arram": "Muharrem",
    "\u1E62afar": "Safer",
    "Rab\u012B\u02BF al-awwal": "Rebi’ul Euel",
    "Rab\u012B\u02BF al-th\u0101n\u012B": "Rebi‘ul Akhir",
    "Jum\u0101d\u00E1 al-\u016Bl\u0101": "Xhumadal Euel",
    "Jum\u0101d\u00E1 al-\u0101khirah": "Xhumadal Akhir",
    "Rajab": "Rexheb ",
    "Sh\u02BF\u0101b\u0101n": "Shaban ",
    "Ram\u1E0D\u0101n": "Ramazan",
    "Shaww\u0101l": "Shevval",
    "Dh\u016B al-Qa\u02BFdah": "Dhul Kaa’de",
    "Dh\u016B al-\u1E24\u0069\u006A\u006A\u0061\u0068": "Dhul Hixhe "
};

export const backgroundGradient = {
    'Fajr':    'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    'Sunrise': 'linear-gradient(160deg, #fc5c7d 0%, #6a3093 100%)',
    'Dhuhr':   'linear-gradient(160deg, #1a6b3c 0%, #0f4c2a 50%, #0a2e1a 100%)',
    'Asr':     'linear-gradient(160deg, #c79a2a 0%, #8b6914 50%, #5a4209 100%)',
    'Sunset':  'linear-gradient(160deg, #c94b4b 0%, #4b134f 100%)',
    'Maghrib': 'linear-gradient(160deg, #ee0979 0%, #ff6a00 100%)',
    'Isha':    'linear-gradient(160deg, #0a0a1a 0%, #0d1b4b 50%, #1a1a3e 100%)',
};
export const formatDate = (date) => {
    return format(new Date(date), 'dd-MM-yyyy');
}


export const nextPrayer = (timings) => {
    const timingsToShow = ['Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha'];
    const currentTimeStamp = new Date().getTime();

    for (let i = 0; i < timingsToShow.length; i++) {
        const [hours, minutes] = timings[timingsToShow[i]].split(":");
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        const prayerTimeStamp = date.getTime();
        const isNextPrayer = prayerTimeStamp > currentTimeStamp;

        if (isNextPrayer) {
            return timingsToShow[i];
        }
    }
    return timingsToShow[0];
}

export const nextPrayerIconColor = (timings, date) => {
    const timingsToShow = ['Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha'];
    const currentTimeStamp = new Date().getTime();

    for (let i = 0; i < timingsToShow.length; i++) {
        const [hours, minutes] = timings[timingsToShow[i]].split(":");
        const prayerDate = new Date();
        prayerDate.setHours(hours);
        prayerDate.setMinutes(minutes);

        const prayerTimeStamp = prayerDate.getTime();
        const isNextPrayer = prayerTimeStamp > currentTimeStamp;

        if (isNextPrayer) {
            return timingsToShow[i];
        }
    }
    if (new Date() > new Date(date.gregorian.date)) {
        return timingsToShow[0];
    } else {
        return timingsToShow[timingsToShow.length - 1];
    }
}

export const nextPrayerTime = (timings) => {
    const timingsToShow = ['Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha'];
    const currentTimeStamp = new Date().getTime();

    for (let i = 0; i < timingsToShow.length; i++) {
        const [hours, minutes] = timings[timingsToShow[i]].split(":").map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        const prayerTimeStamp = date.getTime();
        const isNextPrayer = prayerTimeStamp > currentTimeStamp;

        if (isNextPrayer) {
            return timings[timingsToShow[i]];
        }
    }
    return timings[timingsToShow[0]];
}
export const convertStringToDate = (date, time) => {
    const [hours, minutes] = time.split(" ")[0].split(":").map(Number);
    const [day, month, year] = date.split("-")

    return new Date(year, month - 1, day, hours, minutes);

}


export const fajrTime = (timings) => {

    const [hours, minutes] = timings.split(" ")[0].split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setMinutes(date.getMinutes() - 24);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

}

function formatTimeDifference(difference) {
    const seconds = Math.floor(difference / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;


    let formattedTime = '';
    if (hours > 0) {
        formattedTime += `${hours}h `;
    }
    if (minutes > 0) {
        formattedTime += `${minutes}m `;
    }
    if (hours === 0 && minutes === 0) {
        formattedTime += `${remainingSeconds}s`;
    }

    return formattedTime.trim();
}

export const calculateTimeDifference = (timings) => {
    const timingsToShow = ['Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha'];
    const currentTimeStamp = new Date().getTime();

    for (let i = 0; i < timingsToShow.length; i++) {
        const [hours, minutes] = timings[timingsToShow[i]].split(":");
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        let prayerTimeStamp = date.getTime();
        const isNextPrayer = prayerTimeStamp > currentTimeStamp;

        if (isNextPrayer) {
            return formatTimeDifference(prayerTimeStamp - currentTimeStamp);
        } else if (timingsToShow[i] === 'Isha') {
            // If we're past Isha, calculate time until tomorrow's first prayer
            const [fajrHours, fajrMinutes] = timings[timingsToShow[0]].split(":");
            const currentDate = new Date();
            const prayerTime = new Date(currentDate);
            prayerTime.setHours(fajrHours);
            prayerTime.setMinutes(fajrMinutes);

            if (prayerTime < currentDate) {
                prayerTime.setDate(prayerTime.getDate() + 1);
            }

            const prayerTimeStamp = prayerTime.getTime();
            const timeDifferenceInMillis = prayerTimeStamp - currentDate.getTime();

            return formatTimeDifference(timeDifferenceInMillis);
        }
    }
}

export const gregorianDate = (gregorian) => {
    if (!gregorian || !gregorian.month || !gregorian.month.en) return '';
    return `${gregorian.day} ${MONTHS[gregorian.month.en]}`;
}

function toUnicode(str) {
    return str.split('').map(function (value, index, array) {
        var temp = value.charCodeAt(0).toString(16).toUpperCase();
        if (temp.length > 2) {
            return '\\u' + ('0000' + temp).slice(-4); // Ensure four hexadecimal digits
        }
        return value;
    }).join('');
}

export const hijriDate = (hijri) => {
    if (!hijri || !hijri.month || !hijri.month.en) return '';

    const hijriMonth = hijri.month.en;

    const mapMonthName = (monthName) => {
        const normalizedMonth = monthName.replace(/ū/g, "\u016B");
        return HIJRIMONTHS[normalizedMonth];
    };

    const monthName = mapMonthName(hijriMonth);

    return `${hijri.day} ${monthName || hijriMonth}`;
}

const findLocationUser = () => {
    return new Promise((resolve, reject) => {
        let city = "";
        let country = "";
        if ("geolocation" in navigator) {
            // Get the user's current position
            navigator.geolocation.getCurrentPosition(async function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                if (data.address) {
                    city = data.address.city || data.address.town || data.address.village;
                    country = data.address.country;

                    resolve({userCity: city, country});
                } else {
                    reject("Error: Could not find address details for the given coordinates.");
                }
            }, function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        reject("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        reject("An unknown error occurred.");
                        break;
                }
            });
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
};

export const getUserLocation = () => {
    let getCity = "";
    let getCountry = "";

    findLocationUser()
        .then(({userCity, country}) => {
            getCity = userCity;
            getCountry = country
        })
        .catch(error => {
            console.error(error);
        });

    return {getCity, getCountry};
}