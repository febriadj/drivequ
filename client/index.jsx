import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Provider } from 'react-redux';

import App from './app';
import store from './redux/store';

const isDev = process.env.NODE_ENV === 'development';
axios.defaults.baseURL = isDev ? 'http://localhost:5050/api/in' : '/api/in';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
