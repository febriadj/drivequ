import React from 'react';
import * as icon from 'react-icons/bi';
import { useSelector, useDispatch } from 'react-redux';
import bytesToSize from '../helpers/bytesToSize';
import { setLoadUpload } from '../redux/features/modal';

function LoadUpload() {
  const dispatch = useDispatch();
  const { loadUpload } = useSelector((state) => state.modal);

  return (
    <div className="fixed bottom-0 right-0 w-full sm:w-[400px] max-h-[200px] z-20 grid grid-rows-[auto_1fr] overflow-hidden bg-white -translate-y-16 sm:-translate-y-5 sm:-translate-x-10 sm:shadow-2xl sm:rounded-t-md">
      {
        loadUpload.data && (
          <>
            <div
              className={`
                py-2 px-3.5 text-white flex justify-between gap-3
                ${!loadUpload.end && 'bg-gray-800'}
                ${loadUpload.end && loadUpload.success && 'bg-gray-800'}
                ${loadUpload.end && !loadUpload.success && 'bg-red-800'}
              `}
            >
              <div className="flex gap-3 items-center">
                <p>{loadUpload.message}</p>
                {loadUpload.end && loadUpload.success && <icon.BiCheckCircle className="text-xl text-emerald-200" />}
                {loadUpload.end && !loadUpload.success && <icon.BiXCircle className="text-xl text-red-200" />}
                {
                  !loadUpload.end && (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#ffffff20" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#ffffffea" />
                    </svg>
                  )
                }
              </div>
              {
                loadUpload.end && (
                  <span className={`${loadUpload.success ? 'hover:bg-gray-700' : 'hover:bg-red-700'} flex gap-2 items-center cursor-pointer rounded-full`}>
                    <button
                      type="button"
                      onClick={() => dispatch(setLoadUpload({
                        data: null,
                      }))}
                    >
                      <icon.BiX className="text-2xl" />
                    </button>
                  </span>
                )
              }
            </div>
            <div className="h-full grid overflow-y-auto">
              {
                loadUpload.data.map((item) => (
                  <div
                    key={item.name}
                    className={`
                      py-2 px-3.5 grid grid-cols-[auto_1fr_auto] gap-3 items-center border-0 border-b border-solid border-gray-200
                      ${loadUpload.end && loadUpload.success ? 'opacity-100 bg-emerald-50' : 'opacity-60'}
                      ${loadUpload.end && !loadUpload.success ? 'opacity-100 bg-red-50' : 'opacity-60'}
                    `}
                  >
                    <icon.BiImageAlt className="text-2xl" />
                    <span className="truncate">
                      <p className="truncate">{item.name}</p>
                      <p className="truncate text-xs opacity-60 mt-0.5">{item.type}</p>
                    </span>
                    <p className="text-xs ">{bytesToSize(item.size)}</p>
                  </div>
                ))
              }
            </div>
          </>
        )
      }
    </div>
  );
}

export default LoadUpload;
