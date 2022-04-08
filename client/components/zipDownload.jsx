import React from 'react';
import * as icon from 'react-icons/bi';

function ZipDownload() {
  return (
    <div className="fixed bottom-0 right-0 bg-white z-20 w-72 -translate-x-10 -translate-y-5 rounded-md overflow-hidden shadow-xl shadow-gray-200">
      <div className="bg-gray-700 text-white py-1.5 px-5">
        <p className="opacity-90">Preparing to Download</p>
      </div>
      <div className="grid grid-cols-3/auto-1fr-auto gap-2.5 items-center p-5">
        <icon.BiFile className="text-xl" />
        <p>Creating 1 .zip file</p>
        <icon.BiRadioCircleMarked className="text-xl" />
      </div>
    </div>
  );
}

export default ZipDownload;
