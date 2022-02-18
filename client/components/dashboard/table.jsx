import React from 'react';
import * as icon from 'react-icons/bi';
import formatDate from '../../helpers/formatDate';

function Table({ documents }) {
  return (
    <table className="container border-collapse">
      <thead>
        <tr className="py-2.5 grid grid-cols-tableDocs">
          <td>Name</td>
          <td>Permissions</td>
          <td>Mimetype</td>
          <td>Published</td>
        </tr>
      </thead>
      <tbody>
        {
          documents.map((item) => (
            <tr key={item._id} className="py-2.5 grid grid-cols-tableDocs border-0 border-b border-solid border-gray-300">
              <td className="flex items-center gap-3.5">
                <icon.BiFile className="text-2xl" />
                <p className="text-base">{item.filename}</p>
              </td>
              <td>{item.permission}</td>
              <td>{item.mimetype}</td>
              <td>{formatDate(item.createdAt)}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default Table;
