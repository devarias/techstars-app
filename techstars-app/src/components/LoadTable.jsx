import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ColorCode from './ColorCode';
import TableResults from './TableResults';
import Spinner from './Spinner';
import ManageSurveyTable from './ManageSurveyTable';
import '../styles/LoadTable.css';

function LoadTable() {
  const [todoCompanies, setTodoCompanies] = useState('');
  const [displayTable, setDisplayTable] = useState(false);
  const [dataResults, setDataResults] = useState('');
  const currentLocation = useLocation();

  const getCompanies = async () => {
    const response = await fetch(
      `https://techstars-api.herokuapp.com/api/companies`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    return response.json();
  };

  const getResults = async () => {
    const resultsResponse = await fetch(
      'http://techstars-api.herokuapp.com/api/results',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    return resultsResponse.json();
  };

  useEffect(() => {
    async function fetchData() {
      console.log('on mount');
      let result = await getResults();
      setDataResults(result);
      result = await getCompanies();
      setTodoCompanies(result);
      setDisplayTable(true);
    }
    fetchData();
  }, []);

  if (currentLocation.pathname === '/SurveyStatus') {
    return (
      <>
        <h2>Survey Status</h2>
        {displayTable ? (
          <ManageSurveyTable results={dataResults} />
        ) : (
          <Spinner />
        )}
      </>
    );
  }

  return (
    <>
      <ColorCode />
      {displayTable ? (
        <TableResults company={todoCompanies} results={dataResults} />
      ) : (
        <Spinner />
      )}
    </>
  );
}
export default LoadTable;
