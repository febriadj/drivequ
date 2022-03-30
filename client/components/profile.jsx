import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as icon from 'react-icons/bi';
import { logoutModal } from '../redux/features/modal';

function Profile({ setProfileIsOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="absolute w-64 sm:w-80 bg-white z-10 right-0 top-0 translate-y-14 -translate-x-2.5 md:-translate-x-10 shadow-xl shadow-gray-200">
      <div className="p-5">
        <div className="flex justify-end">
          <p className="text-sm first-letter:uppercase">{user.type}</p>
        </div>
        <span className="flex items-center gap-2.5 mb-1.5">
          <icon.BiRocket className="text-2xl" />
          <h1 className="text-xl font-semibold">{user.app}</h1>
        </span>
        { user.type === 'personal' && <p>{`${user.name.first} ${user.name.last}`}</p> }
        { user.type === 'business' && <p>{user.company}</p> }
        <p>{user.email}</p>
        <div className="my-5">
          <p className="opacity-50">Access Key ID:</p>
          <span className="py-1 border-0 border-b border-solid border-gray-300 grid grid-cols-2/1fr-auto items-end">
            <p className="text-base">{user.accessKeyId}</p>
            <button
              type="button"
              className="bg-gray-100 p-1 rounded-[50%] hover:bg-gray-200"
            >
              <icon.BiRefresh className="text-xl" />
            </button>
          </span>
          <p className="opacity-50 mt-0.5 text-sm">use this key to connect your app.</p>
        </div>
        <button
          type="button"
          className="bg-gray-100 py-2 px-5 rounded-lg mt-2.5 hover:bg-gray-200"
          onClick={() => {
            setProfileIsOpen(false);

            setTimeout(() => {
              dispatch(logoutModal());
            }, 200);
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Profile;
