import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';

const Root = () => (
  <div>
    Hello World
  </div>
);

ReactDOM.render(<Root />, document.getElementById('root'));
