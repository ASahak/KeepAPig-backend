import { MongoClient } from 'mongodb';
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const MONGO_URL = process.env.MONGODB_CONNECTION_STRING;

export const getDb = async () => {
  const client: any = await MongoClient.connect(MONGO_URL, {
    useUnifiedTopology: true,
  });
  return client.db();
};
