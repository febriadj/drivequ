import axios from 'axios';

export default async (payload = null) => {
  try {
    const token = localStorage.getItem('token');

    const { data } = await axios({
      method: 'POST',
      url: '/api/in/zip',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { payload },
    });

    if (data.success) {
      const el = document.createElement('a');
      el.style = 'display: none';

      el.href = `${axios.defaults.baseURL}${data.payload.url}`;
      el.download = data.payload.filename;
      el.click();

      el.remove();
    }

    return true;
  }
  catch (error0) {
    console.error(error0.response.data.message);
    return true;
  }
};
