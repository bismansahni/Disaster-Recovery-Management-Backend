

import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env;

console.log('Redirect URI:', REDIRECT_URI);

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !REFRESH_TOKEN) {
  console.error('Error: Missing required environment variables.');
  process.exit(1);
}

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Set up the OAuth2 client with credentials
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

if (REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
}

export const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

export default oAuth2Client;
