import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as icon from 'react-icons/bi';
import { login } from '../../redux/features/user';

function Login({ setLoginFormIsOpen }) {
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post('/login', form);

      if (!data.success) throw data;

      localStorage.setItem('token', data.payload);
      setMessage(data.message);

      setTimeout(() => {
        dispatch(login(data.payload));
      }, 1000);
    }
    catch (error0) {
      setMessage(error0.response.data.message);
    }
  };

  const fieldStyle = 'p-3.5 border border-solid border-gray-300 rounded-lg grid grid-cols-2/auto-1fr items-center gap-3.5';

  return (
    <div className="w-96">
      <div className="flex items-center gap-2.5">
        <h1 className="text-3xl font-semibold">Sign In</h1>
        <span className="block w-2 h-2 bg-gray-300 rounded-md"></span>
        <h1 className="text-base opacity-50">Sign Up</h1>
      </div>
      <p className="text-base mt-2.5 mb-5">{message}</p>
      <form method="post" className="w-full grid gap-2.5" onSubmit={handleSubmit}>
        <label htmlFor="email" className={fieldStyle}>
          <icon.BiEnvelope className="text-xl" />
          <input
            type="email"
            name="email"
            id="email"
            className="bg-transparent w-full"
            placeholder="Email"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password" className={fieldStyle}>
          <icon.BiLockAlt className="text-xl" />
          <input
            type="password"
            name="password"
            id="password"
            className="bg-transparent w-full"
            placeholder="Password"
            onChange={handleChange}
          />
        </label>
        <div className="grid grid-cols-2/1fr-auto gap-2.5 mt-5">
          <button
            type="submit"
            className="p-3.5 bg-gray-500 rounded-lg text-white"
          >
            Sign In
          </button>
          <button
            type="button"
            className="p-3.5 bg-gray-100 rounded-lg w-24"
            onClick={() => {
              setLoginFormIsOpen(false);
            }}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
