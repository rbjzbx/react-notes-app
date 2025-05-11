import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/routes';
const App = () => {
  return (
    <div className='AppBox'>
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
};

export default App;
