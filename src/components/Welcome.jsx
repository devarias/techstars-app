import React from 'react';
import '../styles/Welcome.css';

function Welcome() {
  return (
    <div className='firstView'>
      <span className='title'>Welcome to</span>
      <img
        className='welcome'
        src='https://raw.githubusercontent.com/devarias/TechstarsPortfolioProject/survey/techstar_app/src/img/WhiteLogo.png'
      />
    </div>
  );
}
export default Welcome;
