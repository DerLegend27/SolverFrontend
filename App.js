/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React from 'react';
import {HomeScreen} from './Screens/HomeScreen';
import {ResultScreen} from './Screens/ResultScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator();

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions ={{headerShown:false, gestureEnabled: false}}>
       <Stack.Screen name="Home" component={HomeScreen} options={{animationEnabled: false}} />
        <Stack.Screen name="Result" component={ResultScreen} options={{animationEnabled: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};






export default App;
