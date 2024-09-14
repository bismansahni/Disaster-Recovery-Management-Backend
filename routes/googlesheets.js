// routes/googleSheets.js

import express from 'express';
import { getSheetsData, appendSheetsData,initiateAuth,handleOAuthCallback } from '../controllers/googlesheetscontroller.js';  // Call controller functions



const router = express.Router();

// Route to start the OAuth process
router.get('/auth', initiateAuth);

// Route to handle the OAuth 2.0 callback
router.get('/oauth2callback', handleOAuthCallback);

// Route to get data from Google Sheets
router.get('/get-sheets-data', getSheetsData);

// Route to append data to Google Sheets
router.post('/append-sheets-data', appendSheetsData);

export default router;