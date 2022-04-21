import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as icon from 'react-icons/bi';
import * as helper from '../../helpers';

function SearchTab({
  setForm,
  form,
  setTab,
}) {
  const token = localStorage.getItem('token');
  const [documents, setDocuments] = useState([]);

  const handleGetDocs = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: '/api/in/documents',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          filename: form.filename,
        },
      });

      setDocuments(data.payload);
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  useEffect(() => {
    if (form.filename.length >= 3) {
      handleGetDocs();
    } else {
      setDocuments([]);
    }
  }, [form.filename]);

  return (
    <div className="bg-white z-10 pt-2.5 pb-3.5 max-h-80 grid grid-rows-2/1fr-auto" id="searchTab">
      <div className="relative overflow-y-auto mr-3.5">
        <table className="w-full">
          <tbody>
            {
              documents.map((item) => (
                <tr
                  key={item._id}
                  className="border-0 border-b border-solid border-gray-300 h-16 grid sm:grid-cols-2/1fr-0.3fr items-center cursor-default"
                  onClick={(event) => {
                    const tags = [...document.querySelectorAll('#searchTab tr')];
                    tags.map((tr) => tr.classList.remove('bg-gray-100'));

                    event.currentTarget.classList.add('bg-gray-100');
                  }}
                  onDoubleClick={() => {
                    const a = document.createElement('a');
                    a.target = 'blank';
                    a.href = `${axios.defaults.baseURL}${item.url}`;

                    a.click();
                    a.remove();

                    setTab((prev) => ({
                      ...prev,
                      searchIsOpen: false,
                    }));
                  }}
                >
                  <td className="truncate flex items-center gap-3.5 px-0">
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
                    <div className="grid overflow-x-hidden">
                      <p className="font-semibold truncate">{`${item.filename}.${item.format}`}</p>
                      <p className="text-sm truncate">{item.originalname}</p>
                    </div>
                  </td>
                  <td className="hidden sm:block truncate text-right px-0">{helper.formatDate(item.createdAt)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-3.5 mr-3.5">
        <p>{`${documents.length} results`}</p>
        <button
          type="button"
          className="py-1.5 px-2.5 rounded-md hover:bg-gray-200 w-28 bg-gray-100"
          onClick={() => {
            setForm((prev) => ({
              ...prev,
              filename: '',
            }));
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default SearchTab;
