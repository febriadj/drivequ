import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logoutModal } from '../redux/features/modal';
import { logout } from '../redux/features/auth';

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="fixed w-full h-full z-50 bg-gray-700/50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-[450px] mx-5">
        <h2 className="text-xl font-semibold">Sign Out</h2>
        <p className="text-base mt-2.5 mb-8">You can leave this page without logging out, do you still want to logout from this account?</p>
        <span className="flex justify-end gap-2.5">
          <button
            type="button"
            className="py-1.5 px-2.5 hover:bg-gray-100 rounded-md"
            onClick={() => {
              dispatch(logoutModal());
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="py-1.5 px-3.5 bg-blue-500 hover:bg-blue-600 rounded-md text-white"
            onClick={() => {
              dispatch(logoutModal());

              setTimeout(() => {
                localStorage.removeItem('token');
                dispatch(logout());
                navigate('/');
              }, 500);
            }}
          >
            Sign Out
          </button>
        </span>
      </div>
    </div>
  );
}

export default Logout;
