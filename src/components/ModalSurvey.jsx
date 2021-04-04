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
    let answeredArray = props.modalContent.answered.map(elementAnswer => <li>{elementAnswer}</li>);
    let pendingArray = props.modalContent.total.filter(elementPending => 
      !props.modalContent.answered.includes(elementPending)).map(elementPending => <li>{elementPending}</li>);

    console.log(pendingArray)
    if (!answeredArray.length) {
      answeredArray = 'No surveys has been answered!';
    }
    if (!pendingArray.length) {
      pendingArray = 'There is no pending surveys. All have been answered!\n';
    }

    return (
      <>
        <h3>{props.modalContent.client}</h3>
        <h4>The pending surveys to be answered are</h4>
        {pendingArray instanceof Array ? 
          (
            <ul className='pending'>
              {pendingArray}
            </ul>
          ) : <p>{pendingArray}</p>
        }
        <br />
        <h4>The following surveys have been answered</h4>
        {answeredArray instanceof Array ? 
          (
            <ul className='answered'>
              {answeredArray}
            </ul>
          ) : <p>{answeredArray}</p>
        }
      </>
    );
  };

  return (
    <Modal
      title='Survey status description'
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
