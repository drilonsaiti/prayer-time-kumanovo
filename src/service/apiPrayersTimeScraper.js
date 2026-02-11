import axios from "axios";

const API_URL = '/api/prayer-times';

export async function scrapePrayerTimes(city = "Shkup") {
    try {
        // Call the Vercel serverless function
        const response = await axios.get(API_URL, {
            params: { city },
            timeout: 15000 // Serverless functions can be slower on cold start
        });

        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to fetch prayer times');
        }

        return response.data.data;

    } catch (error) {
        console.error('Error fetching prayer times:', error.message);
        throw new Error(`Failed to scrape prayer times: ${error.message}`);
    }
}