import React, { useState } from 'react';
import axios from 'axios';
import * as icon from 'react-icons/bi';
import config from '../../config';

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

  return (
    <div className="absolute w-full h-full overflow-y-scroll py-10 px-5 md:p-10">
      <div>
        <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
        <p>{`Complete all forms to register your account on the ${config.appName} service.`}</p>
      </div>
      <form method="post" className="w-full grid gap-10 my-10" onSubmit={handleSubmit}>
        <span className="grid grid-cols-2/1fr-auto gap-2">
          <label htmlFor="app" className="relative flex items-center">
            <icon.BiRocket className="text-xl absolute left-0 translate-x-3" />
            <input
              type="text"
              name="app"
              id="app"
              className="peer bg-transparent w-full py-3 px-11 rounded-md border border-solid border-gray-300 focus:border-black valid:bg-gray-50"
              placeholder="Application name"
              value={form.app}
              onChange={handleChange}
              required
            />
            {
              form.app.length > 0 && (
                <>
                  <icon.BiError className="text-xl absolute right-0 -translate-x-3 hidden text-red-600 peer-invalid:block" />
                  <icon.BiCheckCircle className="text-xl absolute right-0 -translate-x-3 hidden text-emerald-600 peer-valid:block" />
                </>
              )
            }
          </label>
          <div className="relative flex w-32">
            <button
              type="button"
              onClick={() => setModalOption((prev) => !prev)}
              className="w-full flex justify-between items-center gap-1 p-2 pl-3 bg-gray-50 border border-solid border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <p className="first-letter:uppercase">{form.accType}</p>
              <icon.BiChevronDown className="text-2xl" />
            </button>
            {
              modalOption && (
                <div className="absolute w-full top-0 bg-white z-10 py-2 translate-y-12 shadow-lg shadow-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, accType: 'personal' }));
                      setTimeout(() => {
                        setModalOption(false);
                      }, 200);
                    }}
                    className="p-2 hover:bg-gray-100 w-full flex items-center gap-2.5"
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
                    className="p-2 hover:bg-gray-100 w-full flex items-center gap-2.5"
                  >
                    { form.accType === 'business' ? <icon.BiRadioCircleMarked /> : <icon.BiRadioCircle /> }
                    <p>Business</p>
                  </button>
                </div>
              )
            }
          </div>
        </span>
        <span className="grid gap-2">
          {
            form.accType === 'personal' ? (
              <div className="flex gap-2">
                <label htmlFor="firstname" className="relative flex items-center">
                  <icon.BiUser className="text-xl absolute left-0 translate-x-3" />
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    className="peer bg-transparent w-full py-3 px-11 rounded-md border border-solid border-gray-300 focus:border-black valid:bg-gray-50"
                    placeholder="First name"
                    value={form.firstname}
                    onChange={handleChange}
                    required
                  />
                  {
                    form.firstname.length > 0 && (
                      <>
                        <icon.BiError className="text-xl absolute right-0 -translate-x-3 hidden text-red-600 peer-invalid:block" />
                        <icon.BiCheckCircle className="text-xl absolute right-0 -translate-x-3 hidden text-emerald-600 peer-valid:block" />
                      </>
                    )
                  }
                </label>
                <label htmlFor="lastname" className="relative flex items-center">
                  <icon.BiUser className="text-xl absolute left-0 translate-x-3" />
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    className="peer bg-transparent w-full py-3 px-11 rounded-md border border-solid border-gray-300 focus:border-black valid:bg-gray-50"
                    placeholder="Last name"
                    value={form.lastname}
                    onChange={handleChange}
                    required
                  />
                  {
                    form.lastname.length > 0 && (
                      <>
                        <icon.BiError className="text-xl absolute right-0 -translate-x-3 hidden text-red-600 peer-invalid:block" />
                        <icon.BiCheckCircle className="text-xl absolute right-0 -translate-x-3 hidden text-emerald-600 peer-valid:block" />
                      </>
                    )
                  }
                </label>
              </div>
            ) : (
              <label htmlFor="company" className="relative flex items-center">
                <icon.BiBuildingHouse className="text-xl absolute left-0 translate-x-3" />
                <input
                  type="text"
                  name="company"
                  id="company"
                  className="peer bg-transparent w-full py-3 px-11 rounded-md border border-solid border-gray-300 focus:border-black valid:bg-gray-50"
                  placeholder="Company"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
                {
                  form.company.length > 0 && (
                    <>
                      <icon.BiError className="text-xl absolute right-0 -translate-x-3 hidden text-red-600 peer-invalid:block" />
                      <icon.BiCheckCircle className="text-xl absolute right-0 -translate-x-3 hidden text-emerald-600 peer-valid:block" />
                    </>
                  )
                }
              </label>
            )
          }
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
        </span>
        <span className="grid gap-2">
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
          <label htmlFor="confirmPassword" className="relative flex items-center">
            <icon.BiLockAlt className="text-xl absolute left-0 translate-x-3" />
            <input
              type="text"
              name="confirmPassword"
              id="confirmPassword"
              className="peer bg-transparent w-full py-3 px-11 rounded-md border border-solid border-gray-300 focus:border-black valid:bg-gray-50"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            {
              form.confirmPassword.length > 0 && (
                <>
                  <icon.BiError className="text-xl absolute right-0 -translate-x-3 hidden text-red-600 peer-invalid:block" />
                  <icon.BiCheckCircle className="text-xl absolute right-0 -translate-x-3 hidden text-emerald-600 peer-valid:block" />
                </>
              )
            }
          </label>
        </span>
        <div className="grid">
          {
            response.message && (
              <p className={`${response.success ? 'text-black' : 'text-red-900'} mb-2 underline decoration-1 decoration-red-900 first-letter:uppercase`}>
                {response.message}
              </p>
            )
          }
          <button
            type="submit"
            className="p-3 font-bold bg-blue-500 rounded-md text-white hover:bg-blue-600 border border-solid border-blue-800"
          >
            Sign Up
          </button>
        </div>
      </form>
      <p>
        <span className="mr-2">Have an account?</span>
        <span
          aria-hidden
          className="cursor-pointer hover:underline decoration-1"
          onClick={() => {
            setLoginFormIsOpen(true);
          }}
        >
          Sign In
        </span>
      </p>
    </div>
  );
}

export default Register;
