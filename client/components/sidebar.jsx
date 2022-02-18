import React from 'react';
import { Link } from 'react-router-dom';
import * as icon from 'react-icons/bi';

function Sidebar() {
  return (
    <div className="fixed w-60 h-[100%] mt-16 pt-3.5 bg-white">
      <div className="container">
        <button type="button" className="ml-5 w-32 flex items-center gap-5 shadow-lg shadow-gray-200 p-2.5 rounded-xl">
          <icon.BiPlus className="text-2xl" />
          <p className="text-base">New</p>
        </button>
        <div className="grid mt-5">
          <Link to="/" className="flex items-center gap-5 bg-blue-100 py-2.5 px-5 rounded-r-3xl">
            <icon.BiFolder className="text-2xl" />
            <p className="text-base">Dashboard</p>
          </Link>
          <Link to="/star" className="flex items-center gap-5 py-2.5 px-5">
            <icon.BiStar className="text-2xl" />
            <p className="text-base">Star</p>
          </Link>
          <Link to="/trash" className="flex items-center gap-5 py-2.5 px-5">
            <icon.BiTrash className="text-2xl" />
            <p className="text-base">Trash</p>
          </Link>
        </div>
        <div className="border-0 border-t border-solid border-gray-300 mt-5 p-5">
          <span className="flex items-center gap-5">
            <icon.BiCloud className="text-2xl" />
            <p className="text-base">Storage</p>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
