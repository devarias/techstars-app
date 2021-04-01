import React, { useState } from 'react';
import { Table, Button, Form } from 'antd';
import ModalPerformance from './ModalPerformance';
import '../styles/ModifySurvey.css';

function Performance(props) {
  const [selectTable, setSelectTable] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const handleTableChange = () => {
    setSelectTable(!selectTable);
  };

  const handleModal = (performanceInfo) => {
    setModalContent(performanceInfo);
    setIsModalVisible(true);
  };

  const companyColumns = [
    {
      title: <div className='data'>Company Name</div>,
      dataIndex: `companyName`,
      key: `companyName`,
      width: 100,
      render: (text) => <div className='data'>{text}</div>,
    },
    {
      title: <div className='data'> Company Performance</div>,
      dataIndex: 'performance',
      key: 'performance',
      width: 100,
      render: (value, record) => (
        <div
          onClick={() => handleModal(record)}
          className={'data ' + (value < 50 ? 'poor' : 'good')}
        >
          {value} %
        </div>
      ),
    },
  ];

  const getCompanyData = () => {
    const objListRows = [];
    let index = 0;
    for (const [company, value] of Object.entries(props.companyResults)) {
      if (value.performance) {
        let Row = {
          key: index++,
          companyName: company,
          ...value,
        };
        objListRows.push(Row);
      }
    }
    return objListRows;
  };

  const mentorColumns = [
    {
      title: <div className='data'>Mentor Name</div>,
      dataIndex: `mentorName`,
      key: `mentorName`,
      width: 100,
      render: (text) => <div className='data'>{text}</div>,
    },
    {
      title: <div className='data'>Mentor Performance</div>,
      dataIndex: 'performance',
      key: 'performance',
      width: 100,
      render: (value, record) => (
        <div
          onClick={() => handleModal(record)}
          className={'data ' + (value < 50 ? 'poor' : 'good')}
        >
          {value} %
        </div>
      ),
    },
  ];

  const getMentorData = () => {
    const objListRows = [];
    let index = 0;
    for (const [mentor, value] of Object.entries(props.mentorResults)) {
      if (value.performance) {
        let Row = {
          key: index++,
          mentorName: mentor,
          ...value,
        };
        objListRows.push(Row);
      }
    }
    return objListRows;
  };

  const dataCompanies = getCompanyData();
  const dataMentors = getMentorData();

  return (
    <div className='modifySurvey'>
      <div className='surveyButtons'>
        <Form.Item label='Table selection'>
          <Button
            className='selection'
            value='mentor'
            onClick={handleTableChange}
          >
            Mentors
          </Button>
          <Button
            className='selection'
            value='company'
            onClick={handleTableChange}
          >
            Companies
          </Button>
        </Form.Item>
        <ModalPerformance
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          modalContent={modalContent}
        />
      </div>
      <Table
        columns={selectTable ? mentorColumns : companyColumns}
        dataSource={selectTable ? dataMentors : dataCompanies}
        pagination={false}
        bordered
        size='middle'
        scroll={{ x: 'calc(300px + 50%)', y: 510 }}
      />
    </div>
  );
}

export default Performance;
