import React from 'react';
import * as icon from 'react-icons/bi';

function Insert({ setModal }) {
  return (
    <div className="absolute top-0 w-60 left-0 bg-white shadow-lg shadow-gray-300 translate-y-10">
      <div className="container py-3.5 grid">
        <button
          type="button"
          className="flex items-center gap-5 py-2 px-3.5 hover:bg-gray-100"
          onClick={() => {
            setModal((prev) => ({
              ...prev,
              insert: !prev.insert,
              newFolder: !prev.newFolder,
            }));
          }}
        >
          <icon.BiFolderPlus className="text-2xl" />
          <p className="text-base">New Folder</p>
        </button>
        <button
          type="button"
          className="flex items-center gap-5 py-2 px-3.5 hover:bg-gray-100"
        >
          <icon.BiFolder className="text-2xl" />
          <p className="text-base">Upload File</p>
        </button>
        <button
          type="button"
          className="flex items-center gap-5 py-2 px-3.5 hover:bg-gray-100"
        >
          <icon.BiFile className="text-2xl" />
          <p className="text-base">Upload Folder</p>
        </button>
      </div>
    </div>
  );
}

export default Insert;
