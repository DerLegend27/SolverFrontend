
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Button
} from 'react-native'


 export const HomeScreen = () =>{
   return(
    <View style={styles.container}>
        <Image source = {require("/Users/lewin/Documents/SolverFrontend/Download.jpeg")}/>
        
        <Button title="Calculate"/>
        
    </View>
   );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
     
    } 
  });


