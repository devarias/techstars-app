import React, { useState } from 'react';
import { Table, Button } from 'antd';
import RescheduleButton from '../parts/buttonReschedule';
import SelectionButton from '../parts/buttonSelection';

const TableReschedule = ({
  mentors,
  pendingMeetings,
  setRechargeReschedule,
}) => {
  const [possibleMeetings, setPossibleMeetings] = useState([]);
  const [view, setView] = useState(0);
  /* FilteredInfo handles the mentors and days to be filtered */
  const [filteredInfo, setFilteredInfo] = useState({});
  /* SortedInfo handles the information for sorting the mentor column */
  const [sortedInfo, setSortedInfo] = useState({});
  console.log(possibleMeetings);
  const mentor_list = pendingMeetings.map((row) => {
    return { text: row.mentor, value: row.mentor };
  });

  const columnsAction = [
    {
      title: 'Mentor',
      width: 100,
      dataIndex: 'mentor',
      key: 'mentor',
      fixed: 'left',
      filters: mentor_list.sort(function (a, b) {
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
        let nameA = a.mentor.toUpperCase(); // ignore upper and lowercase
        let nameB = b.mentor.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      },
      sortOrder: sortedInfo.columnKey === 'mentor' && sortedInfo.order,
      filteredValue: filteredInfo?.Mentor || null,
    },
    {
      title: 'Companies',
      width: 100,
      dataIndex: 'Companies',
      key: 'Companies',
      fixed: 'left',
      render(record) {
        let text = record.join(', ');
        return { children: <div>{text}</div> };
      },
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (record) => (
        <RescheduleButton
          record={record}
          setPossibleMeetings={setPossibleMeetings}
          setView={setView}
        />
      ),
    },
  ];

  const columnsSelection = [
    {
      title: 'Mentor',
      width: 100,
      dataIndex: 'Mentor',
      key: 'mentor1',
      fixed: 'left',
    },
    {
      title: 'Day',
      width: 100,
      dataIndex: 'Day',
      key: 'Day',
      fixed: 'left',
      filters: mentor_list.sort(function (a, b) {
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
        let nameA = a.Day.toUpperCase(); // ignore upper and lowercase
        let nameB = b.Day.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      },
      sortOrder: sortedInfo.columnKey === 'Day' && sortedInfo.order,
      filteredValue: filteredInfo?.Mentor || null,
    },
    {
      title: 'Block',
      width: 100,
      dataIndex: 'Block',
      key: 'Block',
      fixed: 'left',
      filters: mentor_list.sort(function (a, b) {
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
      filteredValue: filteredInfo?.Mentor || null,
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (record) => (
        <SelectionButton
          view={view}
          record={record}
          setRechargeReschedule={setRechargeReschedule}
          setView={setView}
        />
      ),
    },
  ];
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const pageView = [
    <Table
      title={() =>
        'Please click on reschedule to display the options for the mentor'
      }
      size='small'
      columns={columnsAction}
      dataSource={pendingMeetings}
      scroll={{ x: 'max-content' }}
      pagination={{ pageSize: 50 }}
      onChange={handleChange}
    />,
    <Table
      title={() =>
        'These are the available options to reschedule the mentor. \nPlease select a day and block and click on program meetings to generate the new schedule'
      }
      size='small'
      columns={columnsSelection}
      dataSource={possibleMeetings}
      scroll={{ x: 'max-content' }}
      pagination={{ pageSize: 50 }}
      onChange={handleChange}
    />,
  ];

  return <>{pageView[view]}</>;
};

export default TableReschedule;
