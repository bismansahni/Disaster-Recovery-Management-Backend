
import dotenv from 'dotenv';
import axios from 'axios';
import oAuth2Client , {sheets } from '../services/googlesheetsapi.js';

dotenv.config();

const SHEET_ID = process.env.SHEET_ID;
console.log(SHEET_ID);

export const signup = async (req, res) => {
  const { email, password,zipcode } = req.body;

  if (!email || !password || !zipcode)  {
    return res.status(400).send('Email , password ,zipcode are required');
  }
  console.log(zipcode);
  console.log(`Signing up user with email: ${email}`);

  try {
    // Attempt to append email and password to Google Sheets
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID, // The Google Sheet ID from .env
      range: 'Sheet1!A1', // Adjust the range to match where you want to append data
      valueInputOption: 'RAW', // RAW ensures data is appended without formatting
      resource: {
        values: [[email, password,zipcode]], // Appending email and password as a new row
      },
    });

    // Send a success message
    res.status(200).send('User signed up successfully');
    console.log('Appended data to Google Sheets:', response.data);
  } catch (error) {
    // Handle specific error when refresh token is invalid
    if (error.response && error.response.data.error === 'invalid_grant') {
      console.log('Invalid refresh token, redirecting to re-authenticate...');

      // Redirect to OAuth flow to re-authenticate
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', // Ensures you get a refresh token
        scope: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      res.redirect(authUrl); // Redirect user to the Google consent screen for re-authentication
    } else {
      // Handle general errors
      console.error('Error appending data to Google Sheets:', error.message || error);
      res.status(500).send('Failed to sign up user');
    }
  }
};
