import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as icon from 'react-icons/bi';
import { login } from '../../redux/features/auth';

function Login({ setLoginFormIsOpen }) {
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
      const { data } = await axios.post('/api/in/login', form);

      if (!data.success) throw data;
      setResponse((prev) => ({
        ...prev,
        success: true,
        message: data.message,
      }));

      const obj = JSON.stringify({ remember: remember ? form.email : '' });
      localStorage.setItem('app', obj);
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

  useEffect(() => {
    const app = localStorage.getItem('app');

    if (app) {
      setForm((prev) => ({
        ...prev,
        email: JSON.parse(app).remember,
      }));
    }
  }, []);

  return (
    <div className="absolute w-full h-full overflow-y-scroll py-10 px-5 md:p-10">
      <div>
        <h1 className="text-2xl font-bold mb-2">Sign In</h1>
        <p>Complete all forms to enter your storage dashboard.</p>
      </div>
      <form method="post" className="w-full grid gap-2 my-10" onSubmit={handleSubmit}>
        <label htmlFor="email" className="relative flex items-center">
          <icon.BiEnvelope className="text-xl absolute left-0 translate-x-3" />
          <input
            type="email"
            name="email"
            id="email"
            className="peer bg-transparent w-full py-3 px-11 rounded-md border border-solid border-gray-300 focus:border-black valid:bg-gray-50"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
          {
            form.email.length > 0 && (
              <>
                <icon.BiError className="text-xl absolute right-0 -translate-x-3 hidden text-red-600 peer-invalid:block" />
                <icon.BiCheckCircle className="text-xl absolute right-0 -translate-x-3 hidden text-emerald-600 peer-valid:block" />
              </>
            )
          }
        </label>
        <label htmlFor="password" className="relative flex items-center">
          <icon.BiLockOpenAlt className="text-xl absolute left-0 translate-x-3" />
          <input
            type="password"
            name="password"
            id="password"
            className="peer bg-transparent w-full py-3 px-11 rounded-md border border-solid border-gray-300 focus:border-black valid:bg-gray-50"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {
            form.password.length > 0 && (
              <>
                <icon.BiError className="text-xl absolute right-0 -translate-x-3 hidden text-red-600 peer-invalid:block" />
                <icon.BiCheckCircle className="text-xl absolute right-0 -translate-x-3 hidden text-emerald-600 peer-valid:block" />
              </>
            )
          }
        </label>
        <div className="flex items-center">
          <button
            type="button"
            className="bg-gray-100 rounded-md py-1 pl-1 pr-2 flex items-center gap-1 hover:bg-gray-200"
            onClick={() => {
              setRemember((prev) => !prev);
            }}
          >
            { remember ? <icon.BiRadioCircleMarked className="text-xl" /> : <icon.BiRadioCircle className="text-xl" /> }
            <p>Remember me</p>
          </button>
        </div>
        <div className="grid mt-5">
          {
            response.message && (
              <p className={`${response.success ? 'text-black' : 'text-red-900'} mb-2 underline decoration-1 decoration-red-900 first-letter:uppercase`}>
                {response.message}
              </p>
            )
          }
          <button
            type="submit"
            className="p-3 bg-blue-500 rounded-md text-white hover:bg-blue-600 font-bold border border-solid border-blue-800"
          >
            Sign In
          </button>
        </div>
      </form>
      <p>
        <span className="mr-2">Don&#39;t have an account?</span>
        <span
          aria-hidden
          className="cursor-pointer hover:underline decoration-1"
          onClick={() => {
            setLoginFormIsOpen(false);
          }}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}

export default Login;
