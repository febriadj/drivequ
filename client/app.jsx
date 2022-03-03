import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './style.css';

import * as page from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<page.myStorage />} />
        <Route exact path="/folder/:url" element={<page.docInFolder />} />
        <Route exact path="/trash" element={<page.trash />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
