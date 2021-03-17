import React from 'react';
import { Button } from 'antd';

const PopButtons = ({ text, record, setPopUp, setCancelMeeting }) => {
  const cancelMeeting = () => {
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
        body: JSON.stringify([{ mentor: record.Mentor, Companies: [text] }]),
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
    <div>
      <Button type='link' onClick={cancelMeeting}>
        Cancel Meeting
      </Button>
      <br />
    </div>
  );
};

export default PopButtons;
