import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as icon from 'react-icons/bi';
import formatDate from '../../helpers/formatDate';

function Table({ documents, folders }) {
  const navigate = useNavigate();

  return (
    <table className="container border-collapse">
      <thead>
        <tr className="py-2.5 grid grid-cols-table-docs">
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
              className="py-2.5 grid grid-cols-table-docs items-center border-0 border-b border-solid border-gray-300 cursor-default"
              onClick={() => navigate(`/folder${item.url}`)}
            >
              <td className="flex items-center gap-3.5">
                <icon.BiFolder className="text-2xl" />
                <p className="text-base">{item.name}</p>
              </td>
              <td><span className="block w-3 h-px bg-black"></span></td>
              <td>{formatDate(item.createdAt)}</td>
              <td><span className="block w-3 h-px bg-black"></span></td>
            </tr>
          ))
        }
        {
          documents.map((item) => (
            <tr key={item._id} className="py-2.5 grid grid-cols-table-docs border-0 border-b border-solid border-gray-300 cursor-default">
              <td className="flex items-center gap-3.5">
                <icon.BiFile className="text-2xl" />
                <p className="text-base">{`${item.filename}.${item.format}`}</p>
              </td>
              <td>{item.mimetype}</td>
              <td>{formatDate(item.createdAt)}</td>
              <td>{`${item.size} KB`}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default Table;
