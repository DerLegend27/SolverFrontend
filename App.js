/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { bold } from 'ansi-colors';
import { BackgroundColor } from 'jest-matcher-utils/node_modules/chalk';
import React from 'react';
import {Node} from 'react';
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


const Header = ({title}) => {
  return (<Text style={{fontWeight:"bold"}}>{title}</Text>)
}

const App = () => {
  
  return (
    <View style={styles.container}>
        <Button style={styles.btn} title="Connect" color="blue"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
   
},



  
});

export default App;
