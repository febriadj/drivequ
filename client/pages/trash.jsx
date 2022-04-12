import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as icon from 'react-icons/bi';

import * as helper from '../helpers';
import { totalSize } from '../redux/features/document';

import * as comp0 from '../components';
import * as comp1 from '../components/trash';
import * as detail from '../components/detail';

function Trash() {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const { modal: { logoutIsOpen } } = useSelector((state) => state);

  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [trashSize, setTrashSize] = useState(0);
  const [detail640IsOpen, setDetail640IsOpen] = useState(false);

  const [selected, setSelected] = useState({
    types: [],
    payload: [],
  });

  const [detailSideIsOpen, setDetailSideIsOpen] = useState(false);

  const [modal, setModal] = useState({
    clear: false,
  });

  const handleGetTrashed = async () => {
    try {
      const { data } = await axios.get('/trash', {
        params: {
          trashed: true,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrashSize(await helper.totalSize({ trashed: true }));
      setFolders(data.payload.folders);
      setDocuments(data.payload.documents);
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  const handleDeleteJunkDocs = async () => {
    try {
      const { data } = await axios({
        method: 'delete',
        url: '/trash',
        data: selected.payload.map(({ id }) => id),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data.success) throw data;
      handleGetTrashed();
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  const handleRecovery = async () => {
    try {
      await axios({
        method: 'put',
        url: '/trash/recover',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: selected.payload.map(({ id }) => id),
      });

      setTrashSize(await helper.totalSize({ trashed: true }));
      dispatch(totalSize(await helper.totalSize({ trashed: false })));
      handleGetTrashed();
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  useEffect(() => {
    document.title = 'Trash - CloudSync';
    handleGetTrashed();
  }, []);

  return (
    <div className="absolute w-full h-full flex flex-col">
      {
        window.screen.width < 640 && detail640IsOpen && (
          <detail.detail640
            selected={selected}
            setDetail640IsOpen={setDetail640IsOpen}
            trashedRequest
          />
        )
      }
      { logoutIsOpen && <comp0.logout /> }
      <comp0.navbar />
      <comp0.sidebar
        page="/trash"
      />
      {
        modal.clear && (
          <comp1.modalClear
            handleGetTrashedDocs={handleGetTrashed}
            setModal={setModal}
            documents={documents}
            folders={folders}
            setTrashSize={setTrashSize}
          />
        )
      }
      <div className="pt-16 h-full grid grid-rows-2/auto-1fr sm:ml-16 md:ml-56 sm:pl-5">
        <div className="relative w-full bg-white pl-3.5 sm:pl-0 pr-2.5 sm:pr-5 h-14 grid grid-cols-2/1fr-auto items-center border-0 border-b border-solid border-gray-300">
          <div className="flex items-center" id="path">
            <h2 className="text-xl">Trash Bin</h2>
          </div>
          <div className="flex items-center gap-2.5">
            {
              selected.payload.length > 0 && (
                <div className="flex items pr-2.5 border-0 border-r border-solid border-gray-300">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-[50%]"
                    onClick={handleRecovery}
                  >
                    <icon.BiHistory className="text-2xl" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-[50%]"
                    onClick={handleDeleteJunkDocs}
                  >
                    <icon.BiTrashAlt className="text-2xl" />
                  </button>
                </div>
              )
            }
            <button
              type="button"
              className={`p-2 hover:bg-gray-100 rounded-[50%] ${detailSideIsOpen && 'bg-gray-100'}`}
              onClick={() => {
                if (window.screen.width < 640) {
                  if (selected.payload.length > 0) {
                    setDetail640IsOpen((prev) => !prev);
                  }
                } else {
                  setDetailSideIsOpen((prev) => !prev);
                }
              }}
            >
              <icon.BiInfoCircle className="text-2xl" />
            </button>
          </div>
        </div>
        <div className="w-full grid grid-cols-2/1fr-auto">
          <div className="relative overflow-y-scroll">
            <div className="absolute w-full flex items-center h-14">
              <span className="w-full h-full overflow-x-hidden flex justify-between items-center gap-3.5 bg-gray-100 mt-5 mx-3.5 sm:ml-0 md:mr-5 px-5 rounded-lg">
                <p className="truncate">Items in trash will be deleted forever after 7 days</p>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 py-1.5 px-3.5 rounded-md overflow-hidden"
                  onClick={() => {
                    setModal((prev) => ({
                      ...prev,
                      clear: !prev.clear,
                    }));
                  }}
                >
                  <p className="truncate">Clear Trash</p>
                </button>
              </span>
            </div>
            <comp1.table
              documents={documents}
              folders={folders}
              location="/"
              setSelected={setSelected}
              size={trashSize}
            />
          </div>
          <div className={`
            relative overflow-hidden transition-all
            ${detailSideIsOpen ? 'w-96' : 'w-0'}
          `}
          >
            <detail.side
              setDetailSideIsOpen={setDetailSideIsOpen}
              selected={selected}
              setSelected={setSelected}
              trashedRequest
              currentFolder={{ name: 'Trash' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trash;
