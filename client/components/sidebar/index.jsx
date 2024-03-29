import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as icon from 'react-icons/bi';

import * as helper from '../../helpers';
import { exportModal } from '../../redux/features/modal';
import config from '../../config';

import Insert from './insert';

function Sidebar({
  page,
  setModal,
  modal,
  handleGetDocs,
  currentFolder,
  location,
}) {
  const dispatch = useDispatch();
  const { size } = useSelector((state) => state.document);

  return (
    <div className="absolute w-full h-16 flex border-0 border-t border-solid bg-white border-gray-300 z-20 sm:left-0 bottom-0 sm:bg-white sm:h-full sm:w-16 sm:block md:w-56">
      <div className="w-full h-full flex px-3.5 sm:px-0">
        <div className="w-full sm:mt-16 sm:pt-5 grid grid-cols-3/auto-1fr-auto items-center md:items-start sm:flex sm:flex-col">
          <div className="relative flex md:ml-2.5">
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 py-2.5 px-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-[50%] md:justify-start md:rounded-3xl md:pl-4 md:pr-5 md:w-full"
              onClick={() => {
                setModal((prev) => ({
                  ...prev,
                  insert: false,
                  sidebarInsert: !prev.sidebarInsert,
                  newFolder: false,
                }));
              }}
            >
              <icon.BiPlus className="text-2xl" />
              <p className="font-bold hidden md:block">New</p>
            </button>
            {
              modal.sidebarInsert && (
                <Insert
                  page={page}
                  setModal={setModal}
                  location={location}
                  handleGetDocs={handleGetDocs}
                  currentFolder={currentFolder}
                />
              )
            }
          </div>
          <div className="w-full flex gap-1 justify-center sm:flex-col items-center md:items-start sm:mt-5">
            <Link to="/" className={`${page === '/' ? 'bg-gray-100' : 'hover:bg-gray-50'} flex items-center justify-center gap-5 py-2.5 px-2.5 rounded-[50%] md:justify-start md:rounded-none md:rounded-r-3xl md:px-5 md:w-full`}>
              <icon.BiHomeSmile className="text-2xl" />
              <p className="hidden md:block">My Storage</p>
            </Link>
            <Link to="/trash" className={`${page === '/trash' ? 'bg-gray-100' : 'hover:bg-gray-50'} flex items-center justify-center gap-5 py-2.5 px-2.5 rounded-[50%] md:justify-start md:rounded-none md:rounded-r-3xl md:px-5 md:w-full`}>
              <icon.BiTrashAlt className="text-2xl" />
              <p className="hidden md:block">Trash</p>
            </Link>
          </div>
          <div className="md:w-full grid sm:border-0 sm:border-t sm:border-solid border-gray-300 sm:mt-5 sm:pt-5 md:items-start">
            <div className="hidden w-full md:grid md:px-5 md:mb-5">
              <p>Storage Used:</p>
              <span className="my-3 bg-gray-100 w-full h-2 flex rounded-md overflow-hidden">
                <span
                  className="block bg-blue-600 h-full rounded-md"
                  style={{
                    width: `${((size / config.maxStorage) * 1.0) * 100}%`,
                  }}
                >
                </span>
              </span>
              <p className="text-sm">{`${helper.bytesToSize(size)} of ${helper.bytesToSize(config.maxStorage)}`}</p>
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-5 py-2.5 px-2.5 rounded-[50%] md:justify-start md:rounded-none md:rounded-r-3xl md:px-5 md:w-full hover:bg-gray-100"
              onClick={() => {
                dispatch(exportModal());
              }}
            >
              <icon.BiCloud className="text-2xl" />
              <p className="text-base hidden md:block">Export</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
