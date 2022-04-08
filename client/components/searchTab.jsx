import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as icon from 'react-icons/bi';
import * as helper from '../helpers';

function SearchTab({
  form,
  setForm,
}) {
  const token = localStorage.getItem('token');
  const [documents, setDocuments] = useState([]);

  const handleGetDocs = async () => {
    try {
      const { data } = await axios.get('/documents', {
        params: {
          filename: form.filename,
        },
        headers: {
          Authorization: `Bearer ${token}`,
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
    <div className="bg-white z-10 pt-2.5 pb-3.5 max-h-80 grid grid-rows-2/1fr-auto">
      <div className="relative overflow-y-scroll mr-3.5">
        <table className="w-full">
          <tbody>
            {
              documents.map((item) => (
                <tr
                  key={item._id}
                  className="border-0 border-b border-solid border-gray-300 h-12 grid grid-cols-2/1fr-0.3fr items-center"
                >
                  <td className="truncate flex items-center gap-2.5 py-3">
                    <img
                      src={`${axios.defaults.baseURL}/documents/${item.userId}/file${item.url}`}
                      alt=""
                      className="w-6 h-6"
                    />
                    <p>{`${item.filename}.${item.format}`}</p>
                  </td>
                  <td className="truncate text-right">{helper.formatDate(item.createdAt)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-end mt-2.5 mr-1.5">
        <p className="bg-gray-100 px-2.5 rounded-md">{`${documents.length} results`}</p>
        <button
          type="button"
          className="p-1.5 rounded-[50%] hover:bg-gray-100 translate-y-1.5"
          onClick={() => {
            setForm((prev) => ({
              ...prev,
              filename: '',
            }));
          }}
        >
          <icon.BiRotateLeft className="text-2xl" />
        </button>
      </div>
    </div>
  );
}

export default SearchTab;
