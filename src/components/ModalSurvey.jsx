import React from 'react';
import { Modal } from 'antd';
import '../styles/ModalBox.css';

function ModalSurvey(props) {
  const handleOk = () => {
    props.setIsModalVisible(false);
  };

  const handleCancel = () => {
    props.setIsModalVisible(false);
  };

  const showDescription = () => {
    let answeredArray = props.modalContent.answered.map((element) => (
      <li>{element}</li>
    ));
    let pendingArray = props.modalContent.total.filter((element) => {
      if (!props.modalContent.answered.includes(element)) {
        return <li>{element}</li>;
      }
    });
    console.log(pendingArray);
    if (!answeredArray.length) {
      answeredArray = 'No surveys has been answered!';
    }
    if (!pendingArray.length) {
      pendingArray = 'There is no pending surveys. All have been answered!';
    }

    return (
      <>
        <h3>{props.modalContent.client}</h3>
        <h4>The pending surveys to be answered are</h4>
        {pendingArray instanceof Array ? (
          <ul className='pending'>
            <li>{pendingArray}</li>
          </ul>
        ) : (
          pendingArray
        )}
        <br />
        <br />
        <h4>The following surveys have been answered</h4>
        {answeredArray instanceof Array ? (
          <ul className='answered'>{answeredArray}</ul>
        ) : (
          answeredArray
        )}
      </>
    );
  };

  console.log(props.modalContent);
  return (
    <Modal
      title='Survey status description.'
      visible={props.isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <div className='modalBox'>
        {props.modalContent.client ? showDescription() : null}
      </div>
    </Modal>
  );
}
export default ModalSurvey;
