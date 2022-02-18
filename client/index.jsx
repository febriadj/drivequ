import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import App from './app';

axios.defaults.baseURL = 'http://localhost:5050/api/in';

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
