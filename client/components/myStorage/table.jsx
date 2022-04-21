import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as icon from 'react-icons/bi';
import * as helper from '../../helpers';

function Table({
  documents,
  folders,
  setSelected,
  handleGetDocs,
  handleGetFolders,
}) {
  const navigate = useNavigate();

  const handleOnSelection = (event, item) => {
    const e = event.currentTarget;
    const tr = [...document.getElementsByTagName('tr')];

    if (event.ctrlKey) {
      setSelected((prev) => {
        const exists = prev.payload.find((item1) => item1 === item.id);
        const indexOfItem = prev.payload.indexOf(exists);

        if (exists) {
          const filter = prev.payload.filter((item2) => item2 !== item.id);
          const newTypes = prev.types.filter((item1, index) => index !== indexOfItem);
          e.classList.remove('bg-gray-100');
          return {
            types: [...newTypes],
            payload: [...filter],
          };
        }

        e.classList.add('bg-gray-100');
        return {
          types: [...prev.types, item.type],
          payload: [...prev.payload, { id: item.id, url: item.url }],
        };
      });
    } else {
      setSelected((prev) => ({
        ...prev,
        types: [item.type],
        payload: [{ id: item.id, url: item.url }],
      }));

      tr.map((item1) => item1.classList.remove('bg-gray-100'));
      e.classList.add('bg-gray-100');
    }
  };

  const clearSelection = () => {
    setSelected((prev) => ({
      ...prev, types: [], payload: [],
    }));

    const tags = [...document.querySelectorAll('#myStorage-table tr')];
    tags.map((tr) => tr.classList.remove('bg-gray-100'));
  };

  return (
    < >
      <span
        aria-hidden="true"
        className="absolute w-full h-full"
        onClick={clearSelection}
      >
      </span>
      <div className="absolute w-full flex" id="myStorage-table">
        <table className="w-full border-collapse md:mr-5">
          <thead>
            <tr
              className="h-12 px-1.5 sm:px-0 grid sm:grid-cols-2/1fr-0.3fr md:grid-cols-4/1fr-0.5fr-0.5fr-0.5fr items-center border-0 border-b border-solid border-gray-300"
              onClick={clearSelection}
            >
              <td className="font-semibold">Name</td>
              <td className="hidden md:block font-semibold">Mimetype</td>
              <td className="hidden md:block font-semibold">Published</td>
              <td className="hidden sm:block font-semibold">Size</td>
            </tr>
          </thead>
          <tbody>
            {
              folders.map((item) => (
                <tr
                  key={item._id}
                  className="transition-all overflow-hidden h-12 px-1.5 sm:px-0 grid sm:grid-cols-2/1fr-0.3fr md:grid-cols-4/1fr-0.5fr-0.5fr-0.5fr items-center border-0 border-b border-solid border-gray-300 cursor-default"
                  onDoubleClick={() => navigate(`/folder${item.url}`)}
                  onClick={(event) => {
                    handleOnSelection(event, {
                      id: item._id,
                      type: item.type,
                      url: item.url,
                    });
                  }}
                  onDragEnter={(event) => {
                    event.currentTarget.classList.add('bg-gray-100');
                  }}
                  onDragLeave={(event) => {
                    event.currentTarget.classList.remove('bg-gray-100');
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    event.currentTarget.classList.remove('bg-gray-100');

                    const { dataTransfer } = event;

                    helper.moveLocation({
                      queries: {
                        location: item.url,
                        id: dataTransfer.getData('id'),
                        index: dataTransfer.getData('index'),
                      },
                      actions: {
                        handleGetDocs,
                        handleGetFolders,
                      },
                    });
                  }}
                >
                  <td className="flex items-center gap-3.5 overflow-x-hidden pointer-events-none">
                    <icon.BiFolder className="text-2xl" />
                    <p className="text-base truncate">{item.name}</p>
                  </td>
                  <td className="hidden md:block pointer-events-none"><span className="block w-3 h-px bg-black"></span></td>
                  <td className="hidden md:block truncate pointer-events-none">{helper.formatDate(item.createdAt)}</td>
                  <td className="hidden sm:block pointer-events-none"><span className="block w-3 h-px bg-black"></span></td>
                </tr>
              ))
            }
            {
              documents.map((item, i) => (
                <tr
                  key={item._id}
                  className="transition-all overflow-hidden h-12 px-1.5 sm:px-0 grid sm:grid-cols-2/1fr-0.3fr md:grid-cols-4/1fr-0.5fr-0.5fr-0.5fr items-center border-0 border-b border-solid border-gray-300 cursor-default"
                  onDoubleClick={() => {
                    const a = document.createElement('a');
                    a.target = 'blank';
                    a.href = `${axios.defaults.baseURL}${item.url}`;

                    a.click();
                    a.remove();
                  }}
                  onClick={(event) => {
                    handleOnSelection(event, {
                      id: item._id,
                      type: item.type,
                      url: item.url,
                    });
                  }}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('id', item._id);
                    event.dataTransfer.setData('index', folders.length + (i + 1));
                  }}
                  onDrag={(event) => {
                    event.currentTarget.classList.add('opacity-0');
                    event.currentTarget.classList.add('pointer-events-none');
                  }}
                  onDragEnd={(event) => {
                    event.currentTarget.classList.remove('pointer-events-none');

                    if (event.dataTransfer.dropEffect === 'none') {
                      event.currentTarget.classList.remove('opacity-0');
                    }
                  }}
                >
                  <td className="grid grid-cols-2/auto-1fr items-center gap-3.5 overflow-x-hidden pointer-events-none">
                    {
                      /image/.test(item.mimetype) ? (
                        <span className="relative w-6 h-6 overflow-hidden flex justify-center items-center bg-gray-800">
                          <img
                            src={`${axios.defaults.baseURL}${item.url}`}
                            alt=""
                            className="w-full h-full"
                          />
                        </span>
                      ) : (
                        <icon.BiFileBlank className="text-2xl" />
                      )
                    }
                    <p className="truncate">{`${item.filename}.${item.format}`}</p>
                  </td>
                  <td className="hidden md:block truncate pointer-events-none">{item.mimetype}</td>
                  <td className="hidden md:block truncate pointer-events-none">{helper.formatDate(item.createdAt)}</td>
                  <td className="hidden sm:block truncate pointer-events-none">{helper.bytesToSize(item.size)}</td>
                </tr>
              ))
            }
            <tr
              className="flex items-center gap-1.5 mt-2.5 px-3.5 sm:px-1 pb-8"
              onClick={clearSelection}
            >
              <td className="bg-gray-100 px-2.5 rounded-md cursor-default hover:bg-gray-200">{`Folder: ${folders.length}`}</td>
              <td className="bg-gray-100 px-2.5 rounded-md cursor-default hover:bg-gray-200">{`File: ${documents.length}`}</td>
              <td
                className="font-semibold"
              >
                {
                  helper.bytesToSize(
                    documents.length > 0 ? (
                      documents.map(({ size }) => size).reduce((acc, curr) => acc + curr)
                    ) : 0,
                  )
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
