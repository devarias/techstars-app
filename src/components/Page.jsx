import React, { useState, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import EditMentors from './EditMentors';
import CSVReader2 from './UploadFile';
import LoadTable from './LoadTable';
import Navsider from './Navsider';
import NotFound from './NotFound';
import TableReschedule from './TableReschedule';
import TableSchedule from './TableSchedule';
import '../styles/Page.css';

const { Content, Sider } = Layout;
const url = 'https://techstars-api.herokuapp.com/api/';

const Page = () => {
  const [view, setView] = useState(0);
  const [collapsed, setCollapse] = useState(false);
  const [resSchedule, setResSchedule] = useState([]);
  const [viewSelect, setViewSelect] = useState(['0']);
  /* state to control the view of the table, it assures that all the content necessary is caught */
  const [tableDisplay, setTableDisplay] = useState(false);
  const [pendingMeetings, setPendingMeetings] = useState({});
  const [rechargeMeetings, setRechargeMeetings] = useState(false);
  const [rechargeReschedule, setRechargeReschedule] = useState(false);
  const [reloadMentors, setReloadMentors] = useState(false);
  /* companies variable returned from the back-end */
  const [companies, setCompanies] = useState([]);
  const [mentors, setMentors] = useState([]);

  const getData = async (path) => {
    const response = await fetch(url + path, {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
        Accept: 'aplication/json',
      },
    });
    return response.json();
  };

  useEffect(async () => {
    let results = await getData('table');
    setResSchedule(results);
    results = await getData('companies');
    setCompanies(results);
    results = await getData('pending');
    setPendingMeetings(results);
    results = await getData('mentors');
    setMentors(results);
    setTableDisplay(true);
    setRechargeMeetings(false);
    setRechargeReschedule(false);
    setReloadMentors(false);
  }, [rechargeMeetings, rechargeReschedule, reloadMentors]);

  const classObjects = [
    'home',
    'surveyStatus',
    'performance',
    'results',
    'charts',
    'table',
  ];
  const pathRoute = [
    '/',
    '/SurveyStatus',
    '/Performance',
    '/Results',
    '/GenerateMeetings',
    '/MeetingsTable',
    '/Schedule',
    '/Mentors',
  ];
  const onCollapse = (collapsed) => setCollapse(collapsed);
  const viewObjects = [
    'home',
    <LoadTable />,
    <LoadTable />,
    <LoadTable />,
    <CSVReader2
      setResSchedule={setResSchedule}
      setView={setView}
      setViewSelect={setViewSelect}
    />,
    <TableSchedule
      resSchedule={resSchedule}
      companies={companies}
      tableDisplay={tableDisplay}
      setRechargeMeetings={setRechargeMeetings}
      setResSchedule={setResSchedule}
    />,
    <TableReschedule
      pendingMeetings={pendingMeetings}
      setRechargeReschedule={setRechargeReschedule}
      setView={setView}
      mentors={mentors}
    />,
    <EditMentors
      mentors={mentors}
      companies={companies}
      setReloadMentors={setReloadMentors}
    />,
    <TableReschedule />,
  ];

  return (
    <Router>
      <Switch>
        {/* <Route exact path='/survey/:id' component={NotFound}/> */}
        {/* <Route path='/Error' component={NotFound} /> */}
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Navsider setView={setView} viewselect={viewSelect} />
          </Sider>
          <Layout className='site-layout'>
            <Content>
              <Row className='content'>
                <Switch>
                  <Route exact path={pathRoute[view]}>
                    <Col span={24} className={classObjects[view]}>
                      {viewObjects[view]}
                    </Col>
                  </Route>
                </Switch>
              </Row>
            </Content>
          </Layout>
        </Layout>
      </Switch>
    </Router>
  );
};

export default Page;
