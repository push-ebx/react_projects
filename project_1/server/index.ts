import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './router/router'
import mongoose, { ConnectOptions } from "mongoose";
const cors = require('cors')

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
const DB_URL = 'mongodb+srv://nikita:58zhG3wnk6rUyTnw@cluster0.hrx42.mongodb.net/ToDo?retryWrites=true&w=majority'

app
  .use(cors())
  .use(express.json())
  .use('/api', router);

(async () => {
  try {
    await mongoose.connect(DB_URL, {useUnifiedTopology: true, useNewUrlParser: true} as ConnectOptions)
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  } catch (e) {
    console.log(e);
  }
})();

