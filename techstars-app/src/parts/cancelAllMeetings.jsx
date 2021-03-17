import React from 'react';
import { Button } from 'antd';

const CancelAll = ({ text, record, setPopUp, setCancelMeeting }) => {
  const cancelMeeting = () => {
    const makeObject = () => {
      const objToSend = [{ mentor: '', Companies: [] }];
      for (let k in record) {
        if (k === 'Mentor') {
          objToSend[0].mentor = record[k];
        } else if (
          k !== 'Day' &&
          k !== 'Block' &&
          k !== 'mentor_id' &&
          k !== 'Email' &&
          record[k] !== null
        ) {
          objToSend[0].Companies.push(record[k]);
        }
      }
      return objToSend;
    };
    const bodyData = makeObject();
    setPopUp(false);
    fetch(
      'https://techstars-api.herokuapp.com/api/meetings' /* Route to send the CSV file to 
                                                    generate the schedule */,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(bodyData),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        alert(result.message);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
    setCancelMeeting(true);
  };

  return (
    <>
      <Button type='link' onClick={cancelMeeting}>
        Cancel ALL mentor Meetings
      </Button>
      {/* <br />
      <Button type="link" onClick={cancelMeeting}>
        Posible Reschedulings
      </Button> */}
    </>
  );
};

export default CancelAll;
