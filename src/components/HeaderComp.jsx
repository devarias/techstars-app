import React, { useState, useEffect } from 'react';
import '../styles/header.css';
import { Progress } from 'antd';
import TutorialComp from './TutorialComp';
import { counter } from './Survey';

function HeaderComp() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(counter);
    }, 1000);
    return () => clearInterval(interval);
  }, [counter]);

  return (
    <div className='barbckg'>
      <div className='bar'>{<Progress percent={parseInt(counter)} />}</div>
      <TutorialComp />
    </div>
  );
}

export default HeaderComp;
