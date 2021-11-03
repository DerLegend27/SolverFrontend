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

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';


const Stack = createNativeStackNavigator();

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
       <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Result" component={ResultScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};






export default App;
