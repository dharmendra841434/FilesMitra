import {View, Text} from 'react-native';
import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import RootFolder from '../screens/RootFolder';
import OpenFolder from '../screens/OpenFolder';
import Info from '../screens/Info';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator();

const StackNav: FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="root">
        <Stack.Screen
          options={{
            title: 'File Manager',
            headerShown: false,
          }}
          name="root"
          component={RootFolder}
        />
        <Stack.Screen
          options={({route}) => ({
            headerShown: false,
          })}
          name="open"
          component={OpenFolder}
        />
        <Stack.Screen
          options={({route}) => ({
            headerShown: false,
          })}
          name="info"
          component={Info}
        />
        <Stack.Screen
          options={({route}) => ({
            headerShown: false,
          })}
          name="search"
          component={SearchScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNav;
