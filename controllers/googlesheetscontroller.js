// // controllers/googleSheetsController.js

// import oAuth2Client, { sheets } from '../services/googlesheetsapi.js';  
// import dotenv from 'dotenv';

// dotenv.config();

// const { SHEET_ID } = process.env;

// if (!SHEET_ID) {
//   console.error('Error: Missing required environment variables.');
//   process.exit(1);
// }

// // Initiate OAuth process and redirect to Google
// export const initiateAuth = (req, res) => {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline', // Ensures we get a refresh token
//     scope: ['https://www.googleapis.com/auth/spreadsheets'],
//   });
//   console.log(`Incoming request for ${req.url} at ${new Date().toISOString()}`);
//   res.redirect(authUrl);
// };

// // Handle OAuth callback and exchange code for tokens
// export const handleOAuthCallback = async (req, res) => {
//   const code = req.query.code;
//   console.log('Received code:', code);
//   if (!code) {
//     return res.status(400).send('Authorization code not provided.');
//   }

//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);  // Set the tokens
//     console.log('Tokens received:', tokens);

//     // Store the refresh token if available
//     if (tokens.refresh_token) {
//       console.log('Refresh token:', tokens.refresh_token);
//       // You should securely store this refresh token for future use
//     }

//     res.send('Authentication successful! You can now access Google Sheets.');
//   } catch (error) {
//     console.error('Error exchanging code for tokens:', error.message);
//     res.status(500).send('Failed to authenticate.');
//   }
// };








import oAuth2Client, { sheets } from '../services/googlesheetsapi.js';  
import dotenv from 'dotenv';

dotenv.config();

const { SHEET_ID } = process.env;

if (!SHEET_ID) {
  console.error('Error: Missing required environment variables.');
  process.exit(1);
}

// Initiate OAuth process and redirect to Google
export const initiateAuth = (req, res) => {
  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline', // Ensures we get a refresh token
      scope: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Log incoming request and generated auth URL
    console.log(`Incoming request for ${req.url} at ${new Date().toISOString()}`);
    console.log('Generated Auth URL:', authUrl);
    
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating OAuth:', error.message);
    res.status(500).send('Error initiating OAuth process.');
  }
};

// Handle OAuth callback and exchange code for tokens
export const handleOAuthCallback = async (req, res) => {
  const code = req.query.code;
  console.log(`Received callback request at ${new Date().toISOString()}`);
  
  if (!code) {
    console.error('Authorization code not provided.');
    return res.status(400).send('Authorization code not provided.');
  }

  try {
    // Log the code received
    console.log('Authorization code received:', code);

    // Exchange the authorization code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);  // Set the tokens
    
    // Log the tokens received
    console.log('Tokens received:', tokens);

    // Store the refresh token if available
    if (tokens.refresh_token) {
      console.log('Refresh token:', tokens.refresh_token);
      // Ideally, securely store this refresh token in your database
    }

    res.send('Authentication successful! You can now access Google Sheets.');
  } catch (error) {
    console.error('Error exchanging code for tokens:', error.message);
    res.status(500).send('Failed to authenticate.');
  }
};







//sheets code written down




// Controller function to get data from Google Sheets
export const getSheetsData = async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1:D10',  // Adjust as needed
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      res.status(200).json(rows);
    } else {
      res.status(404).send('No data found.');
    }
  } catch (error) {
    console.error('Error accessing Google Sheets:', error.message || error);
    res.status(500).send('Error accessing Google Sheets.');
  }
};

// Controller function to append data to Google Sheets
export const appendSheetsData = async (req, res) => {
  const { data } = req.body;  // Data passed in request body

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1', // Specify where you want to append data
      valueInputOption: 'RAW',
      resource: {
        values: [data],  // Array of data to append
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error appending data to Google Sheets:', error.message || error);
    res.status(500).send('Error appending data to Google Sheets.');
  }
};
