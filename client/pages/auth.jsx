import React, { useEffect, useState } from 'react';
import * as comp from '../components/auth';

function Auth() {
  const [loginFormIsOpen, setLoginFormIsOpen] = useState(true);

  useEffect(() => {
    document.title = `${loginFormIsOpen ? 'Sign In' : 'Sign Up'} - Cloudipati`;
  });

  return (
    <div className="absolute w-full h-full flex justify-center items-center">
      {
        loginFormIsOpen
          ? <comp.login setLoginFormIsOpen={setLoginFormIsOpen} />
          : <comp.register setLoginFormIsOpen={setLoginFormIsOpen} />
      }
    </div>
  );
}

export default Auth;
