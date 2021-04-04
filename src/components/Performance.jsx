import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Table, Button, Form, Input, Space, Tag} from 'antd';
import ModalPerformance from './ModalPerformance';
import Highlighter from 'react-highlight-words';
import '../styles/ModifySurvey.css';

function Performance(props) {
  const [selectTable, setSelectTable] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sorteredInfo, setSorteredInfo] = useState({});

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const handleChange = (pagination, filters, sorter) => {
    setSorteredInfo(sorter)
    setFilteredInfo(filters)
  };

  const handleTableChange = () => {
    setFilteredInfo(null);
    setSorteredInfo({})
    setSearchText('');
    setSelectTable(!selectTable);
  };

  const handleModal = (performanceInfo) => {
    setModalContent(performanceInfo);
    setIsModalVisible(true);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 4 }}>
        <Input
          placeholder={selectTable ? 'Search Mentor' : 'Select Company'}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 187, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#39C643' : undefined }} />
    ),
    filteredValue: filteredInfo ? filteredInfo[dataIndex] : null,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#39C643',
            padding: 0,
            opacity: 0.6,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const getColumns = (client) => {
    const title = (client === 'mentor' ? 'Mentor' : 'Company')
    return (
      [
        {
          title: <div className='data'>{title} Name</div>,
          dataIndex: `${client}Name`,
          key: `${client}Name`,
          width: 100,
          render: (text) => <span className='data'>{text}</span>,
          ...getColumnSearchProps(`${client}Name`)
        },
        {
          title: <div className='data'>{title} Performance</div>,
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
          filters: [
              {
                text: <Tag color='green' key='more popular'>MORE POPULAR</Tag>,
                value: true,
              },
              {
                text: <Tag color='volcano' key='less popular'>LESS POPULAR</Tag>,
                value: false,
              },
            ],
            filteredValue: filteredInfo ? filteredInfo['performance'] : null,
            onFilter: (value, record) => record.performance > 49 === value,
            sorter: (a, b) => a.performance - b.performance,
            sortOrder: sorteredInfo.columnKey === 'performance' && sorteredInfo.order,
        },
      ]
    )
  };

  const getData = (client, results) => {
    const objListRows = [];
    let index = 0;
    for (const [key, value] of Object.entries(results)) {
      if (value.performance !== null) {
        let Row = {
          key: index++,
          [client + 'Name']: key,
          ...value,
        };
        objListRows.push(Row);
      }
    }
    return objListRows;
  };

  const mentorColumns = getColumns('mentor');
  const companyColumns = getColumns('company');
  const dataCompanies = getData('company', props.companyResults);
  const dataMentors = getData('mentor', props.mentorResults);

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
        onChange={handleChange}
        bordered
        size='middle'
        scroll={{ x: 'calc(300px + 50%)', y: 510 }}
      />
    </div>
  );
}

export default Performance;
