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
    'Fajr': 'linear-gradient(to bottom, #87CEEB, #4682B4)',
    'Sunrise': 'linear-gradient(to bottom, #87CEEB, #4682B4)',
    'Dhuhr': 'linear-gradient(to bottom, #90EE90, #228B22)',
    'Asr': 'linear-gradient(to bottom, #FFD700, #DAA520)',
    'Sunset': 'linear-gradient(to bottom, #FFA500, #FF6347)',
    'Maghrib': 'linear-gradient(to bottom, #FFA500, #FF6347)',
    'Isha': 'linear-gradient(to bottom, #00008B, #191970)',
};
export const formatDate = (date) => {
    return format(new Date(date), 'dd-MM-yyyy');
}


export const nextPrayer = (timings) => {
    const timingsToShow = ['Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha'];
    const currentTimeStamp = new Date().getTime();
    let nextPrayerCount = 0;

    for (let i = 0; i < timingsToShow.length; i++) {
        const [hours, minutes] = timings[timingsToShow[i]].split(" ")[0].split(":")
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
    let nextPrayerCount = 0;

    for (let i = 0; i < timingsToShow.length; i++) {
        const [hours, minutes] = timings[timingsToShow[i]].split(" ")[0].split(":")
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        const prayerTimeStamp = date.getTime();

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
    let nextPrayerCount = 0;

    for (let i = 0; i < timingsToShow.length; i++) {
        const [hours, minutes] = timings[timingsToShow[i]].split(" ")[0].split(":")
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        const prayerTimeStamp = date.getTime();

        const isNextPrayer = prayerTimeStamp > currentTimeStamp;

        if (isNextPrayer) {
            if (timingsToShow[i] === 'Sunrise') {
                const time = timings[timingsToShow[i]].split(" ")[0];
                const [hours, minutes] = time.split(":").map(Number);
                const date = new Date();
                date.setHours(hours);
                date.setMinutes(minutes);
                date.setMinutes(date.getMinutes() - 24);


                const adjustedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

                return adjustedTime;

            }
            return timings[timingsToShow[i]].split(" ")[0];
        } else {
            nextPrayerCount++;
        }


    }
    if (nextPrayerCount === timingsToShow.length) {
        const time = timings[timingsToShow[0]].split(" ")[0];
        const [hours, minutes] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setMinutes(date.getMinutes() - 24);


        const adjustedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

        return adjustedTime;
    }

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
        const [hours, minutes] = timings[timingsToShow[i]].split(" ")[0].split(":")
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        let prayerTimeStamp = date.getTime();


        const isNextPrayer = prayerTimeStamp > currentTimeStamp;

        if (isNextPrayer) {

            if (timingsToShow[i] === 'Sunrise') {
                const time = timings[timingsToShow[i]].split(" ")[0];
                const [hours, minutes] = time.split(":").map(Number);
                const date = new Date();
                date.setHours(hours);
                date.setMinutes(minutes);
                date.setMinutes(date.getMinutes() - 24);
                prayerTimeStamp = date.getTime();
            }

            return formatTimeDifference(prayerTimeStamp - currentTimeStamp);
        } else if (timingsToShow[i] === 'Isha') {
            const [hours, minutes] = timings[timingsToShow[0]].split(" ")[0].split(":");

            const currentDate = new Date();
            const currentTimeStamp = currentDate.getTime();


            const prayerTime = new Date(currentDate);
            prayerTime.setHours(hours);
            prayerTime.setMinutes(minutes);


            if (prayerTime < currentDate) {
                prayerTime.setDate(prayerTime.getDate() + 1);
            }

            const prayerTimeStamp = prayerTime.getTime();


            const timeDifferenceInMillis = prayerTimeStamp - currentTimeStamp;

            return formatTimeDifference(timeDifferenceInMillis);

        }
    }
}

export const gregorianDate = (gregorian) => {

    return `${gregorian.day} ${MONTHS[gregorian.month.en]}`
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

    return `${hijri.day} ${HIJRIMONTHS[hijri.month.en]}`
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