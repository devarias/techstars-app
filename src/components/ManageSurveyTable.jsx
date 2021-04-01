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
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleChange = (filters) => {
    setFilteredInfo(filters);
  };

  const handleModal = (client, answered, total) => {
    setModalContent({ client: client, answered: answered, total: total });
    setIsModalVisible(true);
  };

  const handleTableChange = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
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
    console.log(resultReminder.status);
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
          console.log(selectedRows);
          const reminder = await sendReminder(selectedRows).catch((error) => {
            Modal.error({
              content: 'The survey emails could not be sent.',
            });
          });
          if (reminder) {
            Modal.success({
              content: 'The survey emails have been sent successfully.',
            });
            console.log(reminder);
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
    for (const [mentor, result] of Object.entries(props.mentorResults[0])) {
      if (result.some((obj) => obj.meetingDone)) {
        let totalSurveys = [];
        let totalAnswered = [];
        const Row = {};
        Row.key = index++;
        Row.mentorName = mentor;
        result.forEach((element) => {
          if (element.meetingDone) {
            if (element.mentorVote !== null) {
              totalAnswered.push(element.company);
            }
            totalSurveys.push(element.company);
          }
        });
        Row['surveyStatus'] = `${totalAnswered.length}/${totalSurveys.length}`;
        Row['totalAnswered'] = totalAnswered;
        Row['totalSurveys'] = totalSurveys;
        objListRows.push(Row);
      }
    }
    return objListRows;
  };

  const getCompanySurvey = () => {
    const objListRows = [];
    let index = 0;
    for (const [company, value] of Object.entries(props.companyResults[0])) {
      let totalSurveys = [];
      let totalAnswered = [];
      const Row = { key: index++, companyName: company };
      value.forEach((element) => {
        if (element.meetingDone) {
          if (element.companyVote !== null) {
            totalAnswered.push(element.mentor);
          }
          totalSurveys.push(element.mentor);
        }
      });
      Row['surveyStatus'] = `${totalAnswered.length}/${totalSurveys.length}`;
      Row['totalAnswered'] = totalAnswered;
      Row['totalSurveys'] = totalSurveys;
      objListRows.push(Row);
    }

    return objListRows;
  };

  const getMentorColumns = () => {
    return [
      {
        title: <div className='data'>Mentor Name</div>,
        dataIndex: `mentorName`,
        key: `mentorName`,
        width: 100,
        render: (text) => <div className='data'>{text}</div>,
        ...getColumnSearchProps(`mentorName`),
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
                    record.mentorName,
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
        title: <div className='data'>Company Name</div>,
        dataIndex: `companyName`,
        key: `companyName`,
        width: 100,
        render: (text) => <div className='data'>{text}</div>,
        ...getColumnSearchProps(`companyName`),
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
                    record.companyName,
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
