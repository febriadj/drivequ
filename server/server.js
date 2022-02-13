require('dotenv').config();

const express = require('express');
const cors = require('cors');
const database = require('./database/connect');

const inRoutes = require('./routes/internal');

database();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/in', inRoutes);

module.exports = app;
