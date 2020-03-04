import React from 'react';
import Users from './Users';
import UsersUseReducer from './UsersUseReducer';
import { UsersProvider } from './UsersContextBasic';

function App() {
  return (
    <UsersProvider>
      <Users/>
    </UsersProvider>
  );
}

export default App;
