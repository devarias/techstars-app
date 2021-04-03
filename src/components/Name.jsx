import React, { useEffect, useState } from 'react';
import {
  getDataMentors,
  getDataCompanies,
  getMentorName,
  getCompanyName,
  mentorOrCompany,
} from './Data';
import Survey from './Survey';
import HeaderComp from './HeaderComp';
import HeaderMent from './HeaderMent';
import { Row, Col } from 'antd';
import { useLocation } from 'react-router-dom';
import ColoredScrollbars from './ColoredScrollbars';
import '../styles/Survey.css';
export let unit;

function Name() {
  const [name, setName] = useState('');
  const [list, setList] = useState([]);
  const [flag, setFlag] = useState(0);
  const [msg, setMsg] = useState('');
  const id = useLocation().pathname.slice(8);

  useEffect(async () => {
    const flaggy = await mentorOrCompany(id);
    setFlag(flaggy);
    if (flaggy === 1) {
      await getMentorName(id)
        .then(async (name) => {
          setName(name);
          await getDataMentors(id)
            .then((list) => {
              setList(list[0]);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
      setMsg('Company Preparedness');
    } else if (flaggy === 2) {
      await getCompanyName(id)
        .then(async (name) => {
          setName(name);
          await getDataCompanies(id)
            .then((list) => {
              setList(list[0]);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
      setMsg('Mentor Helpfullness');
    }
  }, []);
  function showSurveys() {
    const voteUpd = flag === 1 ? { 3: 1, 1: 2, 0: 3 } : { 2: 1, 1: 2, 0: 3 };
    if (list[name] && flag === 1) {
      return list[name]
        .filter((meet) => meet.meetingDone === true)
        .map((elem, i) => {
          if (elem.survey_id !== null) {
            return (
              (unit = i),
              (
                <Col key={i} meetings={elem.company}>
                  <Survey
                    meetings={elem.company}
                    vals={voteUpd[elem.mentorVote]}
                    txt={msg}
                    txtA={elem.mentorFeedback}
                    element={elem}
                    btn={1}
                    c={1}
                  >
                    {elem.company}
                  </Survey>
                </Col>
              )
            );
          } else {
            return (
              (unit = i),
              (
                <Col key={i} meetings={elem.company}>
                  <Survey
                    meetings={elem.company}
                    vals={0}
                    txt={msg}
                    element={elem}
                    btn={2}
                    c={1}
                  >
                    {elem.company}
                  </Survey>
                </Col>
              )
            );
          }
        });
    } else if (list[name] && flag === 2) {
      return list[name]
        .filter((meet) => meet.meetingDone === true)
        .map((elem, i) => {
          if (elem.meetingDone === true) {
            if (elem.survey_id !== null) {
              return (
                (unit = i),
                (
                  <Col key={i} meetings={elem.mentor}>
                    <Survey
                      meetings={elem.mentor}
                      vals={voteUpd[elem.companyVote]}
                      txt={msg}
                      txtA={elem.companyFeedback}
                      element={elem}
                      btn={1}
                      c={2}
                    >
                      {elem.mentor}
                    </Survey>
                  </Col>
                )
              );
            } else {
              return (
                (unit = i),
                (
                  <Col key={i} meetings={elem.mentor}>
                    <Survey
                      meetings={elem.mentor}
                      vals={0}
                      txt={msg}
                      element={elem}
                      btn={2}
                      c={2}
                    >
                      {elem.mentor}
                    </Survey>
                  </Col>
                )
              );
            }
          }
        });
    }
  }
  function showHeader() {
    if (flag === 1) {
      return <HeaderMent />;
    } else if (flag === 2) {
      return <HeaderComp />;
    }
  }
  return (
    <>
      <ColoredScrollbars style={{ zIndex: 3, height: '100vh' }}>
        {showHeader()}
        <Row
          justify='center'
          align='top'
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        >
          {showSurveys()}
        </Row>
      </ColoredScrollbars>
    </>
  );
}
export default Name;
