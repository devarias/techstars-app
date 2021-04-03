import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  UserOutlined,
  TeamOutlined,
  ScheduleOutlined,
  CalendarOutlined,
  HomeOutlined,
  EyeOutlined,
  TableOutlined,
  UploadOutlined,
  LogoutOutlined,
  ContactsOutlined,
  StarOutlined,
} from '@ant-design/icons';
import logoUrl from '../images/logo-dark.png';

const { SubMenu } = Menu;

function NavSider({ setView, viewSelect }) {
  const handleView = ({ key }) => {
    setView(key);
  };
  const { logout } = useAuth0();
  return (
    <>
      <div className='logo'>
        <a href='https://techstars.com'>
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
          <Link to='/'>Home</Link>
        </Menu.Item>
        <SubMenu key='sub2' title='Matching' icon={<TeamOutlined />}>
          <Menu.Item key='1' icon={<EyeOutlined />}>
            <Link to='/SurveyStatus'>Tracking</Link>
          </Menu.Item>
          <Menu.Item key='2' icon={<StarOutlined />}>
            <Link to='/Performance'>Performance</Link>
          </Menu.Item>
          <Menu.Item key='3' icon={<TableOutlined />}>
            <Link to='/Results'>Results</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key='sub3' title='Scheduling' icon={<ScheduleOutlined />}>
          <Menu.Item key='4' icon={<UploadOutlined />}>
            <Link to='/GenerateMeetings'>Generate Meetings</Link>
          </Menu.Item>
          <Menu.Item key='5' icon={<CalendarOutlined />}>
            <Link to='/MeetingsTable'>Meetings Table</Link>
          </Menu.Item>
          <Menu.Item key='6' icon={<ContactsOutlined />}>
            <Link to='/Schedule'>Schedule</Link>
          </Menu.Item>
          <Menu.Item key='7' icon={<UserOutlined />}>
            <Link to='/Mentors'>Mentors</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key='8' icon={<LogoutOutlined />}>
          <Link onClick={() => logout()}>Log out</Link>
        </Menu.Item>
      </Menu>
    </>
  );
}
export default NavSider;
