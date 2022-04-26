import React, { useState } from 'react';
import * as icon from 'react-icons/bi';
import { Link } from 'react-router-dom';
import baseConfig from '../../config';
import avatar from '../../assets/images/avatar.png';
import Profile from './profile';
import SearchTab from './searchTab';
import FilterTab from './filterTab';

function Navbar() {
  const [tab, setTab] = useState({
    profileIsOpen: false,
    searchIsOpen: false,
    filterIsOpen: false,
  });

  const [form, setForm] = useState({ filename: '' });

  return (
    <div className="absolute w-full h-16 border border-gray-300 border-solid border-x-0 border-t-0 bg-white z-40 flex items-center">
      {
        tab.profileIsOpen && <Profile setTab={setTab} />
      }
      <div className="w-full px-3.5 gap-5 sm:gap-0 sm:px-5 grid grid-cols-2/1fr-auto sm:grid-cols-3/auto-1fr-0.5fr items-center">
        <div className="items-center hidden sm:w-16 sm:flex md:w-56">
          <Link to="/" className="sm:flex items-center gap-1.5 hidden">
            <icon.BiCloudLightning className="text-3xl" />
            <h3 className="text-xl hidden md:block">{baseConfig.appName}</h3>
          </Link>
        </div>
        <div className="relative h-12">
          <div
            className={`
              absolute w-full grid pl-3.5 rounded-lg border border-solid
              ${tab.searchIsOpen || tab.filterIsOpen ? 'bg-white shadow-lg shadow-gray-200 border-gray-100' : 'bg-gray-100 border-transparent'}
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
                onClick={() => {
                  setTab((prev) => ({
                    ...prev,
                    searchIsOpen: true,
                    profileIsOpen: false,
                    filterIsOpen: false,
                  }));
                }}
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
                  tab.searchIsOpen && (
                    <button
                      type="button"
                      className="cursor-pointer hover:bg-gray-100 p-1.5 rounded-[50%]"
                      onClick={() => {
                        setTab((prev) => ({
                          ...prev,
                          searchIsOpen: false,
                        }));
                      }}
                    >
                      <icon.BiX className="text-2xl" />
                    </button>
                  )
                }
                <button
                  type="button"
                  className={`cursor-pointer p-1.5 rounded-md ${tab.searchIsOpen ? 'hover:bg-gray-100' : 'hover:bg-gray-200'}`}
                  onClick={() => {
                    setTab((prev) => ({
                      ...prev,
                      profileIsOpen: false,
                      searchIsOpen: false,
                      filterIsOpen: !prev.filterIsOpen,
                    }));
                  }}
                >
                  <icon.BiSlider className="text-2xl" />
                </button>
              </span>
            </div>
            {
              tab.searchIsOpen && (
                <SearchTab
                  setForm={setForm}
                  form={form}
                  setTab={setTab}
                />
              )
            }
            {
              tab.filterIsOpen && (
                <FilterTab
                  setTab={setTab}
                />
              )
            }
          </div>
        </div>
        <div className="flex items-center justify-end gap-5">
          <img
            src={avatar}
            alt={avatar}
            className="w-12 h-12 rounded-[50%] cursor-pointer"
            onClick={() => {
              setTab((prev) => ({
                ...prev,
                profileIsOpen: !prev.profileIsOpen,
                searchIsOpen: false,
                filterIsOpen: false,
              }));
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
