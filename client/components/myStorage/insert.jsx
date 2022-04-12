import React from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import * as icon from 'react-icons/bi';
import { totalSize } from '../../redux/features/document';
import * as helper from '../../helpers';

function Insert({
  setModal,
  location,
  handleGetDocs,
  currentFolder,
  position,
}) {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const handleUploadFile = async (event) => {
    try {
      const fd = new FormData();

      fd.append('file', event.target.files[0]);
      fd.append('location', location);
      fd.append('parents', currentFolder ? [...currentFolder.parents, currentFolder._id] : []);
      fd.append('path', currentFolder ? [...currentFolder.path] : ['/']);

      await axios({
        method: 'post',
        url: 'http://localhost:5050/api/in/documents',
        data: fd,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      handleGetDocs();
      dispatch(totalSize(await helper.totalSize({ trashed: false })));

      setTimeout(() => {
        setModal((prev) => ({
          ...prev,
          insert: false,
        }));
      }, 500);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  return (
    <div
      className="absolute top-0 w-60 left-0 bg-white shadow-lg shadow-gray-300 z-10 translate-y-12"
      style={{
        transform: `translate(${position}px, 54px)`,
      }}
    >
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
        <span className="block w-full h-px bg-gray-300 my-2.5"></span>
        <form method="post" encType="multipart/form-data">
          <label
            htmlFor="file"
            className="flex items-center gap-5 py-2 px-3.5 hover:bg-gray-100 cursor-pointer"
          >
            <icon.BiUpload className="text-2xl" />
            <p className="text-base">Upload File</p>
            <input
              type="file"
              name="file"
              id="file"
              onChange={handleUploadFile}
              className="hidden"
            />
          </label>
          <label
            htmlFor="folder"
            className="flex items-center gap-5 py-2 px-3.5 hover:bg-gray-100 cursor-pointer"
          >
            <icon.BiFolder className="text-2xl" />
            <p className="text-base">Upload Folder</p>
            <input
              type="file"
              name="folder"
              id="folder"
              webkitdirectory="true"
              directory="true"
              className="hidden"
              onChange={(event) => console.log(event)}
            />
          </label>
        </form>
      </div>
    </div>
  );
}

export default Insert;
