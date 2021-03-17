import React from 'react';
import { Row, Col, Space } from 'antd';
import DeleteMentor from '../parts/formDeleteMentors';
import AddMentor from '../parts/formAddMentor';
import '../styles/EditMentors.css';

const EditMentors = ({ mentors, companies, setReloadMentors }) => {
  return (
    <>
      <Row className='editMentors'>
        <Col span={12} id='boxDeleteMentors'>
          <DeleteMentor mentors={mentors} setReloadMentors={setReloadMentors} />
        </Col>
        <Col span={12} id='boxAddMentors'>
          <AddMentor
            mentors={mentors}
            companies={companies}
            setReloadMentors={setReloadMentors}
          />
        </Col>
      </Row>
    </>
  );
};

export default EditMentors;
