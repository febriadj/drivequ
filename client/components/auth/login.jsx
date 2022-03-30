import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as icon from 'react-icons/bi';
import { login } from '../../redux/features/auth';

function Login({ setLoginFormIsOpen }) {
  const configs = localStorage.getItem('configs');
  const dispatch = useDispatch();

  const [response, setResponse] = useState({
    success: false,
    message: '',
  });

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [remember, setRemember] = useState(false);

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
      setResponse((prev) => ({
        ...prev,
        success: true,
        message: data.message,
      }));

      const obj = JSON.stringify({ remember: remember ? form.email : '' });
      localStorage.setItem('configs', obj);
      localStorage.setItem('token', data.payload);

      setTimeout(() => {
        dispatch(login(data.payload));
      }, 1000);
    }
    catch (error0) {
      setResponse((prev) => ({
        ...prev,
        success: false,
        message: error0.response.data.message,
      }));
    }
  };

  const fieldStyle = 'py-2.5 px-3.5 border border-solid border-gray-300 rounded-lg grid grid-cols-2/auto-1fr items-center gap-3.5 hover:border-black';

  useEffect(() => {
    if (configs) {
      setForm((prev) => ({
        ...prev,
        email: JSON.parse(configs).remember,
      }));
    }
  }, []);

  return (
    <div className="absolute w-full h-full overflow-y-scroll p-5">
      <div>
        <span className="flex items-center gap-2.5 mb-2.5">
          <h1 className="text-3xl font-semibold">Sign In</h1>
          <span className="block w-1 h-1 bg-black rounded-[50%]"></span>
          <h1 className="text-base opacity-50">Sign Up</h1>
        </span>
        <p>{`${configs && JSON.parse(configs).remember ? 'Welcome back' : 'Welcome to CloudSync'}, please login to your account and enjoy our service`}</p>
      </div>
      <form method="post" className="w-full grid gap-2.5 my-10" onSubmit={handleSubmit}>
        <label htmlFor="email" className={fieldStyle}>
          <icon.BiEnvelope className="text-xl" />
          <input
            type="email"
            name="email"
            id="email"
            className="bg-transparent w-full"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
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
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <div className="flex items-center">
          <button
            type="button"
            className="bg-gray-100 rounded-lg py-1 pl-1.5 pr-2.5 flex items-center gap-1.5 hover:bg-gray-200"
            onClick={() => {
              setRemember((prev) => !prev);
            }}
          >
            { remember ? <icon.BiRadioCircleMarked className="text-xl" /> : <icon.BiRadioCircle className="text-xl" /> }
            <p>Remember Me</p>
          </button>
        </div>
        <div className="grid mt-5">
          <p className={`text-base ${response.success ? 'text-black' : 'text-red-900'} first-letter:uppercase underline`}>{response.message}</p>
          <div className="grid grid-cols-2/1fr-auto gap-2.5 mt-3.5">
            <button
              type="submit"
              className="p-3.5 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
            >
              Sign In
            </button>
            <button
              type="button"
              className="p-3.5 bg-gray-100 rounded-lg w-24 hover:bg-gray-200"
              onClick={() => {
                setLoginFormIsOpen(false);
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
      <div className="flex items-center gap-1">
        <icon.BiCopyright className="text-base" />
        <p>{`${new Date().getFullYear()} CloudSync.`}</p>
      </div>
    </div>
  );
}

export default Login;
