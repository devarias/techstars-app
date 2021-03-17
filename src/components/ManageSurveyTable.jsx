import React, { useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import '../styles/ModifySurvey.css';

function ManageSurveyTable(props) {
  const objListRows = [];
  let index = 0;
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasSelected = selectedRowKeys.length > 0;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const loadSending = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 4 }}>
        <Input
          placeholder={'Search Mentor'}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 135, marginBottom: 8, display: 'block' }}
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
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#39C643' : undefined }} />
    ),
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

  const columns = [
    {
      title: `Mentor Name`,
      dataIndex: 'mentorName',
      key: 'mentorName',
      width: 100,
      render: (text) => text,
      sorter: (a, b) => a.mentorName.localeCompare(b.mentorName),
      defaultSortOrder: 'ascend',
      ...getColumnSearchProps('mentorName'),
    },
    {
      title: 'Survey Status',
      dataIndex: 'surveyStatus',
      key: 'surveyStatus',
      width: 100,
      render: (text) => {
        {
        }
      },
    },
  ];

  const getDataSurveys = () => {
    for (const [mentor, result] of Object.entries(props.results[0])) {
      let totalSurveys = 0;
      let totalAnswered = 0;
      const objRow = { key: index++, mentorName: mentor };
      result.forEach((element) => {
        if (element.mentorVote) {
          totalAnswered++;
        }
        totalSurveys++;
      });
      objRow['surveyStatus'] = `${totalAnswered}/${totalSurveys}`;
      objListRows.push(objRow);
    }
    return objListRows;
  };

  const data = getDataSurveys();

  return (
    <div className='modifySurvey'>
      <div style={{ marginBottom: 16 }}>
        <Button
          type='primary'
          onClick={loadSending}
          disabled={!hasSelected}
          loading={loading}
        >
          Send Survey
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
      <Table
        rowSelection={{ ...rowSelection }}
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size='middle'
        scroll={{ x: 'calc(300px + 50%)', y: 510 }}
      />
    </div>
  );
}
export default ManageSurveyTable;
