import React from 'react';
import { Link } from 'react-router-dom';
import * as icon from 'react-icons/bi';

function Sidebar() {
  return (
    <div className="absolute w-60 h-full bg-white">
      <div className="mt-16 pt-5">
        <div className="container">
          <button type="button" className="ml-5 w-32 flex items-center gap-5">
            <icon.BiPlus className="text-2xl" />
            <p className="text-base">New</p>
          </button>
          <div className="grid mt-5">
            <Link to="/" className="flex items-center gap-5 bg-blue-100 py-2.5 px-5 rounded-r-3xl">
              <icon.BiHomeSmile className="text-2xl" />
              <p className="text-base">My Storage</p>
            </Link>
            <Link to="/trash" className="flex items-center gap-5 py-2.5 px-5">
              <icon.BiTrashAlt className="text-2xl" />
              <p className="text-base">Trash</p>
            </Link>
          </div>
          <div className="border-0 border-t border-solid border-gray-300 mt-5 p-5">
            <span className="flex items-center gap-5">
              <icon.BiDockLeft className="text-2xl" />
              <p className="text-base">Documentation</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
