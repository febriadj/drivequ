import React, { useState } from 'react';
import axios from 'axios';
import * as icon from 'react-icons/bi';

function NewFolder({
  setModal,
  handleGetFolders,
  detail,
  location,
}) {
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    name: '',
    description: '',
    privated: false,
  });

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      const { data } = await axios.post('/folders', {
        name: form.name,
        privated: form.privated,
        description: form.description,
        location: detail ? [...detail.location, location] : ['/'],
        path: detail ? [...detail.path, form.name] : ['/', form.name],
        parents: detail ? [...detail.parents, detail._id] : [],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      console.error(error0.response.data.message);
    }
  };

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="fixed w-full h-full z-50 bg-gray-700/50 flex justify-center items-center">
      <div className="w-[500px] p-5 bg-white rounded-lg">
        <div className="flex items-center gap-3.5">
          <icon.BiFolderPlus className="text-2xl" />
          <h2 className="text-xl font-semibold">New Folder</h2>
        </div>
        <form method="post" className="grid gap-2.5 mt-5" onSubmit={handleSubmit}>
          <span className="grid grid-cols-2/1fr-auto items-end gap-2.5 border-0 border-b border-solid border-gray-300">
            <input
              type="text"
              name="name"
              id="name"
              className="w-full py-2.5"
              required
              placeholder="Folder name"
              onChange={handleChange}
            />
            <button
              type="button"
              name="privated"
              className="flex items-center gap-2.5 bg-gray-100 py-1.5 px-2.5 rounded-lg my-1.5 hover:bg-gray-200"
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  privated: !prev.privated,
                }));
              }}
            >
              { form.privated ? <icon.BiLock /> : <icon.BiGlobe /> }
              <p>{form.privated ? 'Private' : 'Public'}</p>
            </button>
          </span>
          <textarea
            name="description"
            id="description"
            className="w-full h-24 resize-none"
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
