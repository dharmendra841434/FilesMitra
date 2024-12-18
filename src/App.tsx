import React from 'react';
import StackNav from './navigation/StackNav';
import {StatusBar} from 'react-native';

const App = () => {
  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="rgba(0,0,0,0)"
      />
      <StackNav />
    </>
  );
};

export default App;
