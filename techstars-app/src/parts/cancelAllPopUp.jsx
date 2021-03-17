import React, { useState } from 'react';
import { Popover } from 'antd';
import CancelAll from './cancelAllMeetings';
import '../styles/CellPopOver.css';
/**
 * component that renders the popup menu of each cell on tableschedule
 * props:
 * @param {text} : the company name for the cell
 * @param {record}: It is used to detect with row was activated and return his key
 * fetch the cancel action to the backend
 * @returns None
 */
const CancelAllPopUp = ({ text, record, setCancelMeeting }) => {
  /* Handles the popUp action on the cell table */
  const [popUp, setPopUp] = useState(false);

  const handleVisiblePopUp = (visible) => {
    setPopUp(popUp ? false : true);
  };
  return (
    <Popover
      content={
        <CancelAll
          text={text}
          record={record}
          setPopUp={setPopUp}
          setCancelMeeting={setCancelMeeting}
        />
      }
      style={{ borderRadius: 20 }}
      trigger='click'
      visible={popUp}
      onVisibleChange={handleVisiblePopUp}
    >
      <a href='#' id='cellPop'>
        {text}
      </a>
    </Popover>
  );
};

export default CancelAllPopUp;
