import React from 'react';
import { Modal } from 'antd';
import { FireFilled } from '@ant-design/icons';
import '../styles/ModalBox.css';

function ModalBox(props) {
  const handleOk = () => {
    props.setIsModalVisible(false);
  };

  const handleCancel = () => {
    props.setIsModalVisible(false);
  };

  let mentorVote = 4;
  let companyVote = 4;
  let mentorRanking = 6;
  let companyRanking = 6;
  let mentorFeedback = 'None';
  let companyFeedback = 'None';
  let matchResult = 5;
  const info = props.modalContent;
  const surveyVotes = ["Won't", 'is Willing', 'Wants', 'Wants', 'is pending'];
  const surveyClass = ['wont', 'willing', 'want', 'want', 'pending'];
  const codeColor = [
    'notMatch',
    'willing',
    'goodMatch',
    'strongMatch',
    'perfectMatch',
    'pending',
  ];

  if (info.mentorVote !== null) {
    mentorVote = info.mentorVote;
    mentorRanking = info.mentorRanking;
    mentorFeedback = info.mentorFeedback;
  }
  if (info.companyVote !== null) {
    companyVote = info.companyVote;
    companyRanking = info.companyRanking;
    companyFeedback = info.companyFeedback;
  }
  if (info.matchResult !== null) {
    if (info.matchResult === 6) {
      matchResult = 4;
    } else {
      matchResult = info.matchResult;
    }
  }

  return (
    <>
      <Modal
        title='Result Summary'
        visible={props.isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className='modalBox'>
          <FireFilled className={`${codeColor[matchResult]} modalFireball`} />
          <p>
            <b>{props.mentorName}</b>{' '}
            <span className={surveyClass[mentorVote]}>
              {surveyVotes[mentorVote]}
            </span>{' '}
            to lead {info.company}.<br />
            The score of how prepared is{' '}
            <span className={codeColor[mentorRanking - 1]}>
              {mentorRanking === 6 ? 'None' : mentorRanking}
            </span>
            .<br />
            The feedback is:
            <br />
            <span>{mentorFeedback}</span>
          </p>
          <p>
            <b>{info.company}</b>{' '}
            <span className={surveyClass[companyVote]}>
              {surveyVotes[companyVote]}
            </span>{' '}
            to be mentored by {props.mentorName}.<br />
            The score of helpfulness is{' '}
            <span className={codeColor[companyRanking - 1]}>
              {companyRanking === 6 ? 'None' : companyRanking}
            </span>
            .<br />
            The feedback is:
            <br />
            <span>{companyFeedback}</span>
          </p>
        </div>
      </Modal>
    </>
  );
}
export default ModalBox;
