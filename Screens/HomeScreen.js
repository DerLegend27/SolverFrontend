
import React, { useRef } from "react";
import {
    View,
    StyleSheet,
    Image,
    Text
} from 'react-native'
import {Camera} from '../Components/Camera' 



export const HomeScreen = ({navigation}) =>{
   const camRef = useRef()
    return(
    <View style={styles.container}>
        <Camera style={styles.cam} navigation = {navigation}/>     
    </View>
   );
}

const styles = StyleSheet.create({
    
    container: {
      flex: 0,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: "center",
      width: "100%",
      height: "100%",
     
    },
    
    cam: {
        flex: 0,
        width: "100%",
        height: "100%"
    }
   
  });


