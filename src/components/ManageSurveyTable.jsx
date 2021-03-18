import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Radio, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import '../styles/ModifySurvey.css';

function ManageSurveyTable(props) {
  const [selectTable, setSelectTable] = useState(true);
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

  const handleTableChange = () => {
    setSelectTable(!selectTable);
    console.log(selectTable);
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

  const getMentorSurvey = () => {
    const objListRows = [];
    let index = 0;
    for (const [mentor, result] of Object.entries(props.results[0])) {
      let totalSurveys = 0;
      let totalAnswered = 0;
      const Row = {};
      Row.key = index++;
      Row.mentorName = mentor;
      result.forEach((element) => {
        if (element[`mentorVote`]) {
          totalAnswered++;
        }
        totalSurveys++;
      });
      Row['surveyStatus'] = `${totalAnswered}/${totalSurveys}`;
      objListRows.push(Row);
    }
    console.log(objListRows);
    return objListRows;
  };

  const getCompanySurvey = () => {
    const objListRows = [];
    const companyArray = [];
    let index = 0;
    for (const result of Object.values(props.results[0])) {
      companyArray.push(...result);
    }
    companyArray.forEach((obj) => {
      let totalSurveys = 0;
      let totalAnswered = 0;
      let Row = '';
      if (!objListRows.some((item) => item.companyName === obj.company)) {
        Row = { key: index++, companyName: obj.company };
        companyArray.forEach((element) => {
          if (element.company === Row.companyName) {
            if (element[`companyVote`]) {
              totalAnswered++;
            }
            totalSurveys++;
          }
        });
        Row['surveyStatus'] = `${totalAnswered}/${totalSurveys}`;
        objListRows.push(Row);
      }
    });
    return objListRows;
  };

  const getMentorColumns = () => {
    return [
      {
        title: `Mentor Name`,
        dataIndex: `mentorName`,
        key: `mentorName`,
        width: 100,
        render: (text) => <div className='data'>{text}</div>,
        ...getColumnSearchProps(`mentorName`),
      },
      {
        title: 'Survey Status',
        dataIndex: 'surveyStatus',
        key: 'surveyStatus',
        width: 100,
        render: (text) => <div className='data'>{text}</div>,
      },
    ];
  };

  const getCompanyColumns = () => {
    return [
      {
        title: `Company Name`,
        dataIndex: `companyName`,
        key: `companyName`,
        width: 100,
        render: (text) => <div className='data'>{text}</div>,
        ...getColumnSearchProps(`companyName`),
      },
      {
        title: 'Survey Status',
        dataIndex: 'surveyStatus',
        key: 'surveyStatus',
        width: 100,
        render: (text) => <div className='data'>{text}</div>,
      },
    ];
  };

  const dataCompanies = getCompanySurvey();
  const dataMentors = getMentorSurvey();
  const mentorColumns = getMentorColumns();
  const companyColumns = getCompanyColumns();
  console.log(selectTable);

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
        <Button
          className='sendButton'
          type='primary'
          onClick={loadSending}
          disabled={!hasSelected}
          loading={loading}
        >
          Send Survey
        </Button>
        <span>
          {hasSelected
            ? `Selected ${selectedRowKeys.length} ${selectTable}s`
            : ''}
        </span>
      </div>
      <Table
        rowSelection={{ ...rowSelection }}
        columns={selectTable === true ? mentorColumns : companyColumns}
        dataSource={selectTable === true ? dataMentors : dataCompanies}
        pagination={false}
        bordered
        size='middle'
        scroll={{ x: 'calc(300px + 50%)', y: 510 }}
      />
    </div>
  );
}
export default ManageSurveyTable;
