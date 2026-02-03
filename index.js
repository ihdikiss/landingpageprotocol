
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

const container = document.getElementById('root');
if (container) {
  // استخدام النسخة المتوافقة مع CDN لـ ReactDOM
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(App));
}
