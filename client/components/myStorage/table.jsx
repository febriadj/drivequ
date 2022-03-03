import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as icon from 'react-icons/bi';
import * as helper from '../../helpers';

function Table({
  documents,
  folders,
  setSelected,
}) {
  const navigate = useNavigate();

  return (
    <div className="absolute w-full flex">
      <table className="w-full border-collapse mr-5">
        <thead>
          <tr className="py-2.5 grid grid-cols-4/1fr-0.5fr-0.5fr-0.5fr border-0 border-b border-solid border-gray-300">
            <td>Name</td>
            <td>Mimetype</td>
            <td>Published</td>
            <td>Size</td>
          </tr>
        </thead>
        <tbody>
          {
            folders.map((item) => (
              <tr
                key={item._id}
                className="py-2.5 grid grid-cols-4/1fr-0.5fr-0.5fr-0.5fr items-center border-0 border-b border-solid border-gray-300 cursor-default"
                onDoubleClick={() => navigate(`/folder${item.url}`)}
                onClick={(event) => {
                  setSelected([{ id: item._id, type: 'folder' }]);
                  const e = event.currentTarget;

                  const tr = [...document.getElementsByTagName('tr')];
                  tr.map((item1) => item1.classList.remove('bg-gray-100'));

                  e.classList.add('bg-gray-100');
                }}
              >
                <td className="flex items-center gap-3.5">
                  <icon.BiFolder className="text-2xl" />
                  <p className="text-base">{item.name}</p>
                </td>
                <td><span className="block w-3 h-px bg-black"></span></td>
                <td>{helper.formatDate(item.createdAt)}</td>
                <td><span className="block w-3 h-px bg-black"></span></td>
              </tr>
            ))
          }
          {
            documents.map((item) => (
              <tr
                key={item._id}
                className="py-2.5 grid grid-cols-4/1fr-0.5fr-0.5fr-0.5fr border-0 border-b border-solid border-gray-300 cursor-default"
                onClick={(event) => {
                  setSelected([{ id: item._id, type: 'file' }]);
                  const e = event.currentTarget;

                  const tr = [...document.getElementsByTagName('tr')];
                  tr.map((item1) => item1.classList.remove('bg-gray-100'));

                  e.classList.add('bg-gray-100');
                }}
              >
                <td className="grid grid-cols-2/auto-1fr items-center gap-3.5 overflow-x-hidden">
                  <icon.BiFileBlank className="text-2xl" />
                  <p className="truncate">{`${item.filename}.${item.format}`}</p>
                </td>
                <td className="truncate">{item.mimetype}</td>
                <td className="truncate">{helper.formatDate(item.createdAt)}</td>
                <td className="truncate">{helper.bytesToSize(item.size)}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default Table;
