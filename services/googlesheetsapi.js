

// import { google } from 'googleapis';
// import express from 'express';
// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables from .env

// // Ensure that environment variables are loaded correctly
// const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env;
// if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
//   console.error('Error: Missing required environment variables.');
//   process.exit(1);
// }

// const SHEET_ID=process.env.SHEET_ID;
// // const SHEET_ID=process.env.SHEET_ID;
// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// // Set the refresh token if it's already available
// if (REFRESH_TOKEN) {
//   oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
// }

// const app = express();

// // Route to initiate the OAuth flow
// app.get('/auth', (req, res) => {
//   // Generate the authorization URL for Google OAuth
//   const authorizeUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline', // Ensures you get a refresh token
//     scope: SCOPES,          // Specify the Google Sheets API scope
//   });

//   console.log('Redirecting user to Google OAuth:', authorizeUrl);
//   res.redirect(authorizeUrl);  // Redirect user to the Google consent screen
// });

// // Route to handle the OAuth 2.0 callback
// app.get('/oauth2callback', async (req, res) => {
//   const { code } = req.query;
//   if (!code) {
//     return res.status(400).send('Authorization code not provided');
//   }

//   try {
//     // Exchange authorization code for tokens
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens); // Set the retrieved tokens

//     // Log tokens for debugging purposes
//     console.log('Tokens received:', tokens);

//     // Store the refresh token for future use
//     if (tokens.refresh_token) {
//       console.log('Refresh token:', tokens.refresh_token);
//       // You should securely store this refresh token in your database for future requests
//     }

//     res.send('Authentication successful! You can now access Google Sheets.');
//   } catch (error) {
//     console.error('Error retrieving tokens:', error.message || error);
//     res.status(500).send('Authentication failed.');
//   }
// });






// // Function to access data from Google Sheets
// const accessGoogleSheets = async () => {
//   try {
//     const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

//     // Request data from a specific range in the Google Sheet
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: SHEET_ID,  // Replace with your Google Sheet ID
//       range: 'Sheet1!A1:D10',  // Adjust the range as per your sheet
//     });

//     // Log the retrieved data
//     const rows = response.data.values;
//     if (rows && rows.length) {
//       console.log('Data from Google Sheet:');
//       rows.forEach((row) => {
//         console.log(`${row.join(', ')}`);
//       });
//     } else {
//       console.log('No data found.');
//     }
//   } catch (error) {
//     console.error('Error accessing Google Sheets:', error.message || error);
//   }
// };

// // Function to append data to Google Sheets
// const appendGoogleSheetsData = async () => {
//   try {
//     const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

//     // Append new data to the Google Sheet
//     const response = await sheets.spreadsheets.values.append({
//       spreadsheetId: SHEET_ID,  // Replace with your Google Sheet ID
//       range: 'Sheet1!A1',  // Specify where you want to append data
//       valueInputOption: 'RAW',  // Entering raw data
//       resource: {
//         values: [
//           ['New Name', 'New Data', 'More Data', 'Even More Data'],
//         ],
//       },
//     });

//     console.log('Appended data:', response.data);
//   } catch (error) {
//     console.error('Error appending data to Google Sheets:', error.message || error);
//   }
// };

// // Example route to access data from Google Sheets
// app.get('/get-sheets-data', async (req, res) => {
//   try {
//     await accessGoogleSheets();  // Access the Google Sheets data
//     res.send('Google Sheets data retrieved. Check console for details.');
//   } catch (error) {
//     res.status(500).send('Failed to retrieve data from Google Sheets.');
//   }
// });

// // Example route to append data to Google Sheets
// app.get('/append-sheets-data', async (req, res) => {
//   try {
//     await appendGoogleSheetsData();  // Append data to the Google Sheet
//     res.send('Data appended to Google Sheets.');
//   } catch (error) {
//     res.status(500).send('Failed to append data to Google Sheets.');
//   }
// });

// // Start the Express server
// app.listen(3000, () => {
//   console.log('Server started on http://localhost:3000');
// });







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
