import React, { useState } from 'react';
import { Modal, Button, Slider } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
function TutorialMent() {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const marks = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: { style: { color: '#39C463' }, label: <strong>5</strong> },
  };

  return (
    <>
      <Button onClick={showModal}>
        <QuestionCircleOutlined style={{ fontSize: '20px' }} />
      </Button>
      <Modal
        centered='true'
        title='Survey filling instructions'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={handleOk}>
            Got it
          </Button>,
        ]}
      >
        <p>Hit if you want to be mentored by the person displayed on card</p>
        <button className='button1'>Want To</button>
        <p>
          Hit if you are willing to be mentored by the person displayed on card
        </p>
        <button className='button2'>Willing</button>
        <p>
          Hit if you do not want to be mentored by the person displayed on card
        </p>
        <button className='button3'>Won't</button>
        <p>
          From 1 = Lowest to 5 = Highest evaluate mentor helpfulness by dragging
          handle
        </p>
        <Slider min={1} max={5} marks={marks} defaultValue={3} />
      </Modal>
    </>
  );
}

export default TutorialMent;
