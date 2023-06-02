import React from 'react';
import Login from './Login';
import Profile from './Profile';

import {
  useSession,
} from "@inrupt/solid-ui-react";


const App: React.FC = () => {
  const { session } = useSession();

  return (
    <>
      {!session.info.isLoggedIn && <Login />}
      {session.info.isLoggedIn && <Profile/>}
    </>
  );
};

export default App;
