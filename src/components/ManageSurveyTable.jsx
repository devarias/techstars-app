import React, { useState } from 'react';
import { Table, Input, Button, Space, Radio, Form, Modal } from 'antd';
import {
  SearchOutlined,
  ExclamationCircleOutlined,
  CheckSquareFilled,
  CloseSquareFilled,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import '../styles/ModifySurvey.css';

const { confirm } = Modal;

function ManageSurveyTable(props) {
  const [selectTable, setSelectTable] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState({});
  const hasSelected = selectedRowKeys.length > 0;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleChange = (filters) => {
    setFilteredInfo(filters);
  };

  const loadSending = () => {
    confirm({
      title: 'Are you sure you want to send the surveys?',
      icon: <ExclamationCircleOutlined />,
      content: `You are going to send ${selectedRowKeys.length} email surveys.`,
      onOk() {
        setLoading(true);
        setTimeout(() => {
          setSelectedRowKeys([]);
          setLoading(false);
          Modal.success({
            content: 'The survey emails have been sent successfully.',
          });
        }, 2000);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
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
        if (element[`mentorVote`] !== null) {
          totalAnswered++;
        }
        totalSurveys++;
      });
      Row['surveyStatus'] = `${totalAnswered}/${totalSurveys}`;
      Row['totalAnswered'] = totalAnswered;
      Row['totalSurveys'] = totalSurveys;
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
            if (element[`companyVote`] !== null) {
              totalAnswered++;
            }
            totalSurveys++;
          }
        });
        Row['surveyStatus'] = `${totalAnswered}/${totalSurveys}`;
        Row['totalAnswered'] = totalAnswered;
        Row['totalSurveys'] = totalSurveys;
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
        render: (text, record) => {
          return {
            props: {
              style: {
                background:
                  record.totalAnswered < record.totalSurveys
                    ? '#ff5938'
                    : '#4dad45',
                borderRadius: '5px',
                border: '1px solid #1f1f1f',
              },
            },
            children: <div className='data'>{text}</div>,
          };
        },
        filters: [
          {
            text: <CloseSquareFilled className='incomplete' />,
            value: 0,
          },
          {
            text: <CheckSquareFilled className='complete' />,
            value: 1,
          },
        ],
        filteredValue: filteredInfo ? filteredInfo['mentorName'] : null,
        onFilter: (value, record) =>
          record.totalAnswered / record.totalSurveys === value,
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
        render: (text, record) => {
          return {
            props: {
              style: {
                background:
                  record.totalAnswered < record.totalSurveys
                    ? '#ff5938'
                    : '#4dad45',
                borderRadius: '5px',
                border: '1px solid #1f1f1f',
              },
            },
            children: <div className='data'>{text}</div>,
          };
        },
        filters: [
          {
            text: <CloseSquareFilled className='incomplete' />,
            value: 0,
          },
          {
            text: <CheckSquareFilled className='complete' />,
            value: 1,
          },
        ],
        filteredValue: filteredInfo ? filteredInfo['mentorName'] : null,
        onFilter: (value, record) =>
          record.totalAnswered / record.totalSurveys === value,
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
          <Radio.Button
            className='selection'
            value='mentor'
            onClick={handleTableChange}
          >
            Mentors
          </Radio.Button>
          <Radio.Button
            className='selection'
            value='company'
            onClick={handleTableChange}
          >
            Companies
          </Radio.Button>
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
            ? `Selected ${selectedRowKeys.length} ${
                selectTable ? 'mentors' : 'companies'
              }`
            : null}
        </span>
      </div>
      <Table
        rowSelection={{ ...rowSelection }}
        columns={selectTable === true ? mentorColumns : companyColumns}
        dataSource={selectTable === true ? dataMentors : dataCompanies}
        pagination={false}
        onChange={handleChange}
        bordered
        size='middle'
        scroll={{ x: 'calc(300px + 50%)', y: 510 }}
      />
    </div>
  );
}
export default ManageSurveyTable;
