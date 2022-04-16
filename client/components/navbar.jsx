import React, { useState } from 'react';
import * as icon from 'react-icons/bi';
import avatar from '../assets/images/avatar.png';
import Profile from './profile';
import SearchTab from './searchTab';

function Navbar() {
  const [profileIsOpen, setProfileIsOpen] = useState(false);
  const [searchTabIsOpen, setSearchTabIsOpen] = useState(false);

  const [form, setForm] = useState({ filename: '' });

  return (
    <div className="absolute w-full h-16 border border-gray-300 border-solid border-x-0 border-t-0 bg-white z-40 flex items-center">
      {
        profileIsOpen && <Profile setProfileIsOpen={setProfileIsOpen} />
      }
      <div className="w-full px-3.5 gap-5 sm:gap-0 sm:px-5 grid grid-cols-2/1fr-auto sm:grid-cols-3/auto-1fr-0.5fr items-center">
        <div className="items-center gap-1.5 hidden sm:w-16 sm:flex md:w-56">
          <icon.BiCloudRain className="text-3xl" />
          <h3 className="text-xl hidden md:block">CloudSync</h3>
        </div>
        <div className="relative h-12">
          <div
            className={`
              absolute w-full grid pl-3.5 rounded-lg border border-solid
              ${searchTabIsOpen ? 'bg-white shadow-lg shadow-gray-200 border-gray-100' : 'bg-gray-100 border-transparent'}
            `}
          >
            <div
              className="grid grid-cols-3/auto-1fr-auto items-center gap-3.5 w-full h-12"
            >
              <icon.BiSearch className="text-2xl" />
              <input
                type="text"
                name="search"
                id="search"
                onClick={() => setSearchTabIsOpen(true)}
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    filename: event.target.value,
                  }));
                }}
                value={form.filename}
                className="bg-transparent w-full h-full"
                placeholder="Search documents"
              />
              <span className="flex items-center mr-2.5">
                {
                  searchTabIsOpen && (
                    <button
                      type="button"
                      className="cursor-pointer hover:bg-gray-100 p-1.5 rounded-[50%]"
                      onClick={() => setSearchTabIsOpen(false)}
                    >
                      <icon.BiX className="text-2xl" />
                    </button>
                  )
                }
                <button
                  type="button"
                  className={`cursor-pointer p-1.5 rounded-md ${searchTabIsOpen ? 'hover:bg-gray-100' : 'hover:bg-gray-200'}`}
                >
                  <icon.BiSlider className="text-2xl" />
                </button>
              </span>
            </div>
            {
              searchTabIsOpen && (
                <SearchTab
                  setForm={setForm}
                  form={form}
                  setSearchTabIsOpen={setSearchTabIsOpen}
                />
              )
            }
          </div>
        </div>
        <div className="flex items-center justify-end gap-5">
          <img
            src={avatar}
            alt={avatar}
            className="w-12 h-12 rounded-[50%] border-solid border border-gray-300 cursor-pointer"
            onClick={() => {
              setProfileIsOpen((prev) => !prev);
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
