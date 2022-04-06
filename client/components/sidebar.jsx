import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import * as icon from 'react-icons/bi';
import * as helper from '../helpers';
import { zipDownloadModal } from '../redux/features/modal';

function Sidebar({ page }) {
  const dispatch = useDispatch();
  const { size } = useSelector((state) => state.document);

  return (
    <div className="absolute w-full h-14 flex border-0 border-t border-solid bg-white border-gray-300 z-10 sm:z-0 sm:left-0 bottom-0 sm:bg-white sm:h-full sm:w-16 sm:block md:w-56">
      <div className="w-full h-full flex px-3.5 sm:px-0">
        <div className="w-full sm:mt-16 sm:pt-5 grid grid-cols-3/auto-1fr-auto items-center md:items-start sm:flex sm:flex-col">
          <div className="flex md:ml-2.5">
            <button type="button" className="flex items-center justify-center gap-2.5 py-2.5 px-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-[50%] md:justify-start md:rounded-3xl md:pl-4 md:pr-5 md:w-full">
              <icon.BiPlus className="text-2xl" />
              <p className="text-base hidden md:block">New</p>
            </button>
          </div>
          <div className="w-full flex justify-center sm:flex-col items-center md:items-start sm:mt-5">
            <Link to="/" className={`flex items-center justify-center gap-5 py-2.5 px-2.5 rounded-[50%] md:justify-start md:rounded-none md:rounded-r-3xl md:px-5 md:w-full ${page === '/' && 'bg-gray-100'}`}>
              <icon.BiHomeSmile className="text-2xl" />
              <p className="text-base hidden md:block">My Storage</p>
            </Link>
            <Link to="/trash" className={`flex items-center justify-center gap-5 py-2.5 px-2.5 rounded-[50%] md:justify-start md:rounded-none md:rounded-r-3xl md:px-5 md:w-full ${page === '/trash' && 'bg-gray-100'}`}>
              <icon.BiTrashAlt className="text-2xl" />
              <p className="text-base hidden md:block">Trash</p>
            </Link>
          </div>
          <div className="md:w-full flex sm:flex-col sm:border-0 sm:border-t sm:border-solid border-gray-300 sm:mt-5 sm:pt-5 md:items-start">
            <div className="grid px-5 mb-2.5">
              <p>Total Storage Used:</p>
              <p className="font-semibold">{helper.bytesToSize(size)}</p>
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-5 py-2.5 px-2.5 rounded-[50%] md:justify-start md:rounded-none md:rounded-r-3xl md:px-5 md:w-full hover:bg-gray-100"
              onClick={async () => {
                dispatch(zipDownloadModal());
                const zip = await helper.zipDownload();
                if (zip) {
                  setTimeout(() => dispatch(zipDownloadModal()), 800);
                }
              }}
            >
              <icon.BiCloudDownload className="text-2xl" />
              <p className="text-base hidden md:block">Export</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
