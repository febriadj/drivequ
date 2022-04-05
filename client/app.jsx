import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './style.css';
import * as helper from './helpers';

import * as page from './pages';
import { login, logout } from './redux/features/auth';
import { totalSize } from './redux/features/document';

function App() {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      const { data } = await axios.get('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(login(data.payload));
      dispatch(totalSize(await helper.totalSize({ trashed: false })));
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  useEffect(() => {
    if (token) {
      handleLogin();
    } else {
      dispatch(logout());
    }
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Routes>
        {
          !isLoggedIn && !user
            ? <Route exact path="*" element={<page.auth />}></Route>
            : (
              < >
                <Route exact path="/" element={<page.myStorage />} />
                <Route exact path="/folder/:url" element={<page.docInFolder />} />
                <Route exact path="/trash" element={<page.trash />} />
                <Route path="*" element={<page.notfound />} />
              </>
            )
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
