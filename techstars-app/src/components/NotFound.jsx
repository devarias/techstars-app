import React from 'react';
import '../styles/NotFound.css';

function NotFound() {
  return (
    <div id='notfound'>
      <div class='notfound'>
        <div class='notfound-404'>
          <h1>
            4<span>0</span>4
          </h1>
        </div>
        <p>
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <a href='/Home'>Back to Home</a>
      </div>
    </div>
  );
}
export default NotFound;
