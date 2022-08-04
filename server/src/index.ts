import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

import { connectToDatabase } from './databaseConnection';
import { userRoute } from './routes/user.route';
import { authRoute } from './routes/auth.route';
import authenticate from './middlewares/auth';
import { paymentRoute } from './routes/payment.route';
import { githubRepoRoute } from './routes/githubRepo.route';
import { commentRoute } from './routes/comment.route';
import { challengeRoute } from './routes/challenge.route';
import { promoCodeRoute } from './routes/promocode.route';

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '3001');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(cors());

// Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use('/api/', userRoute());
app.use('/api/', authRoute());
app.use('/api/', paymentRoute());
app.use('/api/', githubRepoRoute());
app.use('/api/', commentRoute());
app.use('/api/', challengeRoute());
app.use('/api/', promoCodeRoute());

app.get('/api', (req, res) => {
  return res.json({ message: 'Hello Arslan !', enviroment: process.env.__DEV__ ? 'development' : 'production' });
});

app.get('/api/authorizedOnly', authenticate, (req, res) => {
  return res.json({ message: 'Hello Arslan !', enviroment: process.env.__DEV__ ? 'development' : 'production' });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.status(200).json({ status: 'success', message: "Api is working fine just this endpoint doesn't exist !" });
});

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Application started on URL ${HOST}:${PORT} - Enviroment:${process.env.__DEV__ ? 'development' : 'production'}-->🎉🎉🎉 `);
});
