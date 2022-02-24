import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as icon from 'react-icons/bi';

import * as comp0 from '../components';
import * as comp1 from '../components/dashboard';

function Home() {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selected, setSelected] = useState([]);

  const [modal, setModal] = useState({
    insert: false,
    newFolder: false,
  });

  const handleGetDocs = async () => {
    try {
      const request = await axios.get('/documents');
      const { data } = request;

      if (!data.success) throw data;

      setDocuments(data.payload);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  const handleGetFolders = async () => {
    try {
      const request = await axios.get('/folders', {
        params: {
          location: '/',
        },
      });

      const { data } = request;
      if (!data.success) throw data;

      setFolders(data.payload);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    document.title = 'Storage - Home';
    handleGetDocs();
    handleGetFolders();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <comp0.navbar />
      <comp0.sidebar />
      {
        modal.newFolder && (
          <comp0.newFolder
            setModal={setModal}
            handleGetFolders={handleGetFolders}
            location="/"
            folders={null}
          />
        )
      }
      <div className="mt-16 grid gap-5 ml-60 px-5">
        <div className="container bg-white pr-2.5 h-14 relative grid grid-cols-dashboard-header items-center border-0 border-b border-solid border-gray-300">
          {
            modal.insert && <comp1.insert setModal={setModal} />
          }
          <div className="flex items-center">
            <button
              type="button"
              className="flex items-center gap-1 py-1 pl-2.5 pr-1 rounded-xl hover:bg-gray-100"
              onClick={() => {
                setModal((prev) => ({
                  ...prev,
                  insert: !prev.insert,
                }));
              }}
            >
              <h3 className="text-xl">/</h3>
              <icon.BiChevronDown className="text-2xl" />
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            {
              selected.length > 0 && (
                <div className="flex items pr-2.5 border-0 border-r border-solid border-gray-300">
                  <button
                    type="button"
                    className="p-2.5 hover:bg-gray-100 rounded-[50%]"
                  >
                    <icon.BiEdit className="text-2xl" />
                  </button>
                  <button
                    type="button"
                    className="p-2.5 hover:bg-gray-100 rounded-[50%]"
                  >
                    <icon.BiTrash className="text-2xl" />
                  </button>
                </div>
              )
            }
            <button
              type="button"
              className="p-2.5 hover:bg-gray-100 rounded-[50%]"
            >
              <icon.BiInfoCircle className="text-2xl" />
            </button>
          </div>
        </div>
        <comp1.table
          documents={documents}
          folders={folders}
          location="/"
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}

export default Home;
