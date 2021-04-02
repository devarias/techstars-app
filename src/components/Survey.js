import React, { useEffect, useState } from 'react';
import '../styles/Survey.css';
import { Avatar, Slider, Radio, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  AiOutlineCheckCircle,
  AiOutlineBulb,
  AiOutlineCloseCircle,
} from 'react-icons/ai';
import ReactCardFlip from 'react-card-flip';
import { unit } from './Name';
import axios from 'axios';
export let counter = 0;
export let swt = 0;
let num = 0;
const mentorSurveyApi = `https://techstars-api.herokuapp.com/api/mentor_survey/`;
const companySurveyApi = `https://techstars-api.herokuapp.com/api/company_survey/`;

function Survey(props) {
  //Set Data from components
  const [ranking, setRanking] = useState(1);
  const [vote, setVote] = useState(null);
  //Visual Updates
  const [state, setState] = useState(true);
  const [flag, setFlag] = useState(false);
  const [flip, isFlipped] = useState(true);
  const [count, setCount] = useState(0);
  const [feedback, setFeedback] = useState(props.txtA ? props.txtA : '');
  const marks = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: { style: { color: '#39C463' }, label: <strong>5</strong> },
  };
  let max = unit + 1;
  async function sendData(data, url) {
    const config = {
      method: 'post',
      url: url,
      headers: { 'Content-Type': 'application/json' },
      data: data,
    };
    const response = await axios(config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
      });
    console.log(response);
    return response;
  }
  async function putData(data, url, surveyId) {
    const config = {
      method: 'put',
      url: url + surveyId,
      headers: { 'Content-Type': 'application/json' },
      data: data,
    };
    console.log(config);
    const response = await axios(config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
      });
    console.log(response);
    return response;
  }
  async function handleSubmit(card, mentorId, companyId, url, surveyId) {
    const voteUpd = card === 1 ? { 1: 3, 2: 1, 3: 0 } : { 1: 2, 2: 1, 3: 0 };
    const data = {
      mentor_id: mentorId,
      company_id: companyId,
      vote: voteUpd[vote],
      feedback: feedback === '' ? props.txtA : feedback,
      ranking: ranking,
    };
    if (surveyId) {
      const response = await putData(JSON.stringify(data), url, surveyId);
      if (response) props.element.survey_id = response.data.survey_id;
    } else {
      const response = await sendData(JSON.stringify(data), url);
      if (response) props.element.survey_id = response.data.survey_id;
    }
  }
  function onChange(element, card) {
    setState(!state);
    if (state) {
      setCount((num += 1));
      swt = 1;
      if (card === 2) {
        handleSubmit(
          card,
          element.mentor_id,
          element.company_id,
          companySurveyApi,
          element.survey_id
        );
      } else if (card === 1) {
        handleSubmit(
          card,
          element.mentor_id,
          element.company_id,
          mentorSurveyApi,
          element.survey_id
        );
      }
    } else {
      setCount((num -= 1));
      swt = 2;
    }
    isFlipped(!flip);
    counter = (num * 100) / max;
  }
  useEffect(() => {
    // it controls flip state on application loading
    if (props.btn === 1) {
      setFlag(true);
      isFlipped(false);
      setState(false);
    }
    if (state && props.element.survey_id !== null) {
      setCount((num += 1));
    } else if (!state && props.element.survey_id) {
      setCount((num -= 1));
    }
    counter = (num * 100) / max;
  }, []);

  return (
    <div className='container'>
      {/* Front of the card */}
      <ReactCardFlip isFlipped={!flip} flipDirection='horizontal'>
        <div className='survey-box-front'>
          <Avatar size={80} icon={<UserOutlined />} />
          <span className='names'>{props.meetings}</span>
          <div className='buttons'>
            <Radio.Group buttonStyle='solid' defaultValue={props.vals}>
              <Radio.Button
                className='votes'
                style={{
                  background: '#39C643',
                  borderRadius: '15px 0px 0px 15px',
                }}
                value={1}
                onClick={() => {
                  setFlag(true);
                  setVote(1);
                }}
              >
                <AiOutlineCheckCircle size={15} />
                Want To
              </Radio.Button>
              <Radio.Button
                className='votes'
                style={{ background: '#ff9800' }}
                value={2}
                onClick={() => {
                  setFlag(true);
                  setVote(2);
                }}
              >
                <AiOutlineBulb size={15} />
                Willing
              </Radio.Button>
              <Radio.Button
                className='votes'
                style={{
                  background: '#ff0000',
                  borderRadius: '0px 15px 15px 0px',
                }}
                value={3}
                onClick={() => {
                  setFlag(true);
                  setVote(3);
                }}
              >
                <AiOutlineCloseCircle size={15} />
                Won't
              </Radio.Button>
            </Radio.Group>
          </div>
          <div className='slider'>
            <p className='slidetxt1'>{props.txt}</p>
            <Slider
              min={1}
              max={5}
              marks={marks}
              defaultValue={
                props.c === 1
                  ? props.element.mentorRanking
                  : props.element.companyRanking
              }
              onAfterChange={(value) => {
                setRanking(value);
              }}
            />
          </div>
          <div>
            <p className='slidetxt2'>Please Explain: (Optional)</p>
          </div>
          <textarea
            id={props.meetings}
            className='feedback'
            maxLength='250'
            cols='10'
            rows='5'
            placeholder={'Type here'}
            name='Feedback'
            value={feedback}
            onChange={(e) => {
              console.log(e.target.value);
              setFeedback(e.target.value);
            }}
          />
          <div className='lock'>
            <Button
              className='votes'
              style={{ margin: '0', background: '#39C643' }}
              type='secondary'
              size='large'
              shape='round'
              disabled={flag ? false : true}
              ghost={flag ? false : true}
              onClick={() => {
                onChange(props.element, props.c);
              }}
            >
              {!state ? 'Undo' : 'Submit'}
            </Button>
          </div>
        </div>
        {/* Back of the card */}
        <div className='survey-box-back'>
          <div className='back'>
            <AiOutlineCheckCircle size={100} color={'#39C643'} />
            <p>Thank you for your feedback!</p>
            <Button
              style={{ margin: '0', background: '#39C643' }}
              type='secondary'
              size='large'
              shape='round'
              disabled={flag ? false : true}
              ghost={flag ? false : true}
              onClick={() => {
                onChange();
              }}
            >
              {!state ? 'Undo' : 'Submit'}
            </Button>
          </div>
        </div>
      </ReactCardFlip>
    </div>
  );
}
export default Survey;
