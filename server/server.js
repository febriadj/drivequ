require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const database = require('./database/connect');

const inRoutes = require('./routes/internal');
const exRoutes = require('./routes/external');

database();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/in', inRoutes);
app.use('/api', exRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/public'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
  });
}

module.exports = app;
