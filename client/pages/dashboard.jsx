import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as icon from 'react-icons/bi';

import * as comp0 from '../components';
import * as comp1 from '../components/dashboard';

function Home() {
  const [documents, setDocuments] = useState([]);

  const handleGetDocs = async () => {
    try {
      const request = await axios.get('documents');

      if (!request.data.success) throw request.data;
      setDocuments(request.data.payload);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    document.title = 'Storage - Home';
    handleGetDocs();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <comp0.navbar />
      <comp0.sidebar />
      <div className="mt-16 grid gap-5 ml-60 py-3.5 px-5">
        <div className="container bg-white px-2.5">
          <button type="button" className="flex items-center gap-2.5">
            <h3 className="text-xl">Dashboard</h3>
            <icon.BiChevronDown className="text-2xl" />
          </button>
        </div>
        <comp1.table documents={documents} />
      </div>
    </div>
  );
}

export default Home;
