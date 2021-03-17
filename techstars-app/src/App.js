import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Page from './components/Page';
import Spinner from './components/Spinner';

function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  const { loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <div className='container'>
        <Spinner />
      </div>
    );
  }
  if (!isAuthenticated) {
    return loginWithRedirect();
  }

  return (
    <>
      <Page />
    </>
  );
}

export default App;
