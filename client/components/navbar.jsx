import React from 'react';
import * as icon from 'react-icons/bi';
import avatar from '../assets/avatar.png';

function Navbar() {
  return (
    <div className="absolute w-full h-16 border border-gray-300 border-solid border-x-0 border-t-0 bg-white z-50">
      <div className="w-full py-2 px-5 grid grid-cols-3/auto-1fr-0.5fr items-center">
        <div className="flex items-center gap-1.5 w-60">
          <icon.BiCloudSnow className="text-3xl" />
          <h3 className="text-xl">Cloudipati</h3>
        </div>
        <label htmlFor="search" className="flex items-center gap-3.5 w-full bg-gray-100 py-3 px-3.5 rounded-xl">
          <icon.BiSearch className="text-2xl" />
          <input
            type="text"
            name="search"
            id="search"
            className="bg-transparent w-full"
            placeholder="Search documents"
          />
          <icon.BiSlider className="text-2xl" />
        </label>
        <div className="flex items-center justify-end gap-5">
          <img
            src={avatar}
            alt={avatar}
            className="w-12 h-12 rounded-[50%] border-solid border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
