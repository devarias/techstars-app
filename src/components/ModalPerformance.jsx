import React, { useState } from 'react';
import { Modal } from 'antd';
import DemoPie from './DemoPie';
import '../styles/ModalBox.css';

function ModalPerformance(props) {
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

  const showDescription = () => {
    const performance = props.modalContent;

    return (
      <DemoPie
        want={performance.wants}
        will={performance.willing}
        wont={performance.wont}
      />
    );
  };
  return (
    <Modal
      title={`${client} Performance`}
      visible={props.isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <div className='modalBox'>{showDescription()}</div>
    </Modal>
  );
}
export default ModalPerformance;
