import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

const RescheduleButton = ({ view, record, setPossibleMeetings, setView }) => {
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched === true) {
      setView(1);
      setFetched(false);
      return () => {};
    }
  }, [fetched]);

  const cancelMeeting = () => {
    fetch(
      'https://techstars-api.herokuapp.com/api/reschedule' /* Route to send the CSV file to 
                                                    generate the schedule */,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify([record]),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setPossibleMeetings(result);
        setFetched(true);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };
  return (
    <>
      <Button
        type='primary'
        onClick={cancelMeeting}
        style={{ borderRadius: 5 }}
      >
        Reschedule
      </Button>
    </>
  );
};

export default RescheduleButton;
