import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as icon from 'react-icons/bi';

import { logout } from '../redux/features/user';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="absolute w-80 bg-white z-[90] right-0 top-0 translate-y-14 -translate-x-10 shadow-xl shadow-gray-200">
      <div className="p-5">
        <h1 className="text-xl font-semibold">{`${user.name.first} ${user.name.last}`}</h1>
        <h1 className="text-lg">{user.email}</h1>
        <div className="my-5">
          <p className="opacity-50">Access Key ID:</p>
          <span className="py-1.5 border-0 border-b border-solid border-gray-300 grid grid-cols-2/1fr-auto items-end">
            <p className="text-base">{user.accessKeyId}</p>
            <button type="button" className="bg-gray-100 p-1 rounded-[50%]">
              <icon.BiRefresh className="text-xl" />
            </button>
          </span>
        </div>
        <button
          type="button"
          className="bg-gray-100 py-2 px-5 rounded-lg mt-2.5"
          onClick={() => {
            localStorage.removeItem('token');
            dispatch(logout());
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
