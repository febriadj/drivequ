import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Provider } from 'react-redux';

import App from './app';
import store from './redux/store';

axios.defaults.baseURL = 'http://localhost:5050/api/in';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
