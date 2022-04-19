import axios from 'axios';

export default async ({
  queries,
  actions,
}) => {
  try {
    const token = localStorage.getItem('token');

    const tr = document.querySelectorAll('#myStorage-table tr')[Number(queries.index)];
    tr.classList.add('h-0');

    await axios({
      method: 'PUT',
      url: '/api/in/documents/move',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        id: [queries.id],
        location: queries.location,
      },
    });

    setTimeout(() => {
      actions.handleGetFolders();
      actions.handleGetDocs();

      setTimeout(() => tr.classList.remove('h-0'), 200);
    }, 200);
  }
  catch (error0) {
    console.error(error0.response.data.message);
  }
};
