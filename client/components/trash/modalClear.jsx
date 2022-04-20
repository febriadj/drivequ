import React from 'react';
import axios from 'axios';
import * as helper from '../../helpers';

function ModalClear({
  handleGetTrashedDocs,
  setModal,
  documents,
  folders,
  setTrashSize,
}) {
  const token = localStorage.getItem('token');

  const handleClearTrash = async () => {
    try {
      const merge = [...folders.map(({ _id }) => _id), ...documents.map(({ _id }) => _id)];

      await axios({
        method: 'DELETE',
        url: '/api/in/trash',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: merge,
      });

      handleGetTrashedDocs();
      setTrashSize(await helper.totalSize({ trashed: true }));

      setTimeout(() => {
        setModal((prev) => ({
          ...prev, clear: false,
        }));
      }, 500);
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  return (
    <div className="fixed w-full h-full z-50 bg-gray-700/50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-[450px] mx-5">
        <h2 className="text-xl font-semibold">Delete Forever</h2>
        <p className="text-base mt-2.5 mb-8">All junk items will be deleted forever and you will not be able to recover them, are you sure & want to continue?</p>
        <span className="flex justify-end gap-2.5">
          <button
            type="button"
            className="py-1.5 px-2.5 hover:bg-gray-100 rounded-md"
            onClick={() => {
              setModal((prev) => ({
                ...prev,
                clear: false,
              }));
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="py-1.5 px-3.5 bg-blue-500 hover:bg-blue-600 rounded-md text-white"
            onClick={handleClearTrash}
          >
            Delete Forever
          </button>
        </span>
      </div>
    </div>
  );
}

export default ModalClear;
