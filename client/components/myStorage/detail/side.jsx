import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as icon from 'react-icons/bi';
import * as helper from '../../../helpers';

function Side({ selected, setDetailSideIsOpen, trashedRequest }) {
  const [doc, setDoc] = useState(null);

  const handleGetDoc = async () => {
    try {
      let request;
      const { types, payload } = selected;

      if (types[types.length - 1] === 'file') {
        const { data } = await axios('/documents', {
          params: {
            id: payload[payload.length - 1],
            trashed: trashedRequest ?? false,
          },
        });

        request = data.payload;
      } else {
        const { data } = await axios('/folders', {
          params: {
            id: payload[payload.length - 1],
          },
        });

        request = data.payload;
      }

      setDoc(request);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    if (selected.payload.length > 0) handleGetDoc();
  }, [selected]);

  return (
    <div className="absolute flex w-full h-full border-0 border-l border-solid border-gray-300 overflow-y-scroll">
      <div className="w-full p-5">
        <div className="grid grid-cols-2/1fr-auto items-center gap-5">
          {
            doc && doc.type === 'file' ? (
              <h1 className="text-2xl font-semibold truncate">{doc && `${doc.filename}.${doc.format}`}</h1>
            ) : (
              <h1 className="text-2xl font-semibold truncate">{doc && doc.name}</h1>
            )
          }
          <button
            type="button"
            className="hover:bg-gray-100 rounded-[50%] p-1"
            onClick={() => setDetailSideIsOpen(false)}
          >
            <icon.BiX className="text-2xl" />
          </button>
        </div>
        <div className="mt-5">
          {
            doc && doc.type === 'file' ? (
              /image/i.test(doc.mimetype) ? (
                <div className="relative w-full h-60 flex justify-center items-center bg-black overflow-hidden">
                  <img
                    src={`${axios.defaults.baseURL}/documents/file${doc && doc.url}`}
                    alt=""
                    className="w-full"
                  />
                  <span className="absolute bottom-0 right-0 w-8 h-8 -translate-x-2.5 -translate-y-2.5 rounded-[50%] bg-gray-200 flex justify-center items-center">
                    <icon.BiQuestionMark className="text-xl" />
                  </span>
                </div>
              ) : (
                <iframe
                  title="frame"
                  src={`${axios.defaults.baseURL}/documents/file${doc && doc.url}`}
                  className="w-full h-60 block bg-gray-100 overflow-hidden"
                >
                </iframe>
              )
            ) : (
              <span className="w-full h-60 bg-gray-100 flex justify-center items-center">
                <icon.BiFolder className="text-6xl" />
              </span>
            )
          }
        </div>
        {
          doc && doc.type === 'file' && (
            <div className="grid gap-5 py-5">
              <div className="flex">
                <span className="flex gap-2.5 items-center bg-gray-100 border-solid border border-gray-400 rounded-xl p-2.5">
                  <icon.BiGlobe className="text-2xl" />
                  <p>{doc.permission}</p>
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">System Property</h2>
                <table className="border-collapse mt-2.5">
                  <tbody>
                    <tr className="grid grid-cols-2/auto-1fr overflow-hidden">
                      <td className="w-24 opacity-70 px-0">Original</td>
                      <td className="truncate px-0">{doc.originalFilename}</td>
                    </tr>
                    <tr className="grid grid-cols-2/auto-1fr overflow-hidden">
                      <td className="w-24 opacity-70 px-0">URL</td>
                      <td className="truncate px-0">{doc.url}</td>
                    </tr>
                    <tr className="grid grid-cols-2/auto-1fr overflow-hidden">
                      <td className="w-24 opacity-70 px-0">Location</td>
                      <td className="truncate px-0">{doc.location}</td>
                    </tr>
                    <tr className="grid grid-cols-2/auto-1fr overflow-hidden">
                      <td className="w-24 opacity-70 px-0">Mimetype</td>
                      <td className="truncate px-0">{doc.mimetype}</td>
                    </tr>
                    <tr className="grid grid-cols-2/auto-1fr overflow-hidden">
                      <td className="w-24 opacity-70 px-0">Size</td>
                      <td className="truncate px-0">{helper.bytesToSize(doc.size)}</td>
                    </tr>
                    <tr className="grid grid-cols-2/auto-1fr overflow-hidden">
                      <td className="w-24 opacity-70 px-0">Pubished</td>
                      <td className="truncate px-0">{helper.formatDate(doc.createdAt)}</td>
                    </tr>
                    <tr className="grid grid-cols-2/auto-1fr overflow-hidden">
                      <td className="w-24 opacity-70 px-0">Updated</td>
                      <td className="truncate px-0">{helper.formatDate(doc.updatedAt)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        }
        {
          doc && doc.type === 'folder' && (
            <div className="grid gap-5 py-5">
              <div className="flex">
                <span className="flex gap-2.5 items-center bg-gray-100 border-solid border border-gray-400 rounded-xl p-2.5">
                  <icon.BiGlobe className="text-2xl" />
                  <p>{doc.permission}</p>
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">System Property</h2>
                <table className="border-collapse mt-2.5">
                  <tbody>
                    <tr className="grid grid-cols-2/auto-1fr overflow-hidden">
                      <td className="w-24 opacity-70 px-0">URL</td>
                      <td className="truncate px-0">{doc.url}</td>
                    </tr>
                    <tr className="grid grid-cols-2/auto-1fr overflow-hidden">
                      <td className="w-24 opacity-70 px-0">Location</td>
                      <td className="truncate px-0 flex">
                        {
                          doc.path.slice(1, doc.path.length - 1).map((item) => (
                            <p>{`/${item}`}</p>
                          ))
                        }
                      </td>
                    </tr>
                    <tr className="grid grid-cols-2/auto-1fr overflow-hidden">
                      <td className="w-24 opacity-70 px-0">Pubished</td>
                      <td className="truncate px-0">{helper.formatDate(doc.createdAt)}</td>
                    </tr>
                    <tr className="grid grid-cols-2/auto-1fr overflow-hidden">
                      <td className="w-24 opacity-70 px-0">Updated</td>
                      <td className="truncate px-0">{helper.formatDate(doc.updatedAt)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <span>
                <h2 className="text-xl font-semibold mb-2.5">Description</h2>
                <p>{doc.description}</p>
              </span>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Side;
