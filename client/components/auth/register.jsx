import React, { useState } from 'react';
import axios from 'axios';
import * as icon from 'react-icons/bi';

function Register({ setLoginFormIsOpen }) {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      const { data } = await axios.post('/register', {
        email: form.email,
        password: form.password,
        name: {
          first: form.firstname,
          last: form.lastname,
        },
      });

      if (!data.success) throw data;

      setMessage(data.message);
      setTimeout(() => setLoginFormIsOpen(true), 1000);
    }
    catch (error0) {
      setMessage(error0.response.data.message);
    }
  };

  const fieldStyle = 'p-3.5 border border-solid border-gray-300 rounded-lg grid grid-cols-2/auto-1fr items-center gap-3.5';

  return (
    <div className="w-96">
      <div className="flex items-center gap-2.5">
        <h1 className="text-base opacity-50">Sign In</h1>
        <span className="block w-2 h-2 bg-gray-300 rounded-md"></span>
        <h1 className="text-3xl font-semibold">Sign Up</h1>
      </div>
      <p className="text-base mt-2.5 mb-5">{message}</p>
      <form method="post" className="w-full grid gap-2.5" onSubmit={handleSubmit}>
        <div className="flex gap-2 5">
          <label htmlFor="firstname" className={fieldStyle}>
            <icon.BiUser className="text-xl" />
            <input
              type="text"
              name="firstname"
              id="firstname"
              className="bg-transparent w-full"
              placeholder="First Name"
              onChange={handleChange}
            />
          </label>
          <label htmlFor="lastname" className={fieldStyle}>
            <icon.BiUser className="text-xl" />
            <input
              type="text"
              name="lastname"
              id="lastname"
              className="bg-transparent w-full"
              placeholder="Last Name"
              onChange={handleChange}
            />
          </label>
        </div>
        <label htmlFor="email" className={fieldStyle}>
          <icon.BiEnvelope className="text-xl" />
          <input
            type="text"
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
            Sign Up
          </button>
          <button
            type="button"
            className="p-3.5 bg-gray-100 rounded-lg w-24"
            onClick={() => {
              setLoginFormIsOpen(true);
            }}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
