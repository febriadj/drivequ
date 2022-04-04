import axios from 'axios';

export default async ({
  trashed = false,
}) => {
  try {
    const token = localStorage.getItem('token');

    const { data } = await axios.get('/documents/size', {
      params: { trashed },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.payload;
  }
  catch (error0) { return 0; }
};
