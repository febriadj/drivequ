import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import * as icon from 'react-icons/bi';
import * as helper from '../helpers';

import baseConfig from '../config';
import { zipDownloadModal } from '../redux/features/modal';
import { totalSize } from '../redux/features/document';

import * as comp0 from '../components';
import * as comp1 from '../components/myStorage';
import * as detail from '../components/detail';

import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';

function DocInFolder() {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const store = useSelector((state) => state);

  const location = useLocation();
  const navigate = useNavigate();

  const [currentFolder, setCurrentFolder] = useState(null);
  const [detailSideIsOpen, setDetailSideIsOpen] = useState(false);
  const [detail640IsOpen, setDetail640IsOpen] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selected, setSelected] = useState({
    types: [],
    payload: [],
  });

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
        params: {
          location: location.pathname.replace(/.+?(?=[/])/, ''),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments(data.payload);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  const handleGetFolders = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: '/api/in/folders',
        params: {
          location: location.pathname.replace(/.+?(?=[/])/, ''),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFolders(data.payload);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  const handleGetCurrentFolder = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: '/api/in/folders',
        params: {
          url: location.pathname.replace(/.+?(?=[/])/, ''),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrentFolder(data.payload);
      document.title = `${data.payload.name} - ${baseConfig.appName}`;
    }
    catch (error0) {
      console.error(error0.message);
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
        ...prev,
        types: [],
        payload: [],
      }));
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  useEffect(() => {
    handleGetCurrentFolder();
    handleGetDocs();
    handleGetFolders();

    setDetailSideIsOpen(false);
    setModal((prev) => ({ ...prev, insert: false }));
    setSelected((prev) => ({
      ...prev, types: [], payload: [],
    }));

    const ctx = document.querySelectorAll('#path button');
    let i = 0;
    while (i < ctx.length) {
      ctx[i].classList.remove('bg-gray-100');
      i += 1;
    }
  }, [location]);

  return (
    <div className="absolute w-full h-full flex flex-col overflow-hidden">
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
        currentFolder={currentFolder}
        location={location.pathname.replace(/.+?(?=[/])/, '')}
      />
      {
        modal.newFolder && (
          <comp0.newFolder
            page="/"
            location={location.pathname.replace(/.+?(?=[/])/, '')}
            setModal={setModal}
            handleGetFolders={handleGetFolders}
            detail={currentFolder}
          />
        )
      }
      <div className="pt-16 h-full grid grid-rows-2/auto-1fr sm:ml-16 md:ml-56 sm:pl-5 pb-14 sm:pb-0">
        <div className="relative w-full bg-white px-2.5 gap-5 sm:pr-5 sm:pl-0 h-14 grid grid-cols-2/1fr-auto items-center border-0 border-b border-solid border-gray-300">
          {
            modal.insert && (
              <comp1.insert
                setModal={setModal}
                location={location.pathname.replace(/.+?(?=[/])/, '')}
                handleGetDocs={handleGetDocs}
                currentFolder={currentFolder}
                position={insertPos}
              />
            )
          }
          <div className="flex items-center pb-2 translate-y-1 scrollbar-thumb-gray-200 scrollbar-thin" id="path">
            {
              currentFolder && currentFolder.path.map((item, index) => (
                <button
                  type="button"
                  className={`
                    flex items-center gap-1 py-1 pl-2.5 pr-1 rounded-lg hover:bg-gray-100
                    ${item === currentFolder.path[currentFolder.path.length - 1] && modal.insert && 'bg-gray-100'}
                  `}
                  onClick={(event) => {
                    if (item === currentFolder.path[currentFolder.path.length - 1]) {
                      const screen = window.screen.width;
                      let pos;
                      const less = event.clientX < (screen / 2);

                      if (screen < 640) {
                        pos = 20;
                      } else if (screen > 640 && screen < 768) {
                        pos = 120;
                      } else {
                        pos = 300;
                      }

                      setInsertPos(event.clientX - (less ? pos : pos + 120));
                      setModal((prev) => ({
                        ...prev, insert: !prev.insert, sidebarInsert: false,
                      }));
                    } else {
                      navigate(item === '/' ? '/' : `/folder${currentFolder.location[index]}`);
                    }
                  }}
                  key={item}
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

                    if (index < currentFolder.path.length - 1) {
                      helper.moveLocation({
                        queries: {
                          location: index === 0 ? '/' : currentFolder.location[index],
                          id: dataTransfer.getData('id'),
                          index: dataTransfer.getData('index'),
                        },
                        actions: {
                          handleGetDocs,
                          handleGetFolders,
                        },
                      });
                    } else {
                      const tr = document.querySelectorAll('#myStorage-table tr')[folders.length + Number(dataTransfer.getData('index'))];
                      tr.classList.remove('opacity-0');
                    }
                  }}
                >
                  <h3 className="text-xl whitespace-nowrap pointer-events-none">{item}</h3>
                  {
                    item === currentFolder.path[currentFolder.path.length - 1]
                      ? <icon.BiChevronDown className="text-2xl pointer-events-none" />
                      : <icon.BiChevronRight className="text-2xl pointer-events-none" />
                  }
                </button>
              ))
            }
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
                    onClick={() => {
                      dispatch(zipDownloadModal());

                      setTimeout(() => {
                        helper.zipDownload(selected.payload.map(({ id }) => id));
                        dispatch(zipDownloadModal());
                      }, 800);
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
            <comp1.table
              documents={documents}
              folders={folders}
              location={location.pathname.replace(/.+?(?=[/])/, '')}
              setSelected={setSelected}
              handleGetFolders={handleGetFolders}
              handleGetDocs={handleGetDocs}
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
              currentFolder={currentFolder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocInFolder;
