import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  UserOutlined,
  TeamOutlined,
  ScheduleOutlined,
  CalendarOutlined,
  HomeOutlined,
  BarChartOutlined,
  TableOutlined,
  UploadOutlined,
  LogoutOutlined,
  ContactsOutlined,
} from '@ant-design/icons';
import logoUrl from '../images/logo-dark.png';
import LogoutButton from './LogoutButton';

const { SubMenu } = Menu;

function NavSider({ setView, viewSelect }) {
  const handleView = ({ key }) => {
    console.log(key);
    setView(key);
  };
  return (
    <>
      <div className='logo'>
        <a href='#'>
          <img src={logoUrl} alt='techstarts icon' />
        </a>
      </div>
      <Menu
        theme='dark'
        selectedKeys={viewSelect}
        mode='inline'
        onClick={handleView}
      >
        <Menu.Item key='0' icon={<HomeOutlined />}>
          <Link to='/Home'>Home</Link>
        </Menu.Item>
        <SubMenu key='sub2' title='Matching' icon={<TeamOutlined />}>
          <Menu.Item key='1' icon={<BarChartOutlined />}>
            <Link to='/SurveyStatus'>Survey Status</Link>
          </Menu.Item>
          <Menu.Item key='2' icon={<TableOutlined />}>
            <Link to='/Results'>Results</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key='sub3' title='Scheduling' icon={<ScheduleOutlined />}>
          <Menu.Item key='3' icon={<UploadOutlined />}>
            <Link to='/GenerateMeetings'>Generate Meetings</Link>
          </Menu.Item>
          <Menu.Item key='4' icon={<CalendarOutlined />}>
            <Link to='/MeetingsTable'>Meetings Table</Link>
          </Menu.Item>
          <Menu.Item key='5' icon={<ContactsOutlined />}>
            <Link to='/Reschedule'>Reschedule</Link>
          </Menu.Item>
          <Menu.Item key='6' icon={<UserOutlined />}>
            <Link to='/Edit Mentors'>Edit Mentors</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key='8' icon={<LogoutOutlined />}>
          <LogoutButton />
        </Menu.Item>
      </Menu>
    </>
  );
}
export default NavSider;
