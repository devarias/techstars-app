import React, { useState, useEffect } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import ColorCode from './ColorCode';
import TableResults from './TableResults';
import Spinner from './Spinner';
import ManageSurveyTable from './ManageSurveyTable';
import '../styles/LoadTable.css';

const companiesApi = 'https://techstars-api.herokuapp.com/api/companies';
const resultsApi = 'https://techstars-api.herokuapp.com/api/results/';
const performanceApi = 'http://techstars-api.herokuapp.com/api/performance/';

function LoadTable() {
  const [todoCompanies, setTodoCompanies] = useState('');
  const [displayTable, setDisplayTable] = useState(false);
  const [mentorResults, setMentorResults] = useState('');
  const [companyResults, setCompanyResults] = useState('');
  const [companyPerformance, setCompanyPerformance] = useState('');
  const [mentorPerformance, setMentorPerformance] = useState('');
  const [hasError, setHasError] = useState(false);
  const currentLocation = useLocation();

  const getCompanies = async () => {
    const response = await fetch(companiesApi, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  };

  const getPerformance = async (value) => {
    const response = await fetch(performanceApi + value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  };

  const getResults = async (value) => {
    const resultsResponse = await fetch(resultsApi + value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    if (!resultsResponse.ok) {
      throw new Error();
    }
    return resultsResponse.json();
  };

  useEffect(() => {
    async function fetchData() {
      let result = await getResults('mentors').catch((error) =>
        setHasError(true)
      );
      setMentorResults(result);
      result = await getResults('companies').catch((error) =>
        setHasError(true)
      );
      setCompanyResults(result);
      result = await getCompanies().catch((error) => setHasError(true));
      setTodoCompanies(result);
      result = await getPerformance('companies').catch((error) =>
        setHasError(true)
      );
      setCompanyPerformance(result);
      result = await getPerformance('mentors').catch((error) =>
        setHasError(true)
      );
      setMentorPerformance(result);
      setDisplayTable(true);
    }
    fetchData();
  }, []);

  if (hasError) {
    return <Redirect to='/Error' />;
  } else if (currentLocation.pathname === '/SurveyStatus') {
    return (
      <>
        <h2>Survey Tracking</h2>
        {displayTable ? (
          <ManageSurveyTable
            mentorResults={mentorResults}
            companyResults={companyResults}
          />
        ) : (
          <Spinner />
        )}
      </>
    );
  } else if (currentLocation.pathname === '/Performance') {
    return (
      <>
        <h2>Performance</h2>
        {displayTable ? (
          <Performance
            companyResults={companyPerformance}
            mentorResults={mentorPerformance}
          />
        ) : (
          <Spinner />
        )}
      </>
    );
  } else {
    return (
      <>
        <ColorCode />
        {displayTable ? (
          <TableResults company={todoCompanies} results={mentorResults} />
        ) : (
          <Spinner />
        )}
      </>
    );
  }
}
export default LoadTable;
