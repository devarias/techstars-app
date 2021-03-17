import React, { useState } from 'react';
import { Popover } from 'antd';
import PopButtons from './buttonsOfPopUp';
import '../styles/CellPopOver.css';
/**
 * component that renders the popup menu of each cell on tableschedule
 * props:
 * @param {text} : the company name for the cell
 * @param {record}: It is used to detect with row was activated and return his key
 * fetch the cancel action to the backend
 * @returns None
 */
const CellPopUp = ({ text, record, setCancelMeeting, setView }) => {
  /* Handles the popUp action on the cell table */
  const [popUp, setPopUp] = useState(false);

  const handleVisiblePopUp = (visible) => {
    setPopUp(popUp ? false : true);
  };
  return (
    <Popover
      content={
        <PopButtons
          text={text}
          record={record}
          setPopUp={setPopUp}
          setCancelMeeting={setCancelMeeting}
          setView={setView}
        />
      }
      style={{ borderRadius: 20 }}
      trigger='click'
      visible={popUp}
      onVisibleChange={handleVisiblePopUp}
    >
      <a href='#' id='cellPop'>
        <div>{text}</div>
      </a>
    </Popover>
  );
};

export default CellPopUp;
