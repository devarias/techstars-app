import React from 'react';
import { Form, Button, Select, Space } from 'antd';

const DeleteMentor = ({ mentors, setReloadMentors }) => {
  const [form] = Form.useForm();
  const cancelMentor = (value) => {
    form.resetFields();
    let bodyData = JSON.stringify({ mentor: value.mentor });
    fetch(
      'https://techstars-api.herokuapp.com/api/mentors' /* Route to send the CSV file to 
                                                    generate the schedule */,
      {
        method: 'Delete',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: bodyData,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        alert('Mentor Deleted');
        setReloadMentors(true);
      })
      .catch((error) => {
        alert('Error:', error);
      });
  };
  const listMentors = mentors.map((row) => (
    <Select.Option value={row.mentor}>{row.mentor}</Select.Option>
  ));
  return (
    <>
      <Space>
        <h1>Delete Mentor</h1>
      </Space>
      <Form
        form={form}
        name='Delete Mentor'
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout='Horizontal'
        initialValues={{
          size: 'small',
        }}
        onFinish={cancelMentor}
      >
        <Form.Item
          name='mentor'
          label='Select Mentor'
          rules={[
            {
              required: true,
              message: 'Please input a mentor!',
            },
          ]}
        >
          <Select>{listMentors}</Select>
        </Form.Item>
        <Form.Item style={{ paddingLeft: 143 }}>
          <Button type='primary' htmlType='submit' style={{ borderRadius: 5 }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DeleteMentor;
