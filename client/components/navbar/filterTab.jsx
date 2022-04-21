import React from 'react';

function FilterTab() {
  return (
    <div className="bg-white z-10 pt-2.5 pb-5 max-h-80">
      <div className="pr-3.5 grid">
        <span className="border-0 border-b border-solid border-gray-300 grid grid-cols-2/auto-1fr items-center gap-2.5">
          <p className="w-32">Type</p>
          <select
            name=""
            id=""
            className="bg-gray-100 py-1.5 px-2.5 my-1.5 appearance-none"
          >
            <option value="default">Default</option>
            <option value="image">Photo & Image</option>
            <option value="">Music</option>
            <option value="">Video</option>
            <option value="application">Document</option>
            <option value="*">Other</option>
          </select>
        </span>
        <span className="border-0 border-b border-solid border-gray-300 grid grid-cols-2/auto-1fr items-center gap-2.5">
          <p className="w-32">Upload Date</p>
          <input
            type="date"
            name="uploadDate"
            className="bg-gray-100 py-1.5 px-2.5 my-1.5"
          />
        </span>
        <div className="flex justify-end gap-2.5 mt-5">
          <button type="button" className="w-28 rounded-md bg-gray-100 hover:bg-gray-200">Reset</button>
          <button type="button" className="w-28 bg-blue-500 text-white rounded-md py-1.5 px-2.5 hover:bg-blue-600">Browse</button>
        </div>
      </div>
    </div>
  );
}

export default FilterTab;
