require('dotenv').config();

const express = require('express');
const cors = require('cors');
const database = require('./database/connect');
const routes = require('./routes');

database();
const app = express();

app.use(cors);
app.use('/api', routes);

module.exports = app;
