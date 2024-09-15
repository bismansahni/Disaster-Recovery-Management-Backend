import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import hurricane from './routes/hurricane.js';
import googleSheetsRoutes from './routes/googlesheets.js';
import Authroute from './routes/authorization.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 1292;


app.use(cors());
app.use(express.json()); 
app.get('/', (req, res) => {
  res.send('Hello World');
});


app.use('/hurricane', hurricane);


app.use('/sheets', googleSheetsRoutes);
app.use('/auth',Authroute)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  