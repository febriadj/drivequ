import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './style.css';

import * as page from './pages';

function App() {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state);

  useEffect(() => {
    dispatch({
      type: 'isLoggedIn',
      payload: !!token,
    });
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Routes>
        {
          !isLoggedIn
            ? <Route exact path="/" element={<page.auth />}></Route>
            : (
              < >
                <Route exact path="/" element={<page.myStorage />} />
                <Route exact path="/folder/:url" element={<page.docInFolder />} />
                <Route exact path="/trash" element={<page.trash />} />
              </>
            )
        }
        <Route path="*" element={<page.notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
