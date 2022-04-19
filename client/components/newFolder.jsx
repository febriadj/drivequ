import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as icon from 'react-icons/bi';

function NewFolder({
  page,
  setModal,
  handleGetFolders,
  detail,
  location,
}) {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [response, setResponse] = useState({
    success: true,
    message: '',
  });

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      await axios.post('/api/in/folders', {
        name: form.name,
        description: form.description,
        location: detail ? location : '/',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm((prev) => ({ ...prev, name: '', description: '' }));
      setResponse((prev) => ({ ...prev, success: true, message: '' }));

      if (page === '/trash') {
        setTimeout(() => {
          setModal((prev) => ({
            ...prev, newFolder: false,
          }));
        }, 200);
        setTimeout(() => navigate('/'), 500);
      } else {
        handleGetFolders();
        setTimeout(() => {
          setModal((prev) => ({
            ...prev, newFolder: false,
          }));
        }, 500);
      }
    }
    catch (error0) {
      setResponse((prev) => ({
        ...prev,
        success: false,
        message: error0.response.data.message,
      }));
    }
  };

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="fixed w-full h-full z-40 bg-gray-700/50 flex justify-center items-center">
      <div className="w-[500px] p-5 bg-white rounded-lg mx-5">
        <div className="flex items-center gap-3.5">
          <icon.BiFolderPlus className="text-2xl" />
          <h2 className="text-xl font-semibold">New Folder</h2>
        </div>
        <form method="post" className="grid mt-2.5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            id="name"
            className="w-full py-2.5 border-0 border-b border-solid border-gray-300"
            required
            placeholder="Folder name"
            onChange={handleChange}
          />
          <p className={`text-sm mt-1 ${response.success ? 'text-black' : 'text-red-900'}`}>{response.message}</p>
          <textarea
            name="description"
            id="description"
            className="w-full h-24 resize-none my-2.5"
            placeholder="Description"
            onChange={handleChange}
          >
          </textarea>
          <span className="flex justify-end gap-2.5">
            <button
              type="button"
              className="hover:bg-gray-100 p-2.5 rounded-md w-20"
              onClick={() => {
                setModal((prev) => ({
                  ...prev,
                  newFolder: !prev.newFolder,
                }));
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 p-2.5 rounded-md w-20 text-white"
            >
              Add
            </button>
          </span>
        </form>
      </div>
    </div>
  );
}

export default NewFolder;
