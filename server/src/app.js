const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.route');

const app = express();

app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(express.json());

app.use('/api/auth', authRoutes);

module.exports = app;