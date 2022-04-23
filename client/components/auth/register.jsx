import React, { useState } from 'react';
import axios from 'axios';
import * as icon from 'react-icons/bi';
import baseConfig from '../../config';

function Register({ setLoginFormIsOpen }) {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    app: '',
    accType: 'personal',
    company: '',
  });

  const [modalOption, setModalOption] = useState(false);
  const [response, setResponse] = useState({
    success: false,
    message: '',
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

      if (form.password !== form.confirmPassword) {
        const newError = {
          response: {
            data: {
              message: 'Password and password confirmation do not match',
            },
          },
        };
        throw newError;
      }

      const { data } = await axios.post('/api/in/register', {
        email: form.email,
        password: form.password,
        name: {
          first: form.firstname,
          last: form.lastname,
        },
        app: form.app,
        company: form.company,
        accType: form.accType,
      });

      setTimeout(() => setLoginFormIsOpen(true), 1000);
      setResponse((prev) => ({
        ...prev,
        success: true,
        message: data.message,
      }));
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

  return (
    <div className="absolute w-full h-full overflow-y-scroll p-5">
      <div>
        <span className="flex items-center gap-2.5 mb-2.5">
          <h1 className="text-base opacity-50">Sign In</h1>
          <span className="block w-1 h-1 bg-black rounded-[50%]"></span>
          <h1 className="text-3xl font-semibold">Sign Up</h1>
        </span>
        <p>Complete the form below to register your account and start subscribing to our service</p>
      </div>
      <form method="post" className="w-full grid gap-10 my-10" onSubmit={handleSubmit}>
        <span className="grid grid-cols-2/1fr-auto gap-2.5">
          <label htmlFor="app" className={fieldStyle}>
            <icon.BiRocket className="text-xl" />
            <input
              type="text"
              name="app"
              id="app"
              className="bg-transparent w-full"
              placeholder="Application Name"
              value={form.app}
              onChange={handleChange}
              required
            />
          </label>
          <div className="relative flex w-32">
            <button
              type="button"
              onClick={() => setModalOption((prev) => !prev)}
              className="w-full flex justify-between items-center gap-1.5 py-2.5 pl-3.5 pr-2.5 bg-gray-50 border border-solid border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <p className="first-letter:uppercase">{form.accType}</p>
              <icon.BiChevronDown className="text-2xl" />
            </button>
            {
              modalOption && (
                <div className="absolute w-full top-0 bg-white z-10 py-2.5 translate-y-12 shadow-lg shadow-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, accType: 'personal' }));
                      setTimeout(() => {
                        setModalOption(false);
                      }, 200);
                    }}
                    className="p-2.5 hover:bg-gray-100 w-full flex items-center gap-2.5"
                  >
                    { form.accType === 'personal' ? <icon.BiRadioCircleMarked /> : <icon.BiRadioCircle /> }
                    <p>Personal</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, accType: 'business' }));
                      setTimeout(() => {
                        setModalOption(false);
                      }, 200);
                    }}
                    className="p-2.5 hover:bg-gray-100 w-full flex items-center gap-2.5"
                  >
                    { form.accType === 'business' ? <icon.BiRadioCircleMarked /> : <icon.BiRadioCircle /> }
                    <p>Business</p>
                  </button>
                </div>
              )
            }
          </div>
        </span>
        <span className="grid gap-2.5">
          {
            form.accType === 'personal' ? (
              <div className="flex gap-2.5">
                <label htmlFor="firstname" className={fieldStyle}>
                  <icon.BiUser className="text-xl" />
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    className="bg-transparent w-full"
                    placeholder="First Name"
                    value={form.firstname}
                    onChange={handleChange}
                    required
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
                    value={form.lastname}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            ) : (
              <label htmlFor="company" className={fieldStyle}>
                <icon.BiBuildingHouse className="text-xl" />
                <input
                  type="text"
                  name="company"
                  id="company"
                  className="bg-transparent w-full"
                  placeholder="Company Name"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
              </label>
            )
          }
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
        </span>
        <span className="grid gap-2.5">
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
          <label htmlFor="confirmPassword" className={fieldStyle}>
            <icon.BiLockOpenAlt className="text-xl" />
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="bg-transparent w-full"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>
        </span>
        <div className="grid">
          <p className={`text-base ${response.success ? 'text-black' : 'text-red-900'} first-letter:uppercase`}>{response.message}</p>
          <div className="grid grid-cols-2/1fr-auto gap-2.5 mt-3.5">
            <button
              type="submit"
              className="p-3.5 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="p-3.5 bg-gray-100 rounded-lg w-24 hover:bg-gray-200"
              onClick={() => {
                setLoginFormIsOpen(true);
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </form>
      <div className="flex items-center gap-1">
        <icon.BiCopyright className="text-base" />
        <p>{`${new Date().getFullYear()} ${baseConfig.appName}`}</p>
      </div>
    </div>
  );
}

export default Register;
