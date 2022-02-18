import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './style.css';

import * as page from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<page.dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
