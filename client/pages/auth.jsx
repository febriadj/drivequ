import React, { useEffect, useState } from 'react';
import * as comp from '../components/auth';

function Auth() {
  const [loginFormIsOpen, setLoginFormIsOpen] = useState(true);

  useEffect(() => {
    document.title = `${loginFormIsOpen ? 'Sign In' : 'Sign Up'} - Storager`;
  }, [loginFormIsOpen]);

  return (
    <div className="absolute w-full h-full flex justify-center md:grid md:grid-cols-2/auto-1fr">
      <div className="relative w-full md:w-[450px] h-full flex">
        {
          loginFormIsOpen
            ? <comp.login setLoginFormIsOpen={setLoginFormIsOpen} />
            : <comp.register setLoginFormIsOpen={setLoginFormIsOpen} />
        }
      </div>
      <div className="bg-gray-200 hidden md:block"></div>
    </div>
  );
}

export default Auth;
