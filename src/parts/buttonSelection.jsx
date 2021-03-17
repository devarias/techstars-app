import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

const SelectionButton = ({ record, setRechargeReschedule, setView }) => {
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched === true) {
      setRechargeReschedule(true);
      setView(0);
      setFetched(false);
      return () => {};
    }
  }, [fetched]);

  const cancelMeeting = () => {
    fetch(
      'https://techstars-api.herokuapp.com/api/reschedule' /* Route to send the CSV file to 
                                                    generate the schedule */,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(record),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        alert(result.message);
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
        Program meetings
      </Button>
    </>
  );
};

export default SelectionButton;
