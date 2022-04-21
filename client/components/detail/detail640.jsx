import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as helper from '../../helpers';

function Detail640({
  selected,
  setDetail640IsOpen,
  trashedRequest,
}) {
  const token = localStorage.getItem('token');

  const [doc, setDoc] = useState(null);

  const handleGetDoc = async () => {
    try {
      let request;
      const { types, payload } = selected;

      if (types[types.length - 1] === 'file') {
        const { data } = await axios({
          method: 'GET',
          url: '/api/in/documents',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: payload[payload.length - 1].id,
            trashed: trashedRequest ?? false,
          },
        });

        request = data.payload;
      } else {
        const { data } = await axios({
          method: 'GET',
          url: '/api/in/folders',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: payload[payload.length - 1].id,
            trashed: trashedRequest ?? false,
          },
        });

        request = data.payload;
      }

      setDoc(request);
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  useEffect(() => {
    if (!doc) {
      handleGetDoc();
    }
  }, [doc]);

  return (
    <div className="fixed w-full h-full z-50 bg-gray-700/50 flex justify-center items-center">
      <span
        className="absolute w-full h-full"
        onClick={() => {
          setDetail640IsOpen(false);
        }}
        aria-hidden="true"
      >
      </span>
      <div className="w-full grid grid-cols-2/auto-1fr bg-white gap-5 mx-5 p-5 pb-0 z-10 rounded-lg">
        <div className="grid gap-1.5 opacity-50 pb-5">
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
        {
          doc && (
            <div className="grid overflow-x-auto gap-1 pr-2.5 pb-5">
              <p className="whitespace-nowrap">{doc._id}</p>
              <p className="whitespace-nowrap">{doc.type === 'file' ? `${doc.filename}.${doc.format}` : doc.name}</p>
              <p className="whitespace-nowrap">{doc.type === 'file' ? doc.originalname : '-'}</p>
              <p className="whitespace-nowrap">{doc.url}</p>
              <span className="whitespace-nowrap flex items-center">
                { doc.type === 'file' && doc.path.length > 1 && doc.path.slice(1, doc.path.length).map((item) => <p key={item}>{`/${item}`}</p>) }
                { doc.type === 'folder' && doc.path.length > 2 && doc.path.slice(1, doc.path.length - 1).map((item) => <p key={item}>{`/${item}`}</p>) }
                { doc.type === 'file' && doc.path.length <= 1 && <p>/</p> }
                { doc.type === 'folder' && doc.path.length <= 2 && <p>/</p> }
              </span>
              <p className="whitespace-nowrap">{doc.type === 'file' ? doc.mimetype : '-'}</p>
              <p className="whitespace-nowrap">{doc.type === 'file' ? helper.bytesToSize(doc.size) : '-'}</p>
              <p className="whitespace-nowrap">{helper.formatDate(doc.createdAt)}</p>
              <p className="whitespace-nowrap">{helper.formatDate(doc.updatedAt)}</p>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Detail640;
