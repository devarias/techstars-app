import React, { useState, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import EditMentors from './EditMentors';
import CSVReader2 from './UploadFile';
import LoadTable from './LoadTable';
import Navsider from './Navsider';
import NotFound from './NotFound';
import TableReschedule from './TableReschedule';
import TableSchedule from './TableSchedule';
import '../styles/Page.css';

const { Content, Sider } = Layout;

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
    const response = await fetch(
      `https://techstars-api.herokuapp.com/api/${path}`,
      {
        method: 'GET',
        headers: {
          'content-Type': 'application/json',
          Accept: 'aplication/json',
        },
      }
    );
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

  const classObjects = ['home', 'surveyStatus', 'results', 'charts', 'table'];
  const pathRoute = [
    '/',
    '/SurveyStatus',
    '/Results',
    '/GenerateMeetings',
    '/MeetingsTable',
  ];
  const onCollapse = (collapsed) => setCollapse(collapsed);
  const viewObjects = [
    'home',
    <LoadTable />,
    <LoadTable />,
    <CSVReader2 setRechargeMeetings={setRechargeMeetings} setView={setView} />,
    <TableSchedule
      resSchedule={resSchedule}
      companies={companies}
      tableDisplay={tableDisplay}
      setRechargeMeetings={setRechargeMeetings}
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
  ];

  return (
    <Router>
      <Switch>
        {/* <Route exact path='/survey/:id' component={NotFound} />
        <Route path='/Error' component={NotFound} /> */}
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            width={230}
          >
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
                  <Redirect to='/Error' />
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
