import {apiLocation} from "../utils/service.js";

export async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                resolve({latitude, longitude});
            }, function () {
                resolve({latitude: 42.13222, longitude: 21.71444})
            });
        } else {
            resolve({latitude: 42.13222, longitude: 21.71444})
        }
    }).then(async ({latitude, longitude}) => {
        try {
            const response = await apiLocation(latitude, longitude);
            const address = response.data.address;
            localStorage.setItem('city', address.city);
            localStorage.setItem('country', address.country);
            return response.data.address;
        } catch (err) {
            console.error(err);
        }
    }).catch(error => {
        console.error(error);
    });
}