import React from 'react';
import axios from 'axios';

function ModalClear({
  handleGetTrashedDocs,
  setModal,
  documents,
}) {
  const token = localStorage.getItem('token');

  const handleClearTrash = async () => {
    try {
      let arr = [];
      arr = documents.map((item) => item._id);

      const { data } = await axios({
        url: '/trash',
        method: 'delete',
        data: arr,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data.success) throw data;
      handleGetTrashedDocs();

      setTimeout(() => {
        setModal((prev) => ({
          ...prev, clear: false,
        }));
      }, 1000);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  return (
    <div className="fixed w-full h-full z-50 bg-gray-700/50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-[500px]">
        <h2 className="text-xl font-semibold">Delete Forever</h2>
        <p className="text-base mt-2.5 mb-8">All junk items will be deleted forever and you will not be able to recover them, are you sure and want to continue?</p>
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
            className="py-1.5 px-3.5 bg-gray-200 hover:bg-gray-300 rounded-md"
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
