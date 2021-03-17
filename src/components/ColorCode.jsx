import React from 'react';
import { FireFilled } from '@ant-design/icons';

function ColorCode() {
  return (
    <>
      <h2>Matching Results</h2>
      <div className='colorCode'>
        <div className='perfectMatch'>
          <FireFilled />
          Perfect Match!
        </div>
        <div className='strongMatch'>
          <FireFilled />
          Strong Match
        </div>
        <div className='goodMatch'>
          <FireFilled />
          Good Match
        </div>
        <div className='willing'>
          <FireFilled />
          Willing to work
        </div>
        <div className='notMatch'>
          <FireFilled />
          Not a Match!
        </div>
        <div className='pending'>
          <FireFilled />
          Pending
        </div>
      </div>
    </>
  );
}
export default ColorCode;
