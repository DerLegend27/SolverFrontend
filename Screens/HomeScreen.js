
import React, { useRef } from "react";
import {
    View,
    StyleSheet,
    Image
} from 'react-native'
import {Camera} from '../Components/Camera' 


export const HomeScreen = ({navigation}) =>{
   const camRef = useRef()
    return(
    <View style={styles.container}>
        <Image style={{flex:0, width:"100%", height:"15%"}}source = {require("../Download.jpeg")}/>
        <Camera navigation = {navigation}/>    
            
    </View>
   );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between'
     
    },
    
    cam: {
        width: 300,
        height: 300,
    }, 
    btn: {
        flex: 0,
        height: 50,
        width: 100,
        marginBottom: "20%",
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
        
    }
   
  });


