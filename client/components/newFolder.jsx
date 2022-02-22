import React, { useState } from 'react';
import axios from 'axios';

function NewFolder({
  setModal,
  handleGetFolders,
  detail,
  location,
}) {
  const [form, setForm] = useState({
    name: '',
    permission: 'public',
  });

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      const request = await axios.post('/folders', {
        name: form.name,
        permission: form.permission,
        location: detail ? [...detail.location, location] : ['/'],
        path: detail ? [...detail.path, form.name] : ['/', form.name],
      });

      const { data } = request;
      if (!data.success) throw data;

      handleGetFolders();

      setTimeout(() => {
        setModal((prev) => ({
          ...prev,
          newFolder: false,
        }));
      }, 1000);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  return (
    <div className="fixed w-full h-full z-50 bg-gray-500/50 flex justify-center items-center">
      <div className="w-80 shadow-2xl shadow-gray-500/80 p-5 bg-white rounded-xl">
        <h2 className="text-xl font-bold">New Folder</h2>
        <form method="post" className="grid gap-5 mt-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            id="name"
            className="border border-solid border-gray-300 w-full py-2.5 px-5 rounded-xl"
            required
            placeholder="Folder name"
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                name: event.target.value,
              }));
            }}
          />
          <span className="flex justify-end">
            <button
              type="button"
              className="hover:bg-gray-100 p-2.5 rounded-xl w-20"
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
              className="hover:bg-gray-100 p-2.5 rounded-xl w-20 text-blue-700"
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
