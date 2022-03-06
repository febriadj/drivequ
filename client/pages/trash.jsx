import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as icon from 'react-icons/bi';

import * as comp0 from '../components';
import * as comp1 from '../components/trash';
import * as detail from '../components/myStorage/detail';

function Trash() {
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState({
    types: [],
    payload: [],
  });

  const [detailSideIsOpen, setDetailSideIsOpen] = useState(false);

  const [modal, setModal] = useState({
    clear: false,
  });

  const handleGetTrashedDocs = async () => {
    try {
      const { data } = await axios.get('/documents', {
        params: {
          trashed: true,
        },
      });

      if (!data.success) throw data;
      setDocuments(data.payload);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    document.title = 'Trash - Cloudipati';
    handleGetTrashedDocs();
  }, []);

  return (
    <div className="absolute w-full h-full flex flex-col">
      <comp0.navbar />
      <comp0.sidebar
        page="/trash"
      />
      {
        modal.clear && (
          <comp1.modalClear
            handleGetTrashedDocs={handleGetTrashedDocs}
            setModal={setModal}
            documents={documents}
          />
        )
      }
      <div className="pt-16 h-full grid grid-rows-2/auto-1fr ml-60 pl-5">
        <div className="relative w-full bg-white pr-5 h-14 grid grid-cols-2/1fr-auto items-center border-0 border-b border-solid border-gray-300">
          <div className="flex items-center" id="path">
            <h2 className="text-xl">Trash Bin</h2>
          </div>
          <div className="flex items-center gap-2.5">
            {
              selected.payload.length > 0 && (
                <div className="flex items pr-2.5 border-0 border-r border-solid border-gray-300">
                  <button
                    type="button"
                    className="p-2.5 hover:bg-gray-100 rounded-[50%]"
                  >
                    <icon.BiMessageSquareEdit className="text-2xl" />
                  </button>
                  <button
                    type="button"
                    className="p-2.5 hover:bg-gray-100 rounded-[50%]"
                  >
                    <icon.BiTrashAlt className="text-2xl" />
                  </button>
                </div>
              )
            }
            <button
              type="button"
              className={`p-2.5 hover:bg-gray-100 rounded-[50%] ${detailSideIsOpen && 'bg-gray-100'}`}
              onClick={() => {
                setDetailSideIsOpen((prev) => !prev);
              }}
            >
              <icon.BiInfoCircle className="text-2xl" />
            </button>
          </div>
        </div>
        <div className="w-full grid grid-cols-2/1fr-auto">
          <div className="relative overflow-y-scroll">
            <div className="absolute w-full flex items-center h-14">
              <span className="w-full h-full flex justify-between items-center bg-gray-100 mt-5 mr-5 px-5 rounded-lg">
                <p>Items in trash will be deleted forever after 7 days</p>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 py-1.5 px-3.5 rounded-md"
                  onClick={() => {
                    setModal((prev) => ({
                      ...prev,
                      clear: !prev.clear,
                    }));
                  }}
                >
                  <p>Clear Storage</p>
                </button>
              </span>
            </div>
            <comp1.table
              documents={documents}
              location="/"
              setSelected={setSelected}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trash;