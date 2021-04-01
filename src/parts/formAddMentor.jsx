import React from 'react';
import { Form, Input, Button, Select, Space } from 'antd';
const { Option } = Select;

const AddMentor = ({ companies, setReloadMentors }) => {
  const [form] = Form.useForm();
  const submitaddMentor = async (value) => {
    form.resetFields();
    let bodyData = JSON.stringify([
      { mentor: value.mentor, email: value.email, Companies: value.Companies },
    ]);
    await fetch(
      'https://techstars-api.herokuapp.com/api/mentors' /* Route to send the CSV file to 
                                                    generate the schedule */,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: bodyData,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        alert('Mentor Created');
        setReloadMentors(true);
      })
      .catch((error) => {
        alert('Error:', error);
      });
  };

  const listCompanies = companies.map((row) => (
    <Option value={row.company}>{row.company}</Option>
  ));

  return (
    <>
      <Space>
        <h1>Add Mentor</h1>
      </Space>
      <Form
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout='horizontal'
        initialValues={{
          size: 'small',
        }}
        onFinish={submitaddMentor}
        initialValues={{
          remember: false,
        }}
      >
        <Form.Item
          name='mentor'
          label='Mentor Name'
          rules={[
            {
              required: true,
              message: 'Please input mentor name!',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='email'
          label='Mentor Email'
          rules={[
            {
              required: true,
              message: 'Please input mentor email!',
              whitespace: true,
            },
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='emailConfirmation'
          label='Confirm Mentor Email'
          dependencies={['email']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please input again the mentor email!',
              whitespace: true,
            },
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('email') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error('The two emails that you entered do not match!')
                );
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='Companies'
          label='Select Companies'
          rules={[
            {
              required: true,
              message: 'Please input at least one company!',
            },
          ]}
        >
          <Select mode='multiple'>{listCompanies}</Select>
        </Form.Item>
        <Form.Item style={{ paddingLeft: 162 }}>
          <Button type='primary' htmlType='submit' style={{ borderRadius: 5 }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddMentor;
