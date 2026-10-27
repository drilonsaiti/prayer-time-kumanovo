# Prayer Time

## Overview
Prayer Time is a web application designed to display prayer times for Muslims in Kumanovo, North Macedonia. It provides accurate prayer timings and countdowns to the next prayer throughout the day.


## Features
* Prayer Time Display: Show the 5 daily prayer times according to the Islamic calendar.
* Next Prayer Highlight: Highlight the next upcoming prayer for quick reference.
* Countdown Timer: Display a countdown timer to the next prayer time, updating dynamically.

## Technology 
React JS

## Setup
Clone the repository.
Install dependencies: `npm install`.
Run the application: `npm run dev`. There is no server part and no API key to set up.

## How it works
- Prayer times are calculated in the browser with the open-source [adhan](https://github.com/batoulapps/adhan-js) library (settings in `src/utils/prayerCalc.js`). Nothing is scraped from third-party websites.
- All dates and times use the Europe/Skopje timezone, so the clock change is handled automatically.
- The app works offline: a service worker (`public/sw.js`, filled in by `vite.config.js` at build time) saves the whole app, and the Hijri calendar (from aladhan.com) is saved on the device while online. When a new version is deployed, visitors see a "Version i ri i gatshëm" bar with a "Rifresko" button.
- The service worker is only registered in production builds (`npm run build` + `npm run preview`).

## Usage
### Once the application is running, users can:

* View the current prayer times and the countdown to the next prayer.
* Refresh the page to get updated prayer timings if needed.

## Contributors
* ### [Drilon Saiti](https://drilonsaiti.github.io/)