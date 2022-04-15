import React from 'react';
import { useDispatch } from 'react-redux';

import { exportModal, zipDownloadModal } from '../redux/features/modal';
import * as helper from '../helpers';

function ExportModal() {
  const dispatch = useDispatch();

  return (
    <div className="fixed w-full h-full bg-gray-700/50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg w-[450px] mx-5">
        <h2 className="text-xl font-semibold">Storage Export</h2>
        <p className="text-base mt-2.5 mb-8">Exporting storage will download all content, this action will take more time. Still want to continue?</p>
        <span className="flex justify-end gap-2.5">
          <button
            type="button"
            className="py-1.5 px-2.5 hover:bg-gray-100 rounded-md"
            onClick={() => {
              dispatch(exportModal());
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="py-1.5 px-3.5 bg-blue-500 hover:bg-blue-600 rounded-md text-white"
            onClick={async () => {
              dispatch(zipDownloadModal());
              dispatch(exportModal());
              const zip = await helper.zipDownload();

              if (zip) {
                setTimeout(() => {
                  dispatch(zipDownloadModal());
                }, 800);
              }
            }}
          >
            Export
          </button>
        </span>
      </div>
    </div>
  );
}

export default ExportModal;
