import React from 'react';
import * as icon from 'react-icons/bi';

function Navbar() {
  return (
    <div className="fixed w-full h-16 border border-gray-300 border-solid border-x-0 border-t-0 bg-white z-50">
      <div className="w-full py-2 px-5 grid grid-cols-navbar items-center">
        <div className="flex items-center gap-2.5 w-60">
          <icon.BiPackage className="text-4xl" />
          <h3 className="text-xl">Storage</h3>
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
        </label>
        <div className="flex items-center justify-end gap-5">
          <icon.BiInfoCircle className="text-2xl" />
          <span className="w-10 h-10 rounded-[50%] bg-gray-100">
            p
          </span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
