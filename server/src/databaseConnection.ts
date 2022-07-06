import mongoose, { ConnectionOptions } from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

const DB_HOST = process.env.__DEV__ ? process.env.DEV_DB_HOST : process.env.DB_HOST;
const DB_NAME = process.env.__DEV__ ? process.env.DEV_DB_NAME : process.env.DB_NAME;
const DB_PASS = process.env.__DEV__ ? process.env.DEV_DB_PASS : process.env.DB_PASS;
const DB_USER = process.env.__DEV__ ? process.env.DEV_DB_USER : process.env.DB_USER;

const connectToDatabase = async (): Promise<void> => {
  const options: ConnectionOptions = { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true };

  await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`, options);
  // await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, options);
};

export { connectToDatabase };
