import dotenv from 'dotenv';
import axios from 'axios';  // Use axios for making HTTP requests

// Initialize dotenv to load environment variables
dotenv.config();

// Load the weather API key from environment variables
const WEATHER_API = process.env.WEATHER_API;

export const getLocation = async (location) => {
    // Check if the location is provided
    if (!location) {
        throw new Error('Location is required');
    }
    console.log(location);
    try {
        // Fetch weather data using Axios
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API}&q=${location}&aqi=no`);
        

        //say if response code is 400 send response location not supported as of now
        if(response.status==400){
            return 400;
        }
       
     
        const data = response.data;

        console.log(data);

        // Extract the necessary fields
        const lat = data.location.lat;
        console.log(lat);
        const lon = data.location.lon;
        const wind_mph = data.current.wind_mph;
        const pressure_hg = data.current.pressure_in;
        const locationname = data.location.name;

        // Return only the required fields
        return { lat, lon, wind_mph, pressure_hg ,locationname};
    } catch (error) {
        console.error(`Error fetching location: ${error.message}`);
        throw error;
    }
};
