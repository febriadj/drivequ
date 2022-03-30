import React, { useState } from 'react';
import * as icon from 'react-icons/bi';
import avatar from '../assets/images/avatar.png';
import Profile from './profile';

function Navbar() {
  const [profileIsOpen, setProfileIsOpen] = useState(false);

  return (
    <div className="absolute w-full h-16 border border-gray-300 border-solid border-x-0 border-t-0 bg-white z-40">
      {
        profileIsOpen && <Profile setProfileIsOpen={setProfileIsOpen} />
      }
      <div className="w-full py-2 px-2.5 gap-5 sm:gap-0 sm:px-5 grid grid-cols-2/1fr-auto sm:grid-cols-3/auto-1fr-0.5fr items-center">
        <div className="items-center gap-1.5 hidden sm:w-16 sm:flex md:w-56">
          <icon.BiCloudSnow className="text-3xl" />
          <h3 className="text-xl hidden md:block">CloudSync</h3>
        </div>
        <label htmlFor="search" className="grid grid-cols-3/auto-1fr-auto items-center gap-3.5 w-full bg-gray-100 py-1.5 pl-3.5 pr-1.5 rounded-lg">
          <icon.BiSearch className="text-2xl" />
          <input
            type="text"
            name="search"
            id="search"
            className="bg-transparent w-full"
            placeholder="Search documents"
          />
          <button
            type="button"
            className="cursor-pointer hover:bg-gray-200 py-1.5 px-2.5 rounded-md"
          >
            <icon.BiSlider className="text-2xl" />
          </button>
        </label>
        <div className="flex items-center justify-end gap-5">
          <img
            src={avatar}
            alt={avatar}
            className="w-12 h-12 rounded-[50%] border-solid border border-gray-300 cursor-pointer"
            onClick={() => {
              setProfileIsOpen((prev) => !prev);
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
