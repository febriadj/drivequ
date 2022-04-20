import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import * as icon from 'react-icons/bi';
import * as helper from '../helpers';

import { zipDownloadModal } from '../redux/features/modal';
import { totalSize } from '../redux/features/document';

import * as comp0 from '../components';
import * as comp1 from '../components/myStorage';

import * as detail from '../components/detail';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';

function Home() {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const store = useSelector((state) => state);

  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selected, setSelected] = useState({
    types: [],
    payload: [],
  });

  const [detailSideIsOpen, setDetailSideIsOpen] = useState(false);
  const [detail640IsOpen, setDetail640IsOpen] = useState(false);

  const [modal, setModal] = useState({
    insert: false,
    sidebarInsert: false,
    newFolder: false,
  });

  const [insertPos, setInsertPos] = useState(0);

  const handleGetDocs = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: '/api/in/documents',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          location: '/',
        },
      });

      setDocuments(data.payload);
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  const handleGetFolders = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: '/api/in/folders',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { location: '/' },
      });

      setFolders(data.payload);
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  const handleTrashing = async () => {
    try {
      await axios({
        method: 'POST',
        url: '/api/in/trash',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: selected.payload.map(({ id }) => id),
      });

      dispatch(totalSize(await helper.totalSize({ trashed: false })));
      handleGetDocs();
      handleGetFolders();

      setSelected((prev) => ({
        ...prev, types: [], payload: [],
      }));
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  useEffect(() => {
    document.title = 'My Storage - Storager';
    handleGetDocs();
    handleGetFolders();

    const ctx = document.querySelectorAll('#path button');
    let i = 0;
    while (i < ctx.length) {
      ctx[i].classList.remove('bg-gray-100');
      i += 1;
    }
  }, []);

  return (
    <div className="absolute w-full h-full flex flex-col">
      {
        window.screen.width < 640 && detail640IsOpen && (
          <detail.detail640
            selected={selected}
            setDetail640IsOpen={setDetail640IsOpen}
          />
        )
      }
      { store.modal.logoutIsOpen && <comp0.logout /> }
      { store.modal.zipDownloadIsOpen && <comp0.zipDownload /> }
      { store.modal.exportIsOpen && <comp0.exportModal /> }

      <Navbar />
      <Sidebar
        page="/"
        setModal={setModal}
        modal={modal}
        handleGetDocs={handleGetDocs}
        currentFolder={null}
        location="/"
      />
      {
        modal.newFolder && (
          <comp0.newFolder
            page="/"
            setModal={setModal}
            handleGetFolders={handleGetFolders}
            location="/"
            folders={null}
          />
        )
      }
      <div className="pt-16 h-full grid grid-rows-2/auto-1fr sm:ml-16 md:ml-56 sm:pl-5 pb-14 sm:pb-0">
        <div className="relative w-full bg-white px-2.5 sm:pr-5 sm:pl-0 h-14 grid grid-cols-2/1fr-auto items-center border-0 border-b border-solid border-gray-300">
          {
            modal.insert && (
              <comp1.insert
                setModal={setModal}
                location="/"
                handleGetDocs={handleGetDocs}
                currentFolder={null}
                position={insertPos}
              />
            )
          }
          <div className="flex items-center scrollbar scrollbar-thumb-gray-300" id="path">
            <button
              type="button"
              className={`flex items-center gap-1 py-1 pl-2.5 pr-1 rounded-lg hover:bg-gray-100 ${modal.insert && 'bg-gray-100'}`}
              onClick={(event) => {
                const screen = window.screen.width;
                let pos;

                if (screen < 640) {
                  pos = 20;
                } else if (screen > 640 && screen < 768) {
                  pos = 90;
                } else {
                  pos = 234;
                }

                setInsertPos(event.clientX - pos);
                setModal((prev) => ({
                  ...prev, insert: !prev.insert, sidebarInsert: false,
                }));
              }}
            >
              <h3 className="text-xl">/</h3>
              <icon.BiChevronDown className="text-2xl" />
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            {
              selected.payload.length > 0 && (
                <div className="flex items pr-2.5 border-0 border-r border-solid border-gray-300">
                  {
                    selected.types[selected.types.length - 1] === 'folder' ? (
                      <Link
                        to={`/folder${selected.payload[selected.payload.length - 1].url}`}
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-[50%]"
                      >
                        <icon.BiLinkExternal className="text-2xl" />
                      </Link>
                    ) : (
                      <a
                        target="blank"
                        href={`${axios.defaults.baseURL}${selected.payload[selected.payload.length - 1].url}`}
                        className="p-2 hover:bg-gray-100 rounded-[50%]"
                      >
                        <icon.BiLinkExternal className="text-2xl" />
                      </a>
                    )
                  }
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-[50%]"
                    onClick={async () => {
                      dispatch(zipDownloadModal());
                      const zip = await helper.zipDownload(selected.payload.map(({ id }) => id));
                      if (zip) {
                        setTimeout(() => dispatch(zipDownloadModal()), 800);
                      }
                    }}
                  >
                    <icon.BiDownload className="text-2xl" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-[50%]"
                    onClick={handleTrashing}
                  >
                    <icon.BiTrashAlt className="text-2xl" />
                  </button>
                </div>
              )
            }
            <button
              type="button"
              className={`p-2 hover:bg-gray-100 rounded-[50%] ${(detailSideIsOpen || detail640IsOpen) && 'bg-gray-100'}`}
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
            <comp1.table
              documents={documents}
              folders={folders}
              location="/"
              setSelected={setSelected}
              handleGetDocs={handleGetDocs}
              handleGetFolders={handleGetFolders}
            />
          </div>
          <div className={`
            relative overflow-hidden transition-all flex
            ${detailSideIsOpen ? 'w-96' : 'w-0'}
          `}
          >
            <detail.side
              setDetailSideIsOpen={setDetailSideIsOpen}
              selected={selected}
              setSelected={setSelected}
              currentFolder={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
