import React, { useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { FireFilled, SearchOutlined } from '@ant-design/icons';
import ModalBox from './ModalBox';
import Highlighter from 'react-highlight-words';

function TableResults(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rowMentor, setRowMentor] = useState(0);
  const [modalContent, setModalContent] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [filteredInfo, setFilteredInfo] = useState({});
  let objIndex = 0;

  const handleModal = (company, value) => {
    const resultIndex = props.results[0][rowMentor].findIndex(
      (obj) => obj.company === company && obj.matchResult === value
    );
    setModalContent(props.results[0][rowMentor][resultIndex]);
    setIsModalVisible(true);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleChange = (filters, sorter) => {
    setFilteredInfo(filters);
  };

  const clearFilters = () => {
    setFilteredInfo(null);
    setSearchText('');
  };

  const getData = (results) => {
    const array = [];
    for (const [mentor, result] of Object.entries(results[0])) {
      if (result.some((obj) => obj['meetingDone'])) {
        const finalObj = { key: objIndex++, mentorName: mentor };
        result.forEach((element) => {
          if (element.meetingDone) {
            finalObj[element.company] = element.matchResult;
          }
        });
        array.push(finalObj);
      }
    }
    return array;
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

  const columns = props.company.map((obj, i) => {
    return {
      title: obj.company,
      dataIndex: obj.company,
      width: 150,
      render: (value) => {
        if (value !== undefined) {
          const codeColor = [
            'notMatch',
            'willing',
            'goodMatch',
            'strongMatch',
            'perfectMatch',
          ];
          let classColor;
          codeColor.forEach((vote, index) =>
            index === value
              ? (classColor = vote)
              : value === 6
              ? (classColor = codeColor[4])
              : null
          );
          return (
            <FireFilled
              onClick={() => handleModal(obj.company, value)}
              className={`${classColor} fireball`}
            />
          );
        }
      },
      filters: [
        {
          text: <FireFilled className='perfectMatch' />,
          value: 6,
        },
        {
          text: <FireFilled className='strongMatch' />,
          value: 3,
        },
        {
          text: <FireFilled className='goodMatch' />,
          value: 2,
        },
        {
          text: <FireFilled className='willing' />,
          value: 1,
        },
        {
          text: <FireFilled className='notMatch' />,
          value: 0,
        },
        {
          text: <FireFilled className='pending' />,
          value: null,
        },
      ],
      filteredValue: filteredInfo ? filteredInfo[obj.company] : null,
      onFilter: (value, record) => record[obj.company] === value,
      sorter: (a, b) => {
        if (b[obj.company] === null && a[obj.company] === undefined) {
          return 1;
        } else if (b[obj.company] === undefined && a[obj.company] === null) {
          return -1;
        } else if (a[obj.company] === null || a[obj.company] === undefined) {
          return 1;
        } else if (b[obj.company] === null || b[obj.company] === undefined) {
          return -1;
        } else if (
          (a[obj.company] === null && b[obj.company] === null) ||
          (b[obj.company] === undefined && a[obj.company] === undefined)
        ) {
          return 0;
        } else {
          return b[obj.company] - a[obj.company];
        }
      },
    };
  });

  columns.unshift({
    title: 'Mentor Name',
    dataIndex: 'mentorName',
    fixed: true,
    width: 150,
    render: (value) => value,
    sorter: (a, b) => a.mentorName.localeCompare(b.mentorName),
    ...getColumnSearchProps('mentorName'),
  });

  const data = getData(props.results);

  return (
    <>
      <Space style={{ marginLeft: 30, justifyContent: 'left' }}>
        <Button onClick={clearFilters}>Clear filters</Button>
      </Space>
      <ModalBox
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        modalContent={modalContent}
        mentorName={rowMentor}
      />
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        onChange={handleChange}
        onRow={(record) => ({
          onMouseEnter: () => {
            setRowMentor(record.mentorName);
          },
        })}
        scroll={{ x: 'calc(700 + 50%)', y: 450 }}
      />
    </>
  );
}
export default TableResults;
