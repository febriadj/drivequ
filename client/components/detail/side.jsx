import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import * as icon from 'react-icons/bi';
import * as helper from '../../helpers';
import { zipDownloadModal } from '../../redux/features/modal';

function Side({
  selected,
  setDetailSideIsOpen,
  trashedRequest,
  currentFolder,
}) {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const [doc, setDoc] = useState(null);

  const handleGetDoc = async () => {
    try {
      let request;
      const { types, payload } = selected;

      if (types[types.length - 1] === 'file') {
        const { data } = await axios('/documents', {
          params: {
            id: payload[payload.length - 1].id,
            trashed: trashedRequest ?? false,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        request = data.payload;
      } else {
        const { data } = await axios('/folders', {
          params: {
            id: payload[payload.length - 1].id,
            trashed: trashedRequest ?? false,
          },
          headers: {
            Authorization: `Bearer ${token}`,
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
    (async () => {
      if (selected.payload.length > 0) {
        await handleGetDoc();
      } else {
        setDoc(null);
      }
    })();
  }, [selected]);

  return (
    <div className="absolute flex w-full h-full border-0 border-l border-solid border-gray-300 overflow-y-scroll">
      <div className="w-full p-5">
        <div className="grid grid-cols-2/1fr-auto items-center gap-5">
          {
            selected.payload.length > 0 && doc && doc.type === 'file' && (
              <h1 className="text-2xl font-semibold truncate">{doc && `${doc.filename}.${doc.format}`}</h1>
            )
          }
          {
            selected.payload.length > 0 && doc && doc.type === 'folder' && (
              <h1 className="text-2xl font-semibold truncate">{doc && doc.name}</h1>
            )
          }
          {
            selected.payload.length === 0 && (
              <h1 className="text-2xl font-semibold truncate">{currentFolder ? currentFolder.name : 'My Storage'}</h1>
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
            doc && doc.type === 'file' && /image/i.test(doc.mimetype) && (
              <div className="relative w-full h-60 flex justify-center items-center bg-black overflow-hidden">
                <img
                  src={`${axios.defaults.baseURL}/documents/${doc.userId}/file${doc && doc.url}`}
                  alt=""
                  className="w-full"
                />
              </div>
            )
          }
          {
            doc && doc.type === 'file' && !/image/i.test(doc.mimetype) && (
              <span className="w-full h-60 bg-gray-100 flex justify-center items-center">
                <icon.BiFileBlank className="text-6xl" />
              </span>
            )
          }
          {
            doc && doc.type !== 'file' && (
              <span className="w-full h-60 bg-gray-100 flex justify-center items-center">
                <icon.BiFolder className="text-6xl" />
              </span>
            )
          }
        </div>
        {
          doc && (
            <div className="py-5">
              <div className="flex justify-end mb-5">
                <button
                  type="button"
                  className="bg-blue-500 text-white flex items-center rounded-md overflow-hidden group hover:bg-blue-600"
                  onClick={async () => {
                    dispatch(zipDownloadModal());
                    const zip = await helper.zipDownload([doc._id]);
                    if (zip) {
                      setTimeout(() => dispatch(zipDownloadModal()), 800);
                    }
                  }}
                >
                  <p className="px-2.5">Download</p>
                  <span className="bg-blue-600 px-1 py-1.5 group-hover:bg-blue-700">
                    <icon.BiDownArrowAlt className="text-2xl" />
                  </span>
                </button>
              </div>
              <h1 className="text-xl font-semibold">System Property</h1>
              <div className="grid grid-cols-2/auto-1fr gap-5 pt-2.5">
                <div className="grid gap-1 opacity-50 pb-5">
                  <p>ID</p>
                  <p>Name</p>
                  <p>Original</p>
                  <p>URL</p>
                  <p>Location</p>
                  <p>Mimetype</p>
                  <p>Size</p>
                  <p>Published</p>
                  <p>Updated</p>
                </div>
                <div className="grid overflow-x-auto gap-1 pr-2.5 pb-5 scrollbar-thin scrollbar-thumb-gray-200">
                  <p className="whitespace-nowrap">{doc._id}</p>
                  <p className="whitespace-nowrap">{doc.type === 'file' ? `${doc.filename}.${doc.format}` : doc.name}</p>
                  <p className="whitespace-nowrap">{doc.type === 'file' ? doc.originalname : '-'}</p>
                  <p className="whitespace-nowrap">{doc.url}</p>
                  <span className="whitespace-nowrap flex items-center">
                    {doc.type === 'file' && doc.path.length > 1 && doc.path.slice(1, doc.path.length).map((item) => <p key={item}>{`/${item}`}</p>)}
                    {doc.type === 'folder' && doc.path.length > 2 && doc.path.slice(1, doc.path.length - 1).map((item) => <p key={item}>{`/${item}`}</p>)}
                    {doc.type === 'file' && doc.path.length <= 1 && <p>/</p>}
                    {doc.type === 'folder' && doc.path.length <= 2 && <p>/</p>}
                  </span>
                  <p className="whitespace-nowrap">{doc.type === 'file' ? doc.mimetype : '-'}</p>
                  <p className="whitespace-nowrap">{doc.type === 'file' ? helper.bytesToSize(doc.size) : '-'}</p>
                  <p className="whitespace-nowrap">{helper.formatDate(doc.createdAt)}</p>
                  <p className="whitespace-nowrap">{helper.formatDate(doc.updatedAt)}</p>
                </div>
              </div>
              {
                doc.type === 'folder' && (
                  <div className="pt-5">
                    <h1 className="text-xl font-semibold">Description</h1>
                    <p>{doc.description.length > 0 ? doc.description : '...'}</p>
                  </div>
                )
              }
            </div>
          )
        }
        {
          !doc && (
            <div className="flex flex-col justify-center items-center gap-5 overflow-hidden bg-gray-100 w-full h-60">
              <icon.BiFolderOpen className="text-6xl opacity-50" />
              <p className="truncate">Select a file or folder to view details</p>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Side;
