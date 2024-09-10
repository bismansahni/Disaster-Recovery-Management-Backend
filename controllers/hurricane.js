

import { exec } from 'child_process';
import dotenv from 'dotenv';
import { getLocation } from './getlocation.js';  // This function fetches data from the weather API

// Load environment variables from the .env file
dotenv.config();

export const getHurricane = async (req, res) => {
  try {
    // Fetch location data from the weather API (assumed to be provided in the `getLocation` function)
    const locationData = await getLocation(req.body.location);

    if(locationData==400){
      return  res.send("Location not supported");}

    // Extract the relevant data from the API response
    const lat = locationData.lat;
    const lon = locationData.lon;
    const wind_mph = locationData.wind_mph;
    const pressure_hg = locationData.pressure_hg;
    const location=locationData.locationname;

    // // Check if all required inputs are provided
    // if (!lat || !lon || !wind_mph || !pressure_hg) {
    //   return res.status(400).json({ error: 'Location, wind speed, and pressure data are required.' });
    // }

    // Get Python path from environment variable
    const pythonPath = process.env.PYTHON_PATH || '/default/path/to/python3';  // Default to a fallback if not set
    const scriptPath = './predictionprocess/hurricane_prediction.py';  // Path to your Python script

    console.log("hehehehe the location is "+location);

    // Construct the command to pass the inputs to the Python script
    const pythonCommand = `${pythonPath} ${scriptPath} ${lat} ${lon} ${wind_mph} ${pressure_hg} ${location}`;

    exec(pythonCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).json({ error: 'Failed to run the prediction' });
      }
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        return res.status(500).json({ error: 'Error in the prediction script' });
      }

      // Send the Python script output as the response
      res.json({ prediction: stdout.trim() });
      console.log("Hurricane prediction successful");
    });
  } catch (error) {
    console.error(`Error fetching location data: ${error.message}`);
    return res.status(500).json({ error: 'Failed to fetch location data' });
  }
};
