import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import * as icon from 'react-icons/bi';
import { totalSize } from '../../redux/features/document';
import * as helper from '../../helpers';

function Insert({
  page,
  setModal,
  location,
  handleGetDocs,
  currentFolder,
}) {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const handleUploadFile = async (event) => {
    try {
      const fd = new FormData();

      for (let i = 0; i < event.target.files.length; i += 1) {
        fd.append('file', event.target.files[i]);
      }
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

      if (page === '/trash') {
        setTimeout(() => {
          setModal((prev) => ({
            ...prev, insert: false, sidebarInsert: false,
          }));
        }, 200);

        setTimeout(async () => {
          dispatch(totalSize(await helper.totalSize({ trashed: false })));
          navigate('/');
        }, 500);
      } else {
        handleGetDocs();
        dispatch(totalSize(await helper.totalSize({ trashed: false })));

        setTimeout(() => {
          setModal((prev) => ({
            ...prev, insert: false, sidebarInsert: false,
          }));
        }, 500);
      }
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  return (
    <div className="absolute top-0 -translate-y-44 w-60 bg-white shadow-lg shadow-gray-300 z-10 sm:translate-y-12 sm:translate-x-5">
      <div className="container py-3.5 grid">
        <button
          type="button"
          className="flex items-center gap-5 py-2 px-3.5 hover:bg-gray-100"
          onClick={() => {
            setModal((prev) => ({
              ...prev,
              insert: false,
              sidebarInsert: false,
              newFolder: true,
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
              multiple
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
