import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import DemoPie from './DemoPie';
import '../styles/ModalBox.css';

function ModalPerformance(props) {

  const performance = props.modalContent;

  let client = '';
  if (props.modalContent.companyName) {
    client = props.modalContent.companyName;
  } else {
    client = props.modalContent.mentorName;
  }

  const handleOk = () => {
    props.setIsModalVisible(false);
  };

  const handleCancel = () => {
    props.setIsModalVisible(false);
  };

  return ( 
    <Modal
      title={`${client} Performance`}
      visible={props.isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <div className='modalBox chart'>
      <p>The performance of {client} is 
      <span className={props.modalContent.performance < 50 ? 'poor' : 'good'}> {props.modalContent.performance} %</span> 
      </p>
      <p>Below a summary of the votes {client} received</p>
        <DemoPie
        want={performance.wants}
        will={performance.willing}
        wont={performance.wont}
      />
      </div>
    </Modal>
  );
}
export default ModalPerformance;
