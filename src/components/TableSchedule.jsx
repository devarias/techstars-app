import React, { useEffect, useState, useCallback, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { Table, Input, Button, Space, Select, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { CSVDownloader, jsonToCSV } from 'react-papaparse';
import CellPopUp from '../parts/CellPopOver';
import CancelAllPopUp from '../parts/cancelAllPopUp';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Option } = Select;

const type = 'DragableBodyCell';

const colors = [
  '#483D8B',
  '#8FBC8F',
  '#E9967A',
  '#8B0000',
  '#9932CC',
  '#FF8C00',
  '#4B0082',
  '#008000',
  '#808080',
  '#c9db00',
  '#008080',
];

const sorter = {
  // "sunday": 0, // << if sunday is first day of week
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

/**
 * TableSchedule is the component to generate the data table for the schedule.
 * @resSchedule: is the information retrieved form the back-end to generate the scheduling table
 * the request is done on the UploadFile.jsx
 */
const TableSchedule: React.FC = ({
  resSchedule,
  companies,
  tableDisplay,
  setRechargeMeetings,
  setResSchedule,
}) => {
  /* FilteredInfo handles the mentors and days to be filtered */
  const [filteredInfo, setFilteredInfo] = useState({});
  /* SortedInfo handles the information for sorting the mentor column */
  const [sortedInfo, setSortedInfo] = useState({});
  /* Wrangling the recieved data to generate the list to filter the mentors and the days*/
  const [view, setView] = useState(2);
  /* state to higlight the text for the searched colum using text search */
  const [searchText, setSearchText] = useState('');
  /* searched column state for input text filters */
  const [searchedColumn, setSearchedColumn] = useState('');
  /* Input text for the searched column */
  const [searchInput, setSearchInput] = useState('');
  
   const mentor_all = resSchedule.map((obj) => {
    return { text: obj.Mentor, value: obj.Mentor };
  });

  const mentor_am_filter = resSchedule.filter((obj) => {
    return obj.Block === 'AM';
  });

  const mentor_am = mentor_am_filter.map((obj) => {
    return { text: obj.Mentor, value: obj.Mentor };
  });

  const mentor_pm_filter = resSchedule.filter((obj) => {
    return obj.Block === 'PM';
  });

  const mentor_pm = mentor_pm_filter.map((obj) => {
    return { text: obj.Mentor, value: obj.Mentor };
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const days_filter = days.map((day) => {
    return { text: day, value: day };
  });

  const list_comp = companies.map((obj) => {
    return obj.company;
  });

  const list_comp_colors = list_comp.map((comp, index) => {
    let col = colors[index];
    return { company: comp, color: col };
  });
  
  /* Function to search with a input text for coincidences on mentors columns */
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            setSearchInput(node);
          }}
          placeholder={`Search ${dataIndex}`}
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
          <Button
            onClick={() => handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput, 100);
      }
    },
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const AM = [
    {
      title: 'Mentor',
      dataIndex: 'Mentor',
      key: 'Mentor',
      /* filters: mentor_am.sort(function (a, b) {
        let nameA = a.text.toUpperCase(); // ignore upper and lowercase
        let nameB = b.text.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      }), */
      ...getColumnSearchProps('Mentor'),
      sorter: (a, b) => {
        let nameA = a.Mentor.toUpperCase(); // ignore upper and lowercase
        let nameB = b.Mentor.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      },
      sortOrder: sortedInfo.columnKey === 'Mentor' && sortedInfo.order,
      filteredValue: filteredInfo?.['Mentor'] || null,
      onFilter: (value, record) => record.Mentor.indexOf(value) === 0,
      render: (text, record) => {
        return cancelMentor(text, record);
      },
      width: 150,
      background: '#FFFFFF',
      fixed: 'left',
      align: 'left',
    },
    {
      title: 'Day',
      dataIndex: 'Day',
      key: 'Day',
      filters: days_filter,
      filteredValue: filteredInfo?.Day || null,
      sorter: (a, b) => {
        let day1 = a.Day.toLowerCase();
        let day2 = b.Day.toLowerCase();
        return sorter[day1] - sorter[day2];
      },
      sortOrder: sortedInfo.columnKey === 'Day' && sortedInfo.order,
      onFilter: (value, record) => record.Day.indexOf(value) === 0,
      width: 100,
      fixed: 'left',
      align: 'left',
    },
    {
      title: '08:00',
      dataIndex: '08:00:00',
      key: '08:00:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('08:00:00'),
      filteredValue: filteredInfo?.['08:00:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '08:20',
      dataIndex: '08:20:00',
      key: '08:20:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('08:20:00'),
      filteredValue: filteredInfo?.['08:20:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '08:40',
      dataIndex: '08:40:00',
      key: '08:40:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('08:40:00'),
      filteredValue: filteredInfo?.['08:40:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '09:00',
      dataIndex: '09:00:00',
      key: '09:00:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('09:00:00'),
      filteredValue: filteredInfo?.['09:00:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '09:20',
      dataIndex: '09:20:00',
      key: '09:20:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('09:20:00'),
      filteredValue: filteredInfo?.['09:20:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '09:40',
      dataIndex: '09:40:00',
      key: '09:40:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('09:40:00'),
      filteredValue: filteredInfo?.['09:40:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '10:00',
      dataIndex: '10:00:00',
      key: '10:00:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('10:00:00'),
      filteredValue: filteredInfo?.['10:00:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '10:20',
      dataIndex: '10:20:00',
      key: '10:20',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('10:20:00'),
      filteredValue: filteredInfo?.['10:20:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '10:40',
      dataIndex: '10:40:00',
      key: '10:40:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('10:40:00'),
      filteredValue: filteredInfo?.['10:40:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '11:00',
      dataIndex: '11:00:00',
      key: '11:00:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('11:00:00'),
      filteredValue: filteredInfo?.['11:00:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '11:20',
      dataIndex: '11:20:00',
      key: '11:20:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('11:20:00'),
      filteredValue: filteredInfo?.['11:20:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '11:40',
      dataIndex: '11:40:00',
      key: '11:40:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('11:40:00'),
      filteredValue: filteredInfo?.['11:40:00'] || null,
      align: 'center',
      width: 130,
    },
  ];

  /* Description of the Columns for the PM block table */
  const PM = [
    {
      title: 'Mentor',
      dataIndex: 'Mentor',
      key: 'Mentor',
      filters: mentor_pm.sort(function (a, b) {
        var nameA = a.text.toUpperCase(); // ignore upper and lowercase
        var nameB = b.text.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      }),
      sorter: (a, b) => {
        let nameA = a.Mentor.toUpperCase(); // ignore upper and lowercase
        let nameB = b.Mentor.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      },
      ...getColumnSearchProps('Mentor'),
      sortOrder: sortedInfo.columnKey === 'Mentor' && sortedInfo.order,
      filteredValue: filteredInfo?.Mentor || null,
      onFilter: (value, record) => record.Mentor.indexOf(value) === 0,
      render(text, record) {
        return cancelMentor(text, record);
      },
      sortOrder: sortedInfo.columnKey === 'Mentor' && sortedInfo.order,
      width: 150,
      fixed: 'left',
      align: 'left',
    },
    {
      title: 'Day',
      dataIndex: 'Day',
      key: 'Day',
      filters: days_filter,
      filteredValue: filteredInfo?.Day || null,
      sorter: (a, b) => {
        let day1 = a.Day.toLowerCase();
        let day2 = b.Day.toLowerCase();
        return sorter[day1] - sorter[day2];
      },
      sortOrder: sortedInfo.columnKey === 'Day' && sortedInfo.order,
      onFilter: (value, record) => record.Day.indexOf(value) === 0,
      width: 100,
      fixed: 'left',
      align: 'left',
    },
    {
      title: '13:10',
      dataIndex: '13:10:00',
      key: '13:10:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('13:10:00'),
      filteredValue: filteredInfo?.['13:10:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '13:30',
      dataIndex: '13:30:00',
      key: '13:30:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('13:30:00'),
      filteredValue: filteredInfo?.['13:30:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '13:50',
      dataIndex: '13:50:00',
      key: '13:50:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('13:50:00'),
      filteredValue: filteredInfo?.['13:50:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '14:10',
      dataIndex: '14:10:00',
      key: '14:00:10',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('14:10:00'),
      filteredValue: filteredInfo?.['14:10:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '14:30',
      dataIndex: '14:30:00',
      key: '14:30:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('14:30:00'),
      filteredValue: filteredInfo?.['14:30:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '14:50',
      dataIndex: '14:50:00',
      key: '14:50:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('14:50:00'),
      filteredValue: filteredInfo?.['14:50:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '15:10',
      dataIndex: '15:10:00',
      key: '15:10:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('15:10:00'),
      filteredValue: filteredInfo?.['15:10:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '15:30',
      dataIndex: '15:30:00',
      key: '15:30:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('15:30:00'),
      filteredValue: filteredInfo?.['15:30:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '15:50',
      dataIndex: '15:50:00',
      key: '15:50:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('15:50:00'),
      filteredValue: filteredInfo?.['15:50:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '16:10',
      dataIndex: '16:10:00',
      key: '16:10:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('16:10:00'),
      filteredValue: filteredInfo?.['16:10:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '16:30',
      dataIndex: '16:30:00',
      key: '16:30:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('16:30:00'),
      filteredValue: filteredInfo?.['16:30:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '16:50',
      dataIndex: '16:50:00',
      key: '16:50:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('16:50:00'),
      filteredValue: filteredInfo?.['16:50:00'] || null,
      align: 'center',
      width: 130,
    },
  ];

  const AllColumns = [
    {
      title: 'Mentor',
      dataIndex: 'Mentor',
      key: 'Mentor',
      filters: mentor_all.sort(function (a, b) {
        let nameA = a.text.toUpperCase(); // ignore upper and lowercase
        let nameB = b.text.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      }),

      sorter: (a, b) => {
        let nameA = a.Mentor.toUpperCase(); // ignore upper and lowercase
        let nameB = b.Mentor.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      },
      ...getColumnSearchProps('Mentor'),
      sortOrder: sortedInfo.columnKey === 'Mentor' && sortedInfo.order,
      filteredValue: filteredInfo?.Mentor || null,
      onFilter: (value, record) => record.Mentor.indexOf(value) === 0,
      render(text, record) {
        return cancelMentor(text, record);
      },
      width: 150,
      background: '#FFFFFF',
      fixed: 'left',
      align: 'left',
    },
    {
      title: 'Day',
      dataIndex: 'Day',
      key: 'Day',
      filters: days_filter,
      filteredValue: filteredInfo?.Day || null,
      sorter: (a, b) => {
        let day1 = a.Day.toLowerCase();
        let day2 = b.Day.toLowerCase();
        return sorter[day1] - sorter[day2];
      },
      sortOrder: sortedInfo.columnKey === 'Day' && sortedInfo.order,
      onFilter: (value, record) => record.Day.indexOf(value) === 0,
      width: 100,
      fixed: 'left',
      align: 'left',
    },
    {
      title: 'Block',
      dataIndex: 'Block',
      key: 'Block',
      filters: [
        { text: 'AM', value: 'AM' },
        { text: 'PM', value: 'PM' },
      ],
      filteredValue: filteredInfo?.Block || null,
      sorter: (a, b) => {
        let nameA = a.Block.toUpperCase(); // ignore upper and lowercase
        let nameB = b.Block.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      },
      sortOrder: sortedInfo.columnKey === 'Block' && sortedInfo.order,
      onFilter: (value, record) => record.Block.indexOf(value) === 0,
      width: 100,
      fixed: 'left',
      align: 'left',
    },
    {
      title: '08:00',
      dataIndex: '08:00:00',
      key: '08:00:00',
      render(text, record, index) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('08:00:00'),
      filteredValue: filteredInfo?.['08:00:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '08:20',
      dataIndex: '08:20:00',
      key: '08:20:00',
      render(text, record, index) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('08:20:00'),
      filteredValue: filteredInfo?.['08:20:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '08:40',
      dataIndex: '08:40:00',
      key: '08:40:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('08:40:00'),
      filteredValue: filteredInfo?.['08:40:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '09:00',
      dataIndex: '09:00:00',
      key: '09:00:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('09:00:00'),
      filteredValue: filteredInfo?.['09:00:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '09:20',
      dataIndex: '09:20:00',
      key: '09:20:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('09:20:00'),
      filteredValue: filteredInfo?.['09:20:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '09:40',
      dataIndex: '09:40:00',
      key: '09:40:00',
      render(text, record) {
        return cell_color(text, record);
      },

      filteredValue: filteredInfo?.['09:40:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '10:00',
      dataIndex: '10:00:00',
      key: '10:00:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('10:00:00'),
      filteredValue: filteredInfo?.['10:00:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '10:20',
      dataIndex: '10:20:00',
      key: '10:20',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('10:20:00'),
      filteredValue: filteredInfo?.['10:20:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '10:40',
      dataIndex: '10:40:00',
      key: '10:40:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('10:40:00'),
      filteredValue: filteredInfo?.['10:40:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '11:00',
      dataIndex: '11:00:00',
      key: '11:00:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('11:00:00'),
      filteredValue: filteredInfo?.['11:00:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '11:20',
      dataIndex: '11:20:00',
      key: '11:20:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('11:20:00'),
      filteredValue: filteredInfo?.['11:20:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '11:40',
      dataIndex: '11:40:00',
      key: '11:40:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('11:40:00'),
      filteredValue: filteredInfo?.['11:40:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '13:10',
      dataIndex: '13:10:00',
      key: '13:10:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('13:10:00'),
      filteredValue: filteredInfo?.['13:10:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '13:30',
      dataIndex: '13:30:00',
      key: '13:30:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('13:30:00'),
      filteredValue: filteredInfo?.['13:30:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '13:50',
      dataIndex: '13:50:00',
      key: '13:50:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('13:50:00'),
      filteredValue: filteredInfo?.['13:50:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '14:10',
      dataIndex: '14:10:00',
      key: '14:00:10',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('14:10:00'),
      filteredValue: filteredInfo?.['14:10:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '14:30',
      dataIndex: '14:30:00',
      key: '14:30:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('14:30:00'),
      filteredValue: filteredInfo?.['14:30:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '14:50',
      dataIndex: '14:50:00',
      key: '14:50:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('14:50:00'),
      filteredValue: filteredInfo?.['14:50:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '15:10',
      dataIndex: '15:10:00',
      key: '15:10:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('15:10:00'),
      filteredValue: filteredInfo?.['15:10:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '15:30',
      dataIndex: '15:30:00',
      key: '15:30:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('15:30:00'),
      filteredValue: filteredInfo?.['15:30:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '15:50',
      dataIndex: '15:50:00',
      key: '15:50:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('15:50:00'),
      filteredValue: filteredInfo?.['15:50:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '16:10',
      dataIndex: '16:10:00',
      key: '16:10:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('16:10:00'),
      filteredValue: filteredInfo?.['16:10:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '16:30',
      dataIndex: '16:30:00',
      key: '16:30:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('16:30:00'),
      filteredValue: filteredInfo?.['16:30:00'] || null,
      align: 'center',
      width: 130,
    },
    {
      title: '16:50',
      dataIndex: '16:50:00',
      key: '16:50:00',
      render(text, record) {
        return cell_color(text, record);
      },
      //...getColumnSearchProps('16:50:00'),
      filteredValue: filteredInfo?.['16:50:00'] || null,
      align: 'center',
      width: 130,
    },
  ];

  /* Block handles the state of the column tables to be rendered */
  const [block, setBlock] = useState(AllColumns);
  /*State that detects when a  meeting is cancelled */
  const [cancelMeeting, setCancelMeeting] = useState(0);

  /*   const getData = async (path) => {
    const response = await fetch(`http://localhost:3033/api/${path}`, {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
        Accept: 'aplication/json',
      },
    });
    return response.json();
  }; */

  useEffect(async () => {
    if (cancelMeeting === true) {
      setCancelMeeting(false);
      setRechargeMeetings(true);
    }
  }, [cancelMeeting]);

  /* This function is in charge to color format every cell on the schedule table according to the company */
  function cell_color(text, record, index, column) {
    if (text !== null) {
      let color = list_comp_colors.filter((obj) => {
        return obj.company === text;
      });
      let col_row;
      col_row = color ? color[0]?.color : '#FFFFFF';
      return {
        props: {
          style: {
            backgroundColor: col_row,
            borderRadius: '10px',
            bordered: '10px',
          },
        },
        children: (
          <CellPopUp
            text={text}
            record={record}
            setCancelMeeting={setCancelMeeting}
          />
        ),
      };
    } else {
      //return { children: <div>{text}</div> };
    }
  }

  /* This function is in charge to color format every cell on the schedule table according to the company */
  function cancelMentor(text, record) {
    return {
      children: (
        <CancelAllPopUp
          text={text}
          record={record}
          setCancelMeeting={setCancelMeeting}
        />
      ),
    };
  }

  /* Handle the change on the filter and sorters components */
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  /* Handles the clear for the filters */
  const clearFilters = () => {
    setFilteredInfo(null);
  };

  /* handles the display of the AM and PM tables */
  const handleBlock = () => {
    if (view >= 2) {
      setView(0);
    } else {
      setView(view + 1);
    }
  };
  let dataFilterAM = resSchedule.filter((row) => row.Block === 'AM');
  let dataFilterPM = resSchedule.filter((row) => row.Block === 'PM');
  let dataSources = [
    { data: dataFilterAM, columns: AM, name: 'AM' },
    { data: dataFilterPM, columns: PM, name: 'PM' },
    { data: resSchedule, columns: AllColumns, name: 'ALL' },
  ];
  /*  
  const dataFilterAMPop = dataFilterAM.map((obj) => {
    delete obj["Slots"];
    return obj;
  });
  const dataFilterPMPop = dataFilterPM.map((obj) => {
    delete obj["Slots"];
    return obj;
  }); */

  /* Generate the download file */ let download = jsonToCSV(
    JSON.stringify(resSchedule)
  ); /* +
    "\n\n\n\n" +
    jsonToCSV(JSON.stringify(dataFilterPMPop)); */

  /* render the button download if the data is available */
  const renderDownload = () => {
    if (resSchedule.length > 0) {
      return (
        <CSVDownloader
          //className='downloadBtn'
          data={download}
          type='button'
          filename={'schedule'}
          style={{
            color: '#fff',
            backgroundColor: '#39C463',
            borderRadius: '5px',
            height: 32,
            borderColor: '#39C463',
            width: 110,
            disable: true,
          }}
          bom={true}
        >
          Download
        </CSVDownloader>
      );
    }
  };

  const handleFilterCompany = () => {};

  const filterCompany = list_comp.map((row) => (
    <Select.Option value={row}>{row}</Select.Option>
  ));

  return (
    <>
      <Space style={{ marginBottom: 3, marginLeft: 30 }}>
        <span>Time View:</span>
        <Button onClick={handleBlock}>{dataSources[view].name}</Button>
        <Select
          placeholder={'Filter by company'}
          style={{ width: 200 }}
          onChange={handleFilterCompany}
        >
          {filterCompany}
        </Select>
        <Button onClick={clearFilters}>Clear filters</Button>
        {renderDownload()}
      </Space>
      {tableDisplay ? (
        <DndProvider backend={HTML5Backend}>
          <Table
            className='ant-table-layout-fixed'
            rowKey={(record) => record.uid}
            style={{ marginBottom: 5 }}
            bordered
            pagination={{ pageSize: 100 }}
            scroll={{ x: 'max-content' }}
            size='small'
            columns={dataSources[view].columns}
            sticky
            //dataSource={block === 'AM' ? dataFilterAM : dataFilterPM}
            dataSource={dataSources[view].data}
            onChange={handleChange}
          />
        </DndProvider>
      ) : null}
    </>
  );
};

export default TableSchedule;
