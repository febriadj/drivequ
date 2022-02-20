import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import * as icon from 'react-icons/bi';

import * as comp0 from '../components';
import * as comp1 from '../components/dashboard';

function DocInFolder() {
  const location = useLocation();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);

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
          location: location.pathname.replace(/.+?(?=[/])/, ''),
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

  const handleGetFolderDetail = async () => {
    try {
      const request = await axios.get('/folders', {
        params: {
          url: location.pathname.replace(/.+?(?=[/])/, ''),
        },
      });

      const { data } = request;
      if (!data.success) throw data;

      setDetail(data.payload);
      document.title = `Storage - ${data.payload.name}`;
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    handleGetFolderDetail();
    handleGetDocs();
    handleGetFolders();
  }, [location]);

  return (
    <div className="w-full flex flex-col">
      <comp0.navbar />
      <comp0.sidebar />
      {
        modal.newFolder && (
          <comp0.newFolder
            location={location.pathname.replace(/.+?(?=[/])/, '')}
            setModal={setModal}
            handleGetFolders={handleGetFolders}
            detail={detail}
          />
        )
      }
      <div className="mt-16 grid gap-5 ml-60 py-3.5 px-5">
        <div className="container bg-white pr-2.5 flex items-center relative">
          {
            detail && detail.path.map((item, index) => (
              <button
                type="button"
                className="flex items-center gap-1 py-1 pl-2.5 pr-1 rounded-xl hover:bg-gray-100"
                onClick={() => {
                  if (item === detail.path[detail.path.length - 1]) {
                    setModal((prev) => ({
                      ...prev,
                      insert: !prev.insert,
                    }));
                  } else {
                    navigate(item === '/' ? '/' : `/folder${detail.location[index]}`);
                  }
                }}
                key={item}
              >
                <h3 className="text-xl">{item}</h3>
                {
                  item === detail.path[detail.path.length - 1]
                    ? <icon.BiChevronDown className="text-2xl" />
                    : <icon.BiChevronRight className="text-2xl" />
                }
              </button>
            ))
          }
          { modal.insert && <comp1.insert setModal={setModal} /> }
        </div>
        <comp1.table
          documents={documents}
          folders={folders}
          location={location.pathname.replace(/.+?(?=[/])/, '')}
        />
      </div>
    </div>
  );
}

export default DocInFolder;
