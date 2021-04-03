import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Page from './components/Page';
import Spinner from './components/Spinner';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Name from './components/Name';

function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  const { loginWithRedirect } = useAuth0();
  const id = useLocation().pathname;

  if (id.includes('survey')) {
    return (
      <Router>
        <Route exact path='/survey/:id' component={Name} />
      </Router>
    );
  }

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
