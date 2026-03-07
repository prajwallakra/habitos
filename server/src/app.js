require("dotenv").config();
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.route');

const app = express();

app.use(cookieParser())

const origins = [process.env.CLIENT_URL, process.env.CLIENT_URL_PRO];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

module.exports = app;