import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Select } from 'antd';
import { CSVDownloader, jsonToCSV } from 'react-papaparse';
import CellPopUp from '../parts/CellPopOver';
import CancelAllPopUp from '../parts/cancelAllPopUp';
const { Option } = Select;

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

/**
 * TableSchedule is the component to generate the data table for the schedule.
 * @resSchedule: is the information retrieved form the back-end to generate the scheduling table
 * the request is done on the UploadFile.jsx
 */
const TableSchedule = ({
  resSchedule,
  companies,
  tableDisplay,
  setRechargeMeetings,
}) => {
  /* Block handles the state of the column tables to be rendered */
  const [block, setBlock] = useState('AM');
  /* FilteredInfo handles the mentors and days to be filtered */
  const [filteredInfo, setFilteredInfo] = useState({});
  /* SortedInfo handles the information for sorting the mentor column */
  const [sortedInfo, setSortedInfo] = useState({});
  /*State that detects when a  meeting is cancelled */
  const [cancelMeeting, setCancelMeeting] = useState(0);

  useEffect(async () => {
    if (cancelMeeting === true) {
      setCancelMeeting(false);
      setRechargeMeetings(true);
    }
  }, [cancelMeeting]);

  /* Wrangling the recieved data to generate the list to filter the mentors and the days*/
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

  const AM = [
    {
      title: 'Mentor',
      dataIndex: 'Mentor',
      key: 'Mentor',
      filters: mentor_am.sort(function (a, b) {
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
      align: 'center',
      width: 130,
    },
  ];

  /* This function is in charge to color format every cell on the schedule table according to the company */
  function cell_color(text, record) {
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
  const handleBlock = (value) => {
    setBlock(value);
  };
  let dataFilterAM = resSchedule.filter((row) => row.Block === 'AM');
  let dataFilterPM = resSchedule.filter(
    (row) => row.Block === 'PM'
  ); /*  
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
          className='downloadBtn'
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

  return (
    <>
      <Space style={{ marginBottom: 16, marginLeft: 20 }}>
        <span>Select Block:</span>
        <Select defaultValue='AM' style={{ width: 110 }} onChange={handleBlock}>
          <Option value='AM'>AM</Option>
          <Option value='PM'>PM</Option>
        </Select>
        <Button onClick={clearFilters}>Clear filters</Button>
        {renderDownload()}
      </Space>
      {tableDisplay ? (
        <Table
          className='ant-table-layout-fixed'
          rowKey={(record) => record.uid}
          style={{ marginBottom: 5 }}
          bordered
          pagination={{ pageSize: 50 }}
          scroll={{ x: 'max-content' }}
          size='small'
          columns={block === 'AM' ? AM : PM}
          sticky
          dataSource={block === 'AM' ? dataFilterAM : dataFilterPM}
          onChange={handleChange}
        />
      ) : null}
    </>
  );
};

export default TableSchedule;
