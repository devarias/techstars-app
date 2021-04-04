import React, { useState } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Form,
  Modal,
  Progress,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  ExclamationCircleOutlined,
  CheckSquareFilled,
  CloseSquareFilled,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ModalSurvey from './ModalSurvey';
import '../styles/ModifySurvey.css';

const { confirm } = Modal;
const mentorsApi = 'https://techstars-api.herokuapp.com/api/reminder/mentors/';

function ManageSurveyTable(props) {
  const [selectTable, setSelectTable] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [sorteredInfo, setSorteredInfo] = useState({});
  const hasSelected = selectedRows.length > 0;

  const rowSelection = {
    selectedRows,
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(
        selectedRows.map((item) => item.mentorName || item.companyName)
      );
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.totalAnswered.length === record.totalSurveys.length,
    })
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSorteredInfo(sorter);
  };

  const handleModal = (client, answered, total) => {
    setModalContent({ client: client, answered: answered, total: total });
    setIsModalVisible(true);
  };

  const handleTableChange = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
    setFilteredInfo(null)
    setSorteredInfo({})
    setSearchText('');
    setSelectTable(!selectTable);
  };

  const sendReminder = async (rowArray) => {
    const resultReminder = await fetch(mentorsApi, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(rowArray),
    });
    if (!resultReminder.ok) {
      throw new Error();
    }

    return resultReminder.json();
  };

  const loadSending = () => {
    confirm({
      title: 'Are you sure you want to send the surveys?',
      icon: <ExclamationCircleOutlined />,
      content: `You are going to send ${selectedRows.length} email surveys.`,
      onOk() {
        setLoading(true);
        setTimeout(async () => {
          const reminder = await sendReminder(selectedRows).catch((error) => {
            Modal.error({
              content: 'The survey emails could not be sent.',
            });
          });
          if (reminder) {
            Modal.success({
              content: 'The survey emails have been sent successfully.',
            });
          }
          setSelectedRows([]);
          setSelectedRowKeys([]);
          setLoading(false);
        }, 2000);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
      <div style={{ padding: 4 }}>
        <Input
          placeholder={'Search Mentor'}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
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

  const getSurvey = (client, results) => {
    
    const objListRows = [];
    let index = 0;
    for (const [key, value] of Object.entries(results)) {
      if (value.some((obj) => obj.meetingDone)) {
        let totalSurveys = [];
        let totalAnswered = [];
        const Row = { key: index++, [`${client}Name`]: key };
        value.forEach((element) => {
          if (element.meetingDone) {
            if (element.mentorVote !== null) {
              totalAnswered.push(element[client === 'mentor'? 'company' : 'mentor']);
            }
            totalSurveys.push(element[client === 'mentor'? 'company' : 'mentor']);
          }
        });
        Row['totalAnswered'] = totalAnswered;
        Row['totalSurveys'] = totalSurveys;
        objListRows.push(Row);
      }
    }
    return objListRows;
  };

  const getColumns = (client) => {
    const title = (client === 'mentor' ? 'Mentor' : 'Company')
    return [
      {
        title: <div className='data'>{title} Name</div>,
        dataIndex: `${client}Name`,
        key: `${client}Name`,
        width: 100,
        render: (text) => <div className='data'>{text}</div>,
        ...getColumnSearchProps(`${client}Name`),
      },
      {
        title: <div className='data'>Survey Tracking</div>,
        dataIndex: 'surveyStatus',
        key: 'surveyStatus',
        width: 100,
        render: (text, record) => {
          const answered = record.totalAnswered.length;
          const total = record.totalSurveys.length;
          const percent = parseInt((answered * 100) / total);
          const tooltip = `Total number survey answered: ${answered} Total Surveys: ${total}`;
          return (
            <Tooltip title={tooltip}>
              <Progress
                onClick={() =>
                  handleModal(
                    record[`${client}Name`],
                    record.totalAnswered,
                    record.totalSurveys
                  )
                }
                percent={percent}
                status={percent !== 100 ? 'active' : 'normal'}
                strokeColor={answered === total ? '#37fa3a' : '#fa3a37'}
              />
            </Tooltip>
          );
        },
        filters: [
          {
            text: <><CloseSquareFilled className='incomplete' />Incomplete</>,
            value: 0,
          },
          {
            text: <><CheckSquareFilled className='complete' />Complete </>,
            value: 1,
          },
        ],
        filteredValue: filteredInfo ? filteredInfo[`surveyStatus`] : null,
        onFilter: (value, record) => Math.floor(record.totalAnswered.length / record.totalSurveys.length) === value,
        sorter: (a, b) => {
          const answeredA = a.totalAnswered.length;
          const totalA = a.totalSurveys.length;
          const percentA = parseInt((answeredA * 100) / totalA);
          const answeredB = b.totalAnswered.length;
          const totalB = b.totalSurveys.length;
          const percentB = parseInt((answeredB * 100) / totalB);
          return percentA - percentB;
        },
        sortOrder: sorteredInfo.columnKey === 'surveyStatus' && sorteredInfo.order,
      },
    ];
  };

  const dataCompanies = getSurvey('company', props.companyResults[0]);
  const dataMentors = getSurvey('mentor', props.mentorResults[0]);
  const mentorColumns = getColumns('mentor');
  const companyColumns = getColumns('company');

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
          Send Reminder
        </Button>
        <ModalSurvey
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          modalContent={modalContent}
        />
      </div>
      <Table
        rowSelection={rowSelection}
        columns={selectTable ? mentorColumns : companyColumns}
        dataSource={selectTable ? dataMentors : dataCompanies}
        pagination={false}
        onChange={handleChange}
        bordered
        scroll={{ x: 'calc(300px + 50%)', y: 510 }}
      />
    </div>
  );
}
export default ManageSurveyTable;
