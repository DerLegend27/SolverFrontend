
import React, { useRef } from "react";
import {
    View,
    StyleSheet,
    Image,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native'
import {Camera} from '../Components/Camera' 
import { ScanBtn } from "../Components/ScanBtn";



export const InputScreen = ({navigation}) =>{
    const [text, onChangeText] = React.useState("Useless Text");
    var count = 0
    const step = () =>{
        if(count > 0){
            navigation.navigate('Result', { croppedPic: text, pic: text, field: text })
        }else{
            count = count +1
        }
    }

    return(
    <View style={styles.container}>
        <TextInput style={styles.input} value={text} onChangeText={onChangeText}/>
        <ScanBtn onPress={step} bottom={32} text={"Ausrechnen"}/>
    </View>
   );
}



const styles = StyleSheet.create({
    
    container: {
      flex: 0,
      justifyContent:"center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      backgroundColor: "black"
        
    },
    
    input: {
        height: 60,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor:"white"
      },
   
  });


